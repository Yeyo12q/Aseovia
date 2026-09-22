/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

/**
 * Convierte un nombre de usuario en un identificador seguro para Firebase Auth
 * sin que el usuario tenga que ingresar o ver jamás un correo electrónico.
 */
export function formatInternalUsername(username: string): string {
  const clean = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '');
  return `${clean || 'user'}@aseovia.local`;
}

/**
 * Extrae el nombre de usuario limpio desde el identificador interno
 */
export function extractUsername(emailOrSynthetic: string | null | undefined): string {
  if (!emailOrSynthetic) return '';
  const atIndex = emailOrSynthetic.indexOf('@');
  if (atIndex !== -1) {
    return emailOrSynthetic.substring(0, atIndex);
  }
  return emailOrSynthetic;
}

/**
 * Obtener usuario actualmente activo desde almacenamiento local
 */
export function getActiveUser(): UserProfile | null {
  try {
    const data = localStorage.getItem('aseovia_active_user');
    if (data) {
      return JSON.parse(data) as UserProfile;
    }
  } catch {}
  return null;
}

function setActiveUser(profile: UserProfile | null): void {
  try {
    if (profile) {
      localStorage.setItem('aseovia_active_user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('aseovia_active_user');
    }
    window.dispatchEvent(
      new CustomEvent('aseovia_auth_changed', { detail: profile })
    );
  } catch {}
}

/**
 * Iniciar sesión con nombre de usuario y contraseña
 */
export async function loginWithUsername(
  username: string,
  pass: string
): Promise<UserProfile> {
  const cleanUsername = username.trim().toLowerCase();
  const rawUsername = username.trim();

  if (!cleanUsername) {
    throw new Error('Debes ingresar tu nombre de usuario.');
  }
  if (!pass) {
    throw new Error('Debes ingresar tu contraseña.');
  }

  // 1. Acceso directo y prioritario para el Administrador Oficial
  if (cleanUsername === 'yeyoadmin01') {
    if (pass === 'Kira01') {
      const adminProfile: UserProfile = {
        uid: 'admin_yeyo_01',
        username: 'YeyoAdmin01',
        rol: 'admin',
        creadoEn: new Date().toISOString(),
      };

      // Guardar sesión activa de inmediato
      setActiveUser(adminProfile);

      // Sincronizar en Firestore sin bloquear
      try {
        const userDocRef = doc(db, 'usuarios', 'admin_yeyo_01');
        await setDoc(userDocRef, adminProfile, { merge: true });
      } catch (err) {
        console.warn('Firestore sync advertencia:', err);
      }

      // Intentar también en Firebase Auth si el método está habilitado (sin fallar si operation-not-allowed)
      const syntheticEmail = formatInternalUsername('yeyoadmin01');
      try {
        await signInWithEmailAndPassword(auth, syntheticEmail, pass);
      } catch (authErr: any) {
        if (
          authErr.code === 'auth/user-not-found' ||
          authErr.code === 'auth/invalid-credential'
        ) {
          try {
            await createUserWithEmailAndPassword(auth, syntheticEmail, pass);
          } catch {}
        }
      }

      return adminProfile;
    } else {
      throw new Error('Contraseña incorrecta para el usuario YeyoAdmin01.');
    }
  }

  // 2. Otros usuarios
  const syntheticEmail = formatInternalUsername(cleanUsername);

  // Intentar autenticación con Firebase Auth
  try {
    const cred = await signInWithEmailAndPassword(auth, syntheticEmail, pass);
    const profile = await getUserProfile(cred.user.uid, rawUsername);
    setActiveUser(profile);
    return profile;
  } catch (err: any) {
    // Si la operación no está permitida en Firebase Auth (proveedor deshabilitado en consola)
    // consultar el registro local o en Firestore
    if (err.code === 'auth/operation-not-allowed') {
      try {
        const localAccounts = localStorage.getItem('aseovia_registered_users');
        if (localAccounts) {
          const accounts: Array<{ username: string; pass: string; rol: 'admin' | 'cliente' }> =
            JSON.parse(localAccounts);
          const found = accounts.find(
            (a) => a.username.toLowerCase() === cleanUsername && a.pass === pass
          );
          if (found) {
            const profile: UserProfile = {
              uid: `usr_${cleanUsername}`,
              username: found.username,
              rol: found.rol,
              creadoEn: new Date().toISOString(),
            };
            setActiveUser(profile);
            return profile;
          }
        }
      } catch {}

      throw new Error(
        'El usuario o contraseña no coinciden. Para acceder como administrador utiliza YeyoAdmin01 y Kira01.'
      );
    }

    if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password'
    ) {
      throw new Error('Nombre de usuario o contraseña incorrectos.');
    }
    if (err.code === 'auth/too-many-requests') {
      throw new Error(
        'Demasiados intentos fallidos. Por favor espera un momento e intenta nuevamente.'
      );
    }
    throw new Error(err.message || 'Error al iniciar sesión.');
  }
}

/**
 * Registrar una cuenta con nombre de usuario y contraseña
 */
export async function registerWithUsername(
  username: string,
  pass: string,
  rol: 'admin' | 'cliente' = 'admin'
): Promise<UserProfile> {
  const cleanUsername = username.trim().toLowerCase();
  const rawUsername = username.trim();

  if (cleanUsername.length < 3) {
    throw new Error('El nombre de usuario debe tener al menos 3 caracteres.');
  }
  if (pass.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }

  // Guardar en registro local siempre como contingencia
  try {
    const localAccounts = localStorage.getItem('aseovia_registered_users');
    const accounts: Array<{ username: string; pass: string; rol: 'admin' | 'cliente' }> =
      localAccounts ? JSON.parse(localAccounts) : [];
    if (!accounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
      accounts.push({ username: rawUsername, pass, rol });
      localStorage.setItem('aseovia_registered_users', JSON.stringify(accounts));
    }
  } catch {}

  const syntheticEmail = formatInternalUsername(cleanUsername);

  try {
    const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, pass);
    const userDocRef = doc(db, 'usuarios', cred.user.uid);
    const profile: UserProfile = {
      uid: cred.user.uid,
      username: rawUsername,
      rol,
      creadoEn: new Date().toISOString(),
    };
    await setDoc(userDocRef, profile, { merge: true });
    setActiveUser(profile);
    return profile;
  } catch (err: any) {
    if (err.code === 'auth/operation-not-allowed') {
      // Registrar localmente y en Firestore
      const fallbackUid = `usr_${Date.now()}`;
      const profile: UserProfile = {
        uid: fallbackUid,
        username: rawUsername,
        rol,
        creadoEn: new Date().toISOString(),
      };
      try {
        const userDocRef = doc(db, 'usuarios', fallbackUid);
        await setDoc(userDocRef, profile, { merge: true });
      } catch {}
      setActiveUser(profile);
      return profile;
    }

    if (err.code === 'auth/email-already-in-use') {
      throw new Error(
        `El usuario "${cleanUsername}" ya se encuentra registrado. Si es tuyo, inicia sesión.`
      );
    }
    if (err.code === 'auth/weak-password') {
      throw new Error('La contraseña debe tener un mínimo de 6 caracteres.');
    }
    throw new Error(err.message || 'Error al registrar usuario.');
  }
}

/**
 * Obtener perfil de usuario desde Firestore
 */
export async function getUserProfile(
  uid: string,
  fallbackUsername?: string
): Promise<UserProfile> {
  try {
    const userDocRef = doc(db, 'usuarios', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (e) {
    console.warn('No se pudo leer perfil desde Firestore, usando datos de sesión:', e);
  }

  return {
    uid,
    username: fallbackUsername || 'admin',
    rol: 'admin',
    creadoEn: new Date().toISOString(),
  };
}

/**
 * Cerrar sesión
 */
export async function logoutUser(): Promise<void> {
  setActiveUser(null);
  try {
    await signOut(auth);
  } catch {}
}

/**
 * Suscribirse a cambios en la sesión de autenticación
 */
export function subscribeToAuth(
  callback: (user: UserProfile | null) => void
): () => void {
  // 1. Notificar estado activo guardado de inmediato
  const currentActive = getActiveUser();
  if (currentActive) {
    callback(currentActive);
  }

  // 2. Escuchar cambios de eventos locales
  const handleAuthChange = (e: any) => {
    callback(e.detail !== undefined ? e.detail : getActiveUser());
  };
  window.addEventListener('aseovia_auth_changed', handleAuthChange);

  // 3. Escuchar Firebase Auth
  const unsubscribeFirebase = onAuthStateChanged(auth, async (user: User | null) => {
    if (!user) {
      if (!getActiveUser()) {
        callback(null);
      }
      return;
    }
    const username = extractUsername(user.email);
    const profile = await getUserProfile(user.uid, username);
    setActiveUser(profile);
    callback(profile);
  });

  return () => {
    unsubscribeFirebase();
    window.removeEventListener('aseovia_auth_changed', handleAuthChange);
  };
}

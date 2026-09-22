import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { loginWithUsername, registerWithUsername } from '../services/authService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('YeyoAdmin01');
  const [password, setPassword] = useState('Kira01');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    if (!cleanUser) {
      setError('Por favor ingresa tu nombre de usuario.');
      return;
    }

    if (!password) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    try {
      let profile: UserProfile;
      if (mode === 'login') {
        profile = await loginWithUsername(cleanUser, password);
      } else {
        profile = await registerWithUsername(cleanUser, password, 'admin');
      }

      onSuccess(profile);
      onClose();
    } catch (err: any) {
      console.error('Error de autenticación:', err);
      setError(err.message || 'Error al procesar las credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header: Clean Corporate Login */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Plataforma Aseo Vía
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-1.5 bg-slate-100 flex gap-1 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registrar Cuenta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Credential Helper for YeyoAdmin01 */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-950 flex items-center justify-between gap-2 shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                <span>Credenciales de Administrador:</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Usuario: <span className="font-mono font-bold text-slate-900">YeyoAdmin01</span> · Clave: <span className="font-mono font-bold text-slate-900">Kira01</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername('YeyoAdmin01');
                setPassword('Kira01');
                setError(null);
              }}
              className="px-2.5 py-1 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold text-[10px] transition-colors cursor-pointer shrink-0"
            >
              Rellenar
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></div>
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre de Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: yeyo o admin"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                required
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Ver contraseña"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-[11px] text-slate-500 mt-1">
                La contraseña debe tener al menos 6 caracteres.
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-sky-700 hover:bg-sky-800 disabled:bg-slate-400 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Validando...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          <span>Solo requiere usuario y contraseña · Acceso seguro</span>
        </div>
      </div>
    </div>
  );
};

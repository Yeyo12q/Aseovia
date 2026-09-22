import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  CompanyConfig,
  ServiceItem,
  PlanItem,
  PriceItem,
  GalleryItem,
  FAQItem,
  TestimonialItem,
  CategoryItem,
  SubcategoryItem,
  CotizacionItem,
} from '../types';
import {
  defaultCompanyConfig,
  defaultServices,
  defaultPlans,
  defaultPrices,
  defaultGallery,
  defaultFAQs,
  defaultTestimonials,
  defaultCategories,
} from '../data/defaultData';

/**
 * Fetch list of business categories with subcategories
 */
export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const catRef = collection(db, 'categorias');
    const q = query(catRef, where('activo', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: CategoryItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as CategoryItem);
      });
      return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
  } catch (err) {
    console.warn('Cargando categorías por defecto:', err);
  }

  // Check localStorage for offline / quick preview edits
  try {
    const local = localStorage.getItem('aseovia_categorias');
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    // Ignore
  }

  return defaultCategories;
}

/**
 * Save / Update a category with its subcategories
 */
export async function saveCategory(category: CategoryItem): Promise<string> {
  try {
    const id = category.id || `cat-${Date.now()}`;
    const docRef = doc(db, 'categorias', id);
    await setDoc(docRef, { ...category, id }, { merge: true });
    
    // Also save in localStorage
    try {
      const current = await getCategories();
      const idx = current.findIndex((c) => c.id === id);
      if (idx >= 0) {
        current[idx] = { ...category, id };
      } else {
        current.push({ ...category, id });
      }
      localStorage.setItem('aseovia_categorias', JSON.stringify(current));
    } catch (_) {}

    return id;
  } catch (err) {
    console.warn('Guardando categoría en almacenamiento local:', err);
    const id = category.id || `cat-${Date.now()}`;
    try {
      const current = JSON.parse(localStorage.getItem('aseovia_categorias') || JSON.stringify(defaultCategories));
      const idx = current.findIndex((c: CategoryItem) => c.id === id);
      if (idx >= 0) {
        current[idx] = { ...category, id };
      } else {
        current.push({ ...category, id });
      }
      localStorage.setItem('aseovia_categorias', JSON.stringify(current));
    } catch (_) {}
    return id;
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'categorias', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Eliminando categoría en local:', err);
  }
  try {
    const current = JSON.parse(localStorage.getItem('aseovia_categorias') || JSON.stringify(defaultCategories));
    const filtered = current.filter((c: CategoryItem) => c.id !== id);
    localStorage.setItem('aseovia_categorias', JSON.stringify(filtered));
  } catch (_) {}
}

/**
 * Fetch company general configuration
 */
export async function getCompanyConfig(): Promise<CompanyConfig> {
  try {
    const configDocRef = doc(db, 'configuracion', 'general');
    const configSnap = await getDoc(configDocRef);
    if (configSnap.exists()) {
      return { ...defaultCompanyConfig, ...(configSnap.data() as Partial<CompanyConfig>) };
    }
  } catch (err) {
    console.warn('Usando configuración por defecto:', err);
  }
  return defaultCompanyConfig;
}

/**
 * Fetch list of services
 */
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const servicesRef = collection(db, 'servicios');
    const q = query(servicesRef, where('activo', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: ServiceItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as ServiceItem);
      });
      return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
  } catch (err) {
    console.warn('Cargando servicios por defecto:', err);
  }
  return defaultServices;
}

/**
 * Fetch list of cleaning plans
 */
export async function getPlans(): Promise<PlanItem[]> {
  try {
    const plansRef = collection(db, 'planes');
    const q = query(plansRef, where('activo', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: PlanItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as PlanItem);
      });
      return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
  } catch (err) {
    console.warn('Cargando planes por defecto:', err);
  }
  return defaultPlans;
}

/**
 * Fetch list of prices
 */
export async function getPrices(): Promise<PriceItem[]> {
  try {
    const pricesRef = collection(db, 'precios');
    const q = query(pricesRef, where('activo', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: PriceItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as PriceItem);
      });
      return items;
    }
  } catch (err) {
    console.warn('Cargando precios referenciales por defecto:', err);
  }
  return defaultPrices;
}

/**
 * Fetch gallery items
 */
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const galleryRef = collection(db, 'galeria');
    const q = query(galleryRef, where('activo', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: GalleryItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as GalleryItem);
      });
      return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
  } catch (err) {
    console.warn('Cargando galería por defecto:', err);
  }
  return defaultGallery;
}

/**
 * Fetch FAQs
 */
export async function getFAQs(): Promise<FAQItem[]> {
  try {
    const faqsRef = collection(db, 'preguntasFrecuentes');
    const q = query(faqsRef, where('activo', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: FAQItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as FAQItem);
      });
      return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
  } catch (err) {
    console.warn('Cargando preguntas frecuentes por defecto:', err);
  }
  return defaultFAQs;
}

/**
 * Fetch real testimonials (discreet / empty if none exist)
 */
export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const testimonialsRef = collection(db, 'testimonios');
    const q = query(testimonialsRef, where('activo', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: TestimonialItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as TestimonialItem);
      });
      return items;
    }
  } catch (err) {
    console.warn('Cargando testimonios:', err);
  }
  return defaultTestimonials;
}

/**
 * Enviar comentario / reseña de cliente post-servicio
 */
export async function submitTestimonial(
  testimonio: Omit<TestimonialItem, 'id'>
): Promise<string> {
  const testimonialsRef = collection(db, 'testimonios');
  const docRef = await addDoc(testimonialsRef, {
    ...testimonio,
    activo: true, // Visible directamente
    fecha: new Date().toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  });
  return docRef.id;
}

/**
 * Obtener todos los testimonios para el administrador (incluidos inactivos)
 */
export async function getAllTestimonialsAdmin(): Promise<TestimonialItem[]> {
  try {
    const testimonialsRef = collection(db, 'testimonios');
    const querySnapshot = await getDocs(testimonialsRef);
    if (!querySnapshot.empty) {
      const items: TestimonialItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as TestimonialItem);
      });
      return items;
    }
  } catch (err) {
    console.warn('Error al obtener testimonios para admin:', err);
  }
  return defaultTestimonials;
}

/**
 * Actualizar estado o datos de un testimonio
 */
export async function updateTestimonial(
  id: string,
  updates: Partial<TestimonialItem>
): Promise<void> {
  const docRef = doc(db, 'testimonios', id);
  await updateDoc(docRef, updates);
}

/**
 * Eliminar un testimonio
 */
export async function deleteTestimonial(id: string): Promise<void> {
  const docRef = doc(db, 'testimonios', id);
  await deleteDoc(docRef);
}

/**
 * Guardar o actualizar un Plan de limpieza
 */
export async function savePlanItem(plan: Partial<PlanItem>): Promise<string> {
  if (plan.id && !plan.id.startsWith('new_')) {
    const docRef = doc(db, 'planes', plan.id);
    const { id, ...data } = plan;
    await setDoc(docRef, data, { merge: true });
    return plan.id;
  } else {
    const colRef = collection(db, 'planes');
    const { id, ...data } = plan;
    const docRef = await addDoc(colRef, {
      ...data,
      activo: data.activo ?? true,
      orden: data.orden ?? Date.now(),
    });
    return docRef.id;
  }
}

/**
 * Eliminar un Plan
 */
export async function deletePlanItem(id: string): Promise<void> {
  const docRef = doc(db, 'planes', id);
  await deleteDoc(docRef);
}

/**
 * Guardar o actualizar una imagen de referencia / trabajo en Galería
 */
export async function saveGalleryItem(item: Partial<GalleryItem>): Promise<string> {
  if (item.id && !item.id.startsWith('new_')) {
    const docRef = doc(db, 'galeria', item.id);
    const { id, ...data } = item;
    await setDoc(docRef, data, { merge: true });
    return item.id;
  } else {
    const colRef = collection(db, 'galeria');
    const { id, ...data } = item;
    const docRef = await addDoc(colRef, {
      ...data,
      activo: data.activo ?? true,
      orden: data.orden ?? Date.now(),
    });
    return docRef.id;
  }
}

/**
 * Eliminar una imagen de Galería
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  const docRef = doc(db, 'galeria', id);
  await deleteDoc(docRef);
}

/**
 * Guardar o actualizar un Servicio
 */
export async function saveServiceItem(service: Partial<ServiceItem>): Promise<string> {
  if (service.id && !service.id.startsWith('new_')) {
    const docRef = doc(db, 'servicios', service.id);
    const { id, ...data } = service;
    await setDoc(docRef, data, { merge: true });
    return service.id;
  } else {
    const colRef = collection(db, 'servicios');
    const { id, ...data } = service;
    const docRef = await addDoc(colRef, {
      ...data,
      activo: data.activo ?? true,
      orden: data.orden ?? Date.now(),
    });
    return docRef.id;
  }
}

/**
 * Eliminar un Servicio
 */
export async function deleteServiceItem(id: string): Promise<void> {
  const docRef = doc(db, 'servicios', id);
  await deleteDoc(docRef);
}

/**
 * Actualizar configuración de la empresa
 */
export async function updateCompanyConfig(
  configUpdates: Partial<CompanyConfig>
): Promise<void> {
  const docRef = doc(db, 'configuracion', 'general');
  await setDoc(docRef, configUpdates, { merge: true });
}

// =========================================================================
// COTIZACIONES (SOLICITUDES DE CLIENTES & ALERTAS EN TIEMPO REAL)
// =========================================================================

/**
 * Obtener lista de cotizaciones recibidas
 */
export async function getCotizaciones(): Promise<CotizacionItem[]> {
  try {
    const colRef = collection(db, 'cotizaciones');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: CotizacionItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as CotizacionItem);
      });
      localStorage.setItem('aseovia_cotizaciones', JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Cargando cotizaciones desde respaldo local:', err);
  }

  // Respaldo en localStorage
  try {
    const local = localStorage.getItem('aseovia_cotizaciones');
    if (local) {
      return JSON.parse(local);
    }
  } catch (err) {
    console.warn('Error al leer cotizaciones de localStorage:', err);
  }

  return [];
}

/**
 * Guardar una nueva cotización enviada por un cliente
 */
export async function saveCotizacion(
  data: Omit<CotizacionItem, 'id'>
): Promise<string> {
  const newId = `cot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const item: CotizacionItem = {
    ...data,
    id: newId,
    timestamp: data.timestamp || Date.now(),
    estado: data.estado || 'pendiente',
    leido: false,
  };

  // 1. Guardar de inmediato en almacenamiento local para reflejo instantáneo entre pestañas
  try {
    const local = localStorage.getItem('aseovia_cotizaciones');
    const existing: CotizacionItem[] = local ? JSON.parse(local) : [];
    const updated = [item, ...existing.filter((c) => c.id !== newId)];
    localStorage.setItem('aseovia_cotizaciones', JSON.stringify(updated));
    // Notificar al contexto de la aplicación en la misma ventana
    window.dispatchEvent(
      new CustomEvent('aseovia_new_cotizacion', { detail: item })
    );
  } catch (err) {
    console.warn('Error al guardar cotización localmente:', err);
  }

  // 2. Persistir en Firestore
  try {
    const docRef = doc(db, 'cotizaciones', newId);
    await setDoc(docRef, item);
  } catch (err) {
    console.warn('Error al persistir cotización en Firestore (almacenada localmente):', err);
  }

  return newId;
}

/**
 * Actualizar estado de una cotización (pendiente, respondido, confirmado, archivado, leido)
 */
export async function updateCotizacion(
  id: string,
  updates: Partial<CotizacionItem>
): Promise<void> {
  // Actualizar en localStorage
  try {
    const local = localStorage.getItem('aseovia_cotizaciones');
    if (local) {
      const items: CotizacionItem[] = JSON.parse(local);
      const updated = items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      localStorage.setItem('aseovia_cotizaciones', JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent('aseovia_cotizaciones_changed', { detail: updated })
      );
    }
  } catch (err) {}

  // Actualizar en Firestore
  try {
    const docRef = doc(db, 'cotizaciones', id);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Error al actualizar cotización en Firestore:', err);
  }
}

/**
 * Eliminar una cotización
 */
export async function deleteCotizacion(id: string): Promise<void> {
  try {
    const local = localStorage.getItem('aseovia_cotizaciones');
    if (local) {
      const items: CotizacionItem[] = JSON.parse(local);
      const updated = items.filter((item) => item.id !== id);
      localStorage.setItem('aseovia_cotizaciones', JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent('aseovia_cotizaciones_changed', { detail: updated })
      );
    }
  } catch (err) {}

  try {
    const docRef = doc(db, 'cotizaciones', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error al eliminar cotización en Firestore:', err);
  }
}

/**
 * Suscribirse en tiempo real a nuevas cotizaciones para alertas instantáneas
 */
export function subscribeCotizaciones(
  callback: (items: CotizacionItem[]) => void
): () => void {
  // Enviar de inmediato los datos locales si existen
  try {
    const local = localStorage.getItem('aseovia_cotizaciones');
    if (local) {
      callback(JSON.parse(local));
    }
  } catch {}

  let unsubscribeFirestore = () => {};

  try {
    const colRef = collection(db, 'cotizaciones');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        const items: CotizacionItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as CotizacionItem);
        });
        localStorage.setItem('aseovia_cotizaciones', JSON.stringify(items));
        callback(items);
      },
      (error) => {
        console.warn('onSnapshot cotizaciones error/fallback:', error);
      }
    );
  } catch (err) {
    console.warn('No se pudo inicializar listener Firestore para cotizaciones:', err);
  }

  // Listener para eventos locales (mismo navegador / pestañas)
  const handleLocalChange = () => {
    try {
      const local = localStorage.getItem('aseovia_cotizaciones');
      if (local) {
        callback(JSON.parse(local));
      }
    } catch {}
  };

  window.addEventListener('storage', handleLocalChange);
  window.addEventListener('aseovia_cotizaciones_changed', handleLocalChange);
  window.addEventListener('aseovia_new_cotizacion', handleLocalChange);

  return () => {
    unsubscribeFirestore();
    window.removeEventListener('storage', handleLocalChange);
    window.removeEventListener('aseovia_cotizaciones_changed', handleLocalChange);
    window.removeEventListener('aseovia_new_cotizacion', handleLocalChange);
  };
}



export interface CompanyConfig {
  nombreEmpresa: string;
  eslogan: string;
  descripcion: string;
  whatsapp: string; // E.g. "+56912345678"
  whatsappDisplay: string; // E.g. "+56 9 1234 5678"
  telefono: string;
  telefonoDisplay: string;
  correo: string;
  instagram: string;
  instagramUrl: string;
  facebook: string;
  facebookUrl: string;
  zonasAtencion: string;
  horario: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

export interface ServiceItem {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  categoria: 'residencial' | 'comercial' | 'oficina' | 'especial';
  espacios: string; // e.g. "Casas, departamentos, cabañas, hostales"
  orden: number;
  activo: boolean;
  precioDesde?: string;
}

export interface PlanItem {
  id: string;
  nombre: 'BÁSICO' | 'ESTÁNDAR' | 'PROFUNDO' | string;
  descripcion: string;
  incluye: string[];
  noIncluye: string[];
  tamanos: string[]; // ["Pequeño", "Mediano", "Grande"]
  preciosPorTamano?: {
    pequeno: string;
    mediano: string;
    grande: string;
  };
  precioReferencial: string;
  destacado?: boolean;
  orden: number;
  activo: boolean;
}

export interface PriceItem {
  id: string;
  servicioId: string;
  planId: string;
  tamaño: 'Pequeño' | 'Mediano' | 'Grande' | string;
  precio: string;
  activo: boolean;
}

export interface GalleryItem {
  id: string;
  titulo: string;
  imagenUrl: string;
  imagenAntesUrl?: string; // For before/after comparisons
  tipo: 'antes_despues' | 'referencia' | 'detalle';
  descripcion: string;
  orden: number;
  activo: boolean;
}

export interface FAQItem {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  activo: boolean;
}

export interface TestimonialItem {
  id: string;
  nombre: string;
  comentario: string;
  calificacion: number;
  imagenUrl?: string;
  espacio?: string;
  comuna?: 'Alto Hospicio' | 'Iquique' | string;
  servicio?: string;
  fecha?: string;
  activo: boolean;
}

export interface UserProfile {
  uid: string;
  username: string;
  rol: 'admin' | 'cliente';
  creadoEn?: string;
}

export interface SpaceSolutionItem {
  id: string;
  titulo: string;
  descripcion: string;
  espacios: string;
  icono: string;
  imagenUrl: string;
}

export interface SizePrices {
  pequeno: string;
  mediano: string;
  grande: string;
}

export interface SubcategoryItem {
  id: string;
  nombre: string;
  categoriaId: string;
  precios: {
    basico: SizePrices;
    estandar: SizePrices;
    profundo: SizePrices;
  };
  descripcion?: string;
  activo: boolean;
}

export interface CategoryItem {
  id: string;
  nombre: string;
  descripcion: string;
  subcategorias: SubcategoryItem[];
  icono?: string;
  imagenUrl?: string;
  orden: number;
  activo: boolean;
}

export interface CotizacionItem {
  id: string;
  nombre: string;
  telefono: string;
  ubicacion: string; // 'Alto Hospicio' | 'Iquique' | string
  categoria?: string;
  tipoEspacio?: string;
  plan: string;
  tamano: string;
  precioReferencial: string;
  abonoReserva?: string;
  opcionAbono?: 'Sin abono' | '10.000 pesos' | 'La mitad' | 'Todo al tiro' | string;
  montoAbono?: string;
  saldoRestante?: string;
  detalles?: string;
  fecha: string;
  timestamp: number;
  estado: 'pendiente' | 'respondido' | 'confirmado' | 'archivado';
  leido: boolean;
}


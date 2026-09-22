import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [activeView, setActiveView] = useState<'despues' | 'antes'>('despues');

  const beforeAfterPair = {
    titulo: 'Comparativa de Referencia: Cocina Residencial y Mesones',
    descripcion: 'Demostración visual del nivel de desengrase profundo, brillo en griferías y remoción de manchas en azulejos tras un servicio de aseo integral.',
    imagenAntes: '/src/assets/images/service_commercial_office_1790114953122.jpg',
    imagenDespues: '/src/assets/images/service_deep_apartment_1790114961949.jpg',
  };

  return (
    <section id="galeria" className="py-10 sm:py-14 bg-[#fafaf9] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-9">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Galería de Referencia y Calidad
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Resultados Visibles en Cada Servicio
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Imágenes de referencia que reflejan el estándar de higiene, orden y luminosidad que entregamos en Alto Hospicio e Iquique.
          </p>
        </div>

        {/* Interactive Before & After Feature Card */}
        <div className="max-w-3xl mx-auto mb-10 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5 text-sky-700" />
                <span>Comparativa de Calidad</span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-950 mt-0.5">
                {beforeAfterPair.titulo}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                {beforeAfterPair.descripcion}
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="bg-slate-100 p-1 rounded-md flex items-center shrink-0 self-start sm:self-center border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveView('antes')}
                className={`px-3 py-1 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'antes'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ANTES
              </button>
              <button
                type="button"
                onClick={() => setActiveView('despues')}
                className={`px-3 py-1 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'despues'
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                DESPUÉS (ASEO VÍA)
              </button>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 bg-slate-900 overflow-hidden">
            <img
              src={activeView === 'despues' ? beforeAfterPair.imagenDespues : beforeAfterPair.imagenAntes}
              alt="Resultado de limpieza"
              className="w-full h-full object-cover transition-all duration-300"
            />
            
            <div className="absolute top-3 left-3">
              <span
                className={`px-2.5 py-0.5 rounded-sm text-xs font-bold shadow-md uppercase tracking-wider text-white ${
                  activeView === 'despues' ? 'bg-sky-700' : 'bg-slate-900/90'
                }`}
              >
                {activeView === 'despues' ? '✓ Estado Impecable (Entregado)' : '● Estado Previo'}
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:border-slate-300 hover:shadow-[0_8px_12px_-2px_rgb(0_0_0/0.08)] transition-all flex flex-col group"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={item.imagenUrl}
                  alt={item.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-950 leading-snug group-hover:text-sky-800 transition-colors">
                    {item.titulo}
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Referencia verificada
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

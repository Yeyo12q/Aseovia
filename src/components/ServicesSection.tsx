import React, { useState } from 'react';
import { ArrowRight, Building } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onOpenQuoteForService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onOpenQuoteForService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', name: 'Todos los servicios' },
    { id: 'residencial', name: 'Residencial' },
    { id: 'comercial', name: 'Comercial y Retail' },
    { id: 'oficina', name: 'Oficinas' },
    { id: 'especial', name: 'Especiales y Tapices' },
  ];

  const filteredServices = services.filter((svc) => {
    if (selectedCategory === 'todos') return true;
    return svc.categoria === selectedCategory;
  });

  return (
    <section id="servicios" className="py-10 sm:py-14 bg-[#fafaf9] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-7">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Catálogo de Servicios
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Servicios Profesionales de Limpieza y Mantención
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Alternativas específicas para viviendas, locales comerciales e instalaciones corporativas en Alto Hospicio e Iquique.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8 bg-white p-1 rounded-lg border border-slate-200 max-w-2xl mx-auto shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dynamic Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-sky-600 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:shadow-[0_8px_12px_-2px_rgb(0_0_0/0.08)] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Service Image */}
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  <img
                    src={service.imagenUrl}
                    alt={service.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {service.precioDesde && (
                    <div className="absolute top-2.5 right-2.5 bg-slate-900 text-white text-[10.5px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                      Desde {service.precioDesde}
                    </div>
                  )}
                </div>

                {/* Service Info */}
                <div className="p-4">
                  <h3 className="font-serif text-base font-bold text-slate-950 leading-snug group-hover:text-sky-800 transition-colors">
                    {service.nombre}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {service.descripcion}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-500">
                      {service.espacios}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => onOpenQuoteForService(service.nombre)}
                  className="w-full py-2 px-3 rounded-md text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-700 hover:text-white border border-sky-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Cotizar este servicio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Home, Store, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { spaceSolutions } from '../data/defaultData';

interface SpaceSolutionsProps {
  onSelectSolution: (solutionTitle: string) => void;
}

export const SpaceSolutions: React.FC<SpaceSolutionsProps> = ({ onSelectSolution }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return Home;
      case 'Store':
        return Store;
      case 'Briefcase':
        return Briefcase;
      case 'Sparkles':
      default:
        return Sparkles;
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Áreas de Atención Especializada
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Soluciones de Limpieza a la Medida de Cada Espacio
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Diseñamos planes acordes a las exigencias de tu propiedad o negocio, garantizando higiene profunda y ambientes renovados.
          </p>
        </div>

        {/* 4 Cards Grid with soft shadow and compact padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {spaceSolutions.map((item) => {
            const IconComponent = getIcon(item.icono);
            return (
              <div
                key={item.id}
                className="group bg-white rounded-lg overflow-hidden border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:shadow-[0_8px_12px_-2px_rgb(0_0_0/0.08)] hover:border-sky-600 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={item.imagenUrl}
                      alt={item.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-md bg-slate-900/90 text-white flex items-center justify-center shadow-xs">
                      <IconComponent className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-base text-slate-950 group-hover:text-sky-800 transition-colors">
                      {item.titulo}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {item.descripcion}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cobertura típica:
                      </span>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">
                        {item.espacios}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => onSelectSolution(item.titulo)}
                    className="w-full py-2 px-3 rounded-md text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-700 hover:text-white border border-sky-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Cotizar este espacio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

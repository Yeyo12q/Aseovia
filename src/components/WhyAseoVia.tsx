import React from 'react';
import {
  UserCheck,
  ClipboardCheck,
  Camera,
  Tag,
  MapPin,
} from 'lucide-react';
import { defaultWhyReasons } from '../data/defaultData';

export const WhyAseoVia: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return UserCheck;
      case 'ClipboardCheck':
        return ClipboardCheck;
      case 'Camera':
        return Camera;
      case 'Tag':
        return Tag;
      case 'MapPin':
      default:
        return MapPin;
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Valores y Compromiso Corporativo
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            ¿Por Qué Elegir a Aseo Vía?
          </h2>
          <p className="mt-2 font-serif italic text-base sm:text-lg text-slate-800">
            “Limpieza que se nota.”
          </p>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Trabajamos con formalidad, puntualidad y un estándar riguroso para que disfrutes de un ambiente impecable y ordenado sin complicaciones.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {defaultWhyReasons.map((item, idx) => {
            const Icon = getIcon(item.icono);
            const isLast = idx === 4;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-lg border border-slate-200 bg-white shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:border-sky-500 hover:shadow-[0_8px_12px_-2px_rgb(0_0_0/0.08)] transition-all flex flex-col justify-between ${
                  isLast ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-md bg-sky-700 text-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-950 leading-snug">
                    {item.titulo}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 text-[10.5px] text-sky-800 font-bold uppercase tracking-wider">
                  Compromiso Aseo Vía
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

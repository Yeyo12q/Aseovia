import React from 'react';
import {
  Brush,
  Layers,
  Armchair,
  Trash2,
  AppWindow,
  Droplet,
  Utensils,
  ShieldCheck,
} from 'lucide-react';
import { defaultIncludedTasks } from '../data/defaultData';

export const IncludesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brush':
        return Brush;
      case 'Layers':
        return Layers;
      case 'Armchair':
        return Armchair;
      case 'Trash2':
        return Trash2;
      case 'AppWindow':
        return AppWindow;
      case 'Droplet':
        return Droplet;
      case 'Utensils':
        return Utensils;
      case 'ShieldCheck':
      default:
        return ShieldCheck;
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-9">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Detalle de Labores y Alcance
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            ¿Qué Tareas Realizamos en Nuestros Servicios?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Realizamos labores manuales minuciosas con productos químicos profesionales e implementos propios para asegurar orden, desinfección y frescura sin ruidos molestos.
          </p>
        </div>

        {/* Task Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultIncludedTasks.map((item) => {
            const Icon = getIcon(item.icono);
            return (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-slate-200 bg-[#fdfdfc] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:border-sky-500 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-sky-700 text-white flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-950 leading-snug">
                    {item.nombre}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  ✓ Incluido en catálogo
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

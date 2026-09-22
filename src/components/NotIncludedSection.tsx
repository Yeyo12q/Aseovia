import React from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { defaultNotIncludedTasks } from '../data/defaultData';

interface NotIncludedSectionProps {
  onOpenQuote: () => void;
}

export const NotIncludedSection: React.FC<NotIncludedSectionProps> = ({ onOpenQuote }) => {
  return (
    <section className="py-10 sm:py-14 bg-[#fafaf9] border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-9">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Transparencia y Claridad Total
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Para que Todo Quede Claro: Lo que no Ofrecemos por el Momento
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            En Aseo Vía trabajamos con honestidad. Para no generar falsas expectativas, indicamos con total franqueza qué tareas no forman parte de nuestros servicios regulares.
          </p>
        </div>

        {/* Not Included Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaultNotIncludedTasks.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-sm mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <h3>{item.nombre}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.descripcion}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Excluido de planes estándar
              </div>
            </div>
          ))}
        </div>

        {/* Clarification Callout */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onOpenQuote}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-sky-800 hover:text-sky-950 font-bold transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-700" />
            <span>¿Tienes dudas sobre un requerimiento especial? Consúltanos directamente sin compromiso</span>
          </button>
        </div>

      </div>
    </section>
  );
};

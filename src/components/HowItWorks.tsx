import React from 'react';
import { ArrowRight } from 'lucide-react';
import { defaultHowItWorksSteps } from '../data/defaultData';

interface HowItWorksProps {
  onOpenQuote: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenQuote }) => {
  return (
    <section id="como-funciona" className="py-10 sm:py-14 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Proceso de Contratación Simple
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight">
            ¿Cómo Funciona el Servicio de Aseo Vía?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            En 4 pasos claros coordinamos y ejecutamos la limpieza de tu hogar o negocio en Alto Hospicio o Iquique.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {defaultHowItWorksSteps.map((step) => (
            <div
              key={step.numero}
              className="bg-slate-800/90 border border-slate-700/80 rounded-lg p-5 flex flex-col justify-between hover:border-sky-500 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] transition-colors"
            >
              <div>
                <div className="font-serif text-2xl font-bold text-sky-400 mb-3">
                  0{step.numero}.
                </div>

                <h3 className="font-serif text-base font-bold text-white leading-snug">
                  {step.titulo}
                </h3>

                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {step.descripcion}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-700/60 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Paso coordinado
              </div>
            </div>
          ))}
        </div>

        {/* Big CTA */}
        <div className="mt-9 text-center">
          <button
            type="button"
            onClick={onOpenQuote}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-md text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] cursor-pointer gap-2 uppercase tracking-wider"
          >
            <span>SOLICITAR COTIZACIÓN AHORA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

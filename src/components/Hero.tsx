import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { CompanyConfig } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './BrandIcons';

interface HeroProps {
  config: CompanyConfig;
  onOpenQuote: () => void;
  onScrollToServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onOpenQuote, onScrollToServices }) => {
  const heroImage = config.heroImageUrl || '/src/assets/images/hero_cleaning_service_1790114941321.jpg';

  return (
    <section id="inicio" className="bg-[#fafaf9] border-b border-slate-200/90 py-8 sm:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Commercial Sales Pitch */}
          <div className="lg:col-span-7 flex flex-col text-left">
            
            {/* Editorial Kicker */}
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-sky-800 uppercase mb-2">
              <MapPin className="w-3.5 h-3.5 text-sky-700" />
              <span>Alto Hospicio e Iquique · Región de Tarapacá</span>
            </div>

            {/* Elegant Serif Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-950 tracking-tight leading-[1.18]">
              Servicios Profesionales de Limpieza para Hogares y Empresas
            </h1>

            {/* Main Value Proposition */}
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Nos encargamos del aseo profundo, mantención y desinfección en casas, departamentos, oficinas y locales comerciales. Despreocúpate de la limpieza y disfruta de espacios relucientes.
            </p>

            {/* Concrete Business Guarantees */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-800 font-medium max-w-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personal verificado y capacitado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Boleta y Factura para empresas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Productos biodegradables y seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Puntualidad y supervisión en terreno</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href={getWhatsAppUrl(undefined, config.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-md text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all shadow-md shadow-emerald-700/20 gap-2 text-center"
              >
                <WhatsAppIcon variant="official" className="w-4 h-4 shrink-0" />
                <span>COTIZAR POR WHATSAPP</span>
              </a>

              <button
                type="button"
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-md text-xs sm:text-sm font-bold text-white bg-sky-700 hover:bg-sky-800 active:scale-[0.99] transition-all shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] gap-2 text-center cursor-pointer"
              >
                <span>FORMULARIO WEB</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onScrollToServices}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all text-center cursor-pointer shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]"
              >
                VER SERVICIOS
              </button>
            </div>

            <p className="mt-2.5 text-[11px] text-slate-500">
              Coordinación directa y presupuestos sin compromiso · Atención de Lunes a Sábado.
            </p>
          </div>

          {/* Right Column: Framed Photo */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
              <img
                src={heroImage}
                alt="Personal de Aseo Vía realizando limpieza profesional en vivienda y oficina"
                className="w-full h-72 sm:h-80 lg:h-[380px] object-cover"
                loading="eager"
              />
              
              {/* Grounded Corporate Trust Banner */}
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-sky-700 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">
                      Garantía de Calidad en Cada Visita
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Compromiso de entrega impecable en Alto Hospicio e Iquique
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

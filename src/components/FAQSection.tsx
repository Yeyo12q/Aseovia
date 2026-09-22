import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FAQItem, CompanyConfig } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface FAQSectionProps {
  faqs: FAQItem[];
  config: CompanyConfig;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, config }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-10 sm:py-14 bg-[#fafaf9] border-b border-slate-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-9">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Dudas y Consultas Frecuentes
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Aclaramos tus principales dudas antes de agendar tu servicio de limpieza con nosotros.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-slate-950 text-sm sm:text-base leading-snug">
                    {faq.pregunta}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-sm bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-sky-100 text-sky-700' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 p-4 sm:p-5 bg-white rounded-lg border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
          <div className="text-left">
            <h4 className="font-serif font-bold text-sm text-slate-950">
              ¿Tienes alguna pregunta específica sobre tu inmueble?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Escríbenos directamente a WhatsApp y te respondemos de inmediato.
            </p>
          </div>

          <a
            href={getWhatsAppUrl(undefined, config.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};

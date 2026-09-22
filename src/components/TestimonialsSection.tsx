import React from 'react';
import { Star, HeartHandshake, Plus } from 'lucide-react';
import { TestimonialItem } from '../types';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  onOpenReviewModal: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onOpenReviewModal,
}) => {
  const activeTestimonials = testimonials.filter((t) => t.activo !== false);
  const hasTestimonials = activeTestimonials.length > 0;

  return (
    <section id="testimonios" className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Confianza y Testimonios
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Opiniones de Clientes Satisfechos
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Vecinos y empresas de Alto Hospicio e Iquique que han confiado la limpieza de sus espacios a Aseo Vía.
          </p>
        </div>

        {hasTestimonials ? (
          /* Grid of verified reviews */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
            {activeTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(t.calificacion || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {t.comuna && (
                      <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        {t.comuna}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-serif italic leading-relaxed">
                    "{t.comentario}"
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{t.nombre}</span>
                    {t.espacio && (
                      <span className="text-[10.5px] text-slate-500 block">{t.espacio}</span>
                    )}
                  </div>
                  {t.fecha && (
                    <span className="text-[10px] text-slate-400">{t.fecha}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="max-w-xl mx-auto bg-white rounded-lg p-6 border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] text-center mb-8">
            <div className="w-10 h-10 rounded-md bg-sky-100 text-sky-700 mx-auto flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-slate-900">
              ¿Ya recibiste un servicio de Aseo Vía?
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              Tu opinión es muy importante para nosotros y para toda la comunidad de Alto Hospicio e Iquique.
            </p>
          </div>
        )}

        {/* Action Button to leave review */}
        <div className="text-center">
          <button
            type="button"
            onClick={onOpenReviewModal}
            className="inline-flex items-center justify-center px-5 py-2 rounded-md text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] transition-all cursor-pointer gap-1.5 uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5 text-sky-700" />
            <span>DEJAR MI OPINIÓN SOBRE EL SERVICIO</span>
          </button>
        </div>

      </div>
    </section>
  );
};

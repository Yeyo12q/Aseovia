import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CompanyConfig } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons';

interface ContactSectionProps {
  config: CompanyConfig;
  onOpenQuote: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config, onOpenQuote }) => {
  return (
    <section id="contacto" className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-9">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Canales de Atención y Cotización
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Estamos Listos para Atenderte
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Comunícate con Aseo Vía hoy mismo. Coordinamos visitas y presupuestos en Alto Hospicio e Iquique de forma rápida y personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-5xl mx-auto">
          
          {/* Main Direct WhatsApp Card */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-lg p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] border border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Atención Rápida Disponible</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Escríbenos Directamente a WhatsApp
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                El canal más expedito para consultar valores, coordinar fechas de visita y enviarnos fotos o detalles del lugar a limpiar.
              </p>

              <div className="mt-5 space-y-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Respuesta rápida y trato cordial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{config.horario}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{config.zonasAtencion}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href={getWhatsAppUrl(undefined, config.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40"
              >
                <WhatsAppIcon variant="official" className="w-5 h-5 shrink-0" />
                <span>ABRIR CHAT DE WHATSAPP</span>
              </a>

              <button
                type="button"
                onClick={onOpenQuote}
                className="py-2.5 px-4 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <span>FORMULARIO WEB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-5 bg-[#fafaf9] rounded-lg p-6 border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-950 mb-3.5">
                Información de Contacto
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Teléfono de Contacto
                    </span>
                    <a
                      href={`tel:${config.telefono}`}
                      className="font-bold text-slate-900 hover:text-sky-700 transition-colors"
                    >
                      {config.telefonoDisplay}
                    </a>
                  </div>
                </div>

                {config.correo && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Correo Electrónico
                      </span>
                      <a
                        href={`mailto:${config.correo}`}
                        className="font-medium text-slate-900 hover:text-sky-700 transition-colors"
                      >
                        {config.correo}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Horario de Atención
                    </span>
                    <span className="font-medium text-slate-900">
                      {config.horario}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Base Operativa
                    </span>
                    <span className="font-medium text-slate-900">
                      Alto Hospicio e Iquique, Chile
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {config.instagram && (
              <div className="mt-5 pt-3.5 border-t border-slate-200">
                <a
                  href={config.instagramUrl || `https://instagram.com/${config.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-pink-600 transition-colors"
                >
                  <InstagramIcon variant="official" className="w-4 h-4 shrink-0" />
                  <span>Síguenos en Instagram: {config.instagram}</span>
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

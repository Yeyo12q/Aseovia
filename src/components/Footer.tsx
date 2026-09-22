import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, User, Star, Clock } from 'lucide-react';
import { CompanyConfig, UserProfile } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { Logo } from './Logo';
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from './BrandIcons';

interface FooterProps {
  config: CompanyConfig;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenReview: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  user,
  onOpenAuth,
  onOpenAdmin,
  onOpenReview,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Real Brand Logo & Presentation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <Logo src={config.logoUrl} className="h-10 w-auto max-w-[190px] brightness-110" variant="light" />

            <p className="mt-3.5 text-xs text-slate-300 leading-relaxed max-w-sm">
              Servicios profesionales de limpieza para hogares, oficinas y locales comerciales en Alto Hospicio e Iquique. Compromiso, puntualidad y excelencia en cada visita.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={getWhatsAppUrl(undefined, config.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-[#25D366] hover:bg-[#25D366]/10 flex items-center justify-center transition-all group"
                aria-label="Contactar por WhatsApp"
                title="WhatsApp Oficial"
              >
                <WhatsAppIcon variant="official" className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              {config.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 flex items-center justify-center transition-all group"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <InstagramIcon variant="official" className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              )}
              {config.facebookUrl && (
                <a
                  href={config.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500 hover:bg-sky-500/10 flex items-center justify-center transition-all group"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FacebookIcon variant="official" className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
              </li>
              <li>
                <a href="#planes" className="hover:text-white transition-colors">Planes y Precios</a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition-colors">Cómo Funciona</a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">Galería de Trabajos</a>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-white transition-colors">Opiniones</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">
              Servicios
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Limpieza de Casas</li>
              <li>Departamentos</li>
              <li>Locales Comerciales</li>
              <li>Oficinas y Despachos</li>
              <li>Lavado de Tapices</li>
              <li>Limpieza Profunda</li>
            </ul>
          </div>

          {/* Col 4: Contact & Schedule (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">
              Atención y Contacto
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>Alto Hospicio e Iquique, Tarapacá</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a href={`tel:${config.telefono}`} className="hover:text-white transition-colors">
                  {config.telefonoDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{config.horario || 'Lun a Sáb: 08:30 - 19:30'}</span>
              </li>
              {config.correo && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <a href={`mailto:${config.correo}`} className="hover:text-white transition-colors">
                    {config.correo}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <p>© {currentYear} Aseo Vía. Todos los derechos reservados.</p>
            <span className="hidden sm:inline text-slate-800">·</span>
            <button
              type="button"
              onClick={onOpenReview}
              className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Star className="w-3 h-3 fill-amber-400/80" />
              <span>Dejar Opinión</span>
            </button>
            <span className="hidden sm:inline text-slate-800">·</span>
            {user ? (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <User className="w-3 h-3 text-sky-400" />
                <span>Mi Cuenta ({user.username})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[11px]">Iquique · Alto Hospicio</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, User, Star, Clock, MapPin, Bell } from 'lucide-react';
import { CompanyConfig, UserProfile } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { Logo } from './Logo';
import { WhatsAppIcon } from './BrandIcons';

interface NavbarProps {
  config: CompanyConfig;
  user: UserProfile | null;
  pendingQuotesCount?: number;
  onOpenQuote: (serviceName?: string, planName?: string) => void;
  onOpenAuth: () => void;
  onOpenAdmin: (initialTab?: 'cotizaciones') => void;
  onOpenReview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  user,
  pendingQuotesCount = 0,
  onOpenQuote,
  onOpenAuth,
  onOpenAdmin,
  onOpenReview,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Planes y Precios', href: '#planes' },
    { name: 'Cómo Funciona', href: '#como-funciona' },
    { name: 'Trabajos', href: '#galeria' },
    { name: 'Opiniones', href: '#testimonios' },
    { name: 'Preguntas', href: '#faq' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
      {/* Top Utility Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 text-[11.5px]">
            <div className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Alto Hospicio e Iquique</span>
            </div>
            <span className="hidden sm:inline text-slate-700">·</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{config.horario || 'Lun a Sáb: 08:30 - 19:30'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11.5px]">
            <a
              href={`tel:${config.telefono}`}
              className="hidden md:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>{config.telefonoDisplay}</span>
            </a>

            <a
              href={getWhatsAppUrl(undefined, config.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors group"
            >
              <WhatsAppIcon variant="official" className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>WhatsApp Directo</span>
            </a>

            <span className="text-slate-700">·</span>

            <button
              type="button"
              onClick={onOpenReview}
              className="hidden sm:inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <Star className="w-3 h-3 fill-amber-300" />
              <span>Dejar Opinión</span>
            </button>

            <span className="hidden sm:inline text-slate-700">·</span>

            {/* Iniciar Sesión / Mi Cuenta */}
            {user ? (
              <button
                type="button"
                onClick={() => onOpenAdmin(pendingQuotesCount > 0 ? 'cotizaciones' : undefined)}
                className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-md transition-all cursor-pointer ${
                  pendingQuotesCount > 0
                    ? 'bg-rose-950/70 border border-rose-500/50 text-rose-200 hover:text-white hover:bg-rose-900/80 shadow-xs'
                    : 'text-sky-300 hover:text-white'
                }`}
              >
                {pendingQuotesCount > 0 ? (
                  <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                ) : (
                  <User className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span>Mi Cuenta ({user.username})</span>
                {pendingQuotesCount > 0 && (
                  <span className="relative flex h-4 min-w-4 items-center justify-center px-1 text-[9.5px] font-black text-white bg-rose-600 rounded-full shadow-xs">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative z-10">{pendingQuotesCount}</span>
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-200 ${isScrolled ? 'py-2.5 bg-white/98 backdrop-blur-xs' : 'py-3 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Real Aseo Vía Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#inicio');
            }}
            className="focus:outline-none shrink-0"
          >
            <Logo src={config.logoUrl} className="h-10 w-auto max-w-[190px]" variant="dark" />
          </a>

          {/* WordPress Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="text-xs font-bold text-slate-700 hover:text-sky-800 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-sky-700 tracking-wide"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 active:scale-[0.99] transition-all shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] cursor-pointer tracking-wider uppercase"
            >
              Cotizar Servicio
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="px-3 py-1.5 rounded-md text-[11px] font-bold text-white bg-sky-700 active:bg-sky-800 cursor-pointer uppercase"
            >
              Cotizar
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-800 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-lg px-4 py-4 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-1 divide-y divide-slate-100 text-xs">
            <div className="py-2 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-2 px-2.5 rounded-md font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="py-2.5 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReview();
                }}
                className="text-left py-2 px-2.5 rounded-md font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-2"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Calificar Servicio / Dejar Opinión</span>
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin(pendingQuotesCount > 0 ? 'cotizaciones' : undefined);
                  }}
                  className={`text-left py-2 px-2.5 rounded-md font-bold flex items-center justify-between ${
                    pendingQuotesCount > 0
                      ? 'text-rose-900 bg-rose-50 border border-rose-200'
                      : 'text-sky-900 bg-sky-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {pendingQuotesCount > 0 ? (
                      <Bell className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-sky-700" />
                    )}
                    <span>Mi Cuenta ({user.username})</span>
                  </div>
                  {pendingQuotesCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                      {pendingQuotesCount} nuevas
                    </span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="text-left py-2 px-2.5 rounded-md font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-2.5 rounded-md text-center text-xs font-bold text-white bg-sky-700 shadow-xs"
              >
                SOLICITAR COTIZACIÓN
              </button>
              <a
                href={getWhatsAppUrl(undefined, config.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-md text-center text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
              >
                <WhatsAppIcon variant="official" className="w-4 h-4 shrink-0" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

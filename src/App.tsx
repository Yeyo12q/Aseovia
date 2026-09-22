/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Sparkles, MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { SpaceSolutions } from './components/SpaceSolutions';
import { ServicesSection } from './components/ServicesSection';
import { PlansSection } from './components/PlansSection';
import { IncludesSection } from './components/IncludesSection';
import { NotIncludedSection } from './components/NotIncludedSection';
import { WhyAseoVia } from './components/WhyAseoVia';
import { HowItWorks } from './components/HowItWorks';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { QuoteModal } from './components/QuoteModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ReviewModal } from './components/ReviewModal';

import {
  defaultCompanyConfig,
  defaultServices,
  defaultPlans,
  defaultGallery,
  defaultFAQs,
  defaultTestimonials,
  defaultCategories,
} from './data/defaultData';
import {
  getCompanyConfig,
  getCategories,
  getServices,
  getPlans,
  getGallery,
  getFAQs,
  getTestimonials,
  getCotizaciones,
  subscribeCotizaciones,
} from './services/firestoreService';
import { playNotificationChime } from './utils/audioAlert';
import { subscribeToAuth } from './services/authService';
import {
  CompanyConfig,
  ServiceItem,
  PlanItem,
  GalleryItem,
  FAQItem,
  TestimonialItem,
  UserProfile,
  CategoryItem,
  CotizacionItem,
} from './types';

export default function App() {
  // Application data state with immediate default fallback
  const [config, setConfig] = useState<CompanyConfig>(defaultCompanyConfig);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [plans, setPlans] = useState<PlanItem[]>(defaultPlans);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(defaultTestimonials);

  // Authentication & Admin state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<
    'cotizaciones' | 'categorias' | 'planes' | 'galeria' | 'opiniones' | 'configuracion'
  >('cotizaciones');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Cotizaciones state & live alerts
  const [cotizaciones, setCotizaciones] = useState<CotizacionItem[]>([]);
  const [incomingAlert, setIncomingAlert] = useState<CotizacionItem | null>(null);

  // Quote modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteService, setQuoteService] = useState<string>('');
  const [quotePlan, setQuotePlan] = useState<string>('ESTÁNDAR');
  const [quoteSize, setQuoteSize] = useState<string>('Mediano');
  const [quotePrice, setQuotePrice] = useState<string>('');

  // Fetch / Refresh data from Firestore & Local Storage
  const loadData = useCallback(async () => {
    try {
      const [
        remoteConfig,
        remoteCategories,
        remoteServices,
        remotePlans,
        remoteGallery,
        remoteFaqs,
        remoteTestimonials,
        remoteCotizaciones,
      ] = await Promise.allSettled([
        getCompanyConfig(),
        getCategories(),
        getServices(),
        getPlans(),
        getGallery(),
        getFAQs(),
        getTestimonials(),
        getCotizaciones(),
      ]);

      if (remoteConfig.status === 'fulfilled') setConfig(remoteConfig.value);
      if (remoteCategories.status === 'fulfilled' && remoteCategories.value.length > 0) {
        setCategories(remoteCategories.value);
      }
      if (remoteServices.status === 'fulfilled' && remoteServices.value.length > 0) {
        setServices(remoteServices.value);
      }
      if (remotePlans.status === 'fulfilled' && remotePlans.value.length > 0) {
        setPlans(remotePlans.value);
      }
      if (remoteGallery.status === 'fulfilled' && remoteGallery.value.length > 0) {
        setGallery(remoteGallery.value);
      }
      if (remoteFaqs.status === 'fulfilled' && remoteFaqs.value.length > 0) {
        setFaqs(remoteFaqs.value);
      }
      if (remoteTestimonials.status === 'fulfilled') {
        setTestimonials(remoteTestimonials.value);
      }
      if (remoteCotizaciones.status === 'fulfilled') {
        setCotizaciones(remoteCotizaciones.value);
      }
    } catch (err) {
      console.warn('Cargando con datos iniciales de contingencia:', err);
    }
  }, []);

  // Real-time listener for incoming quotations and alerts
  useEffect(() => {
    const unsubscribe = subscribeCotizaciones((list) => {
      setCotizaciones(list);
    });

    const handleNewQuote = (e: any) => {
      const item = e.detail as CotizacionItem;
      if (item) {
        playNotificationChime();
        setIncomingAlert(item);
        setTimeout(() => {
          setIncomingAlert((prev) => (prev?.id === item.id ? null : prev));
        }, 9000);
      }
    };

    window.addEventListener('aseovia_new_cotizacion', handleNewQuote);

    return () => {
      unsubscribe();
      window.removeEventListener('aseovia_new_cotizacion', handleNewQuote);
    };
  }, []);

  // Initial data loading & URL actions
  useEffect(() => {
    loadData();

    // Check for direct review link via WhatsApp or direct parameters
    if (window.location.search.includes('opinar')) {
      setReviewModalOpen(true);
    } else if (window.location.search.includes('admin')) {
      if (user) {
        setAdminModalOpen(true);
      } else {
        setAuthModalOpen(true);
      }
    }
  }, [loadData, user]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((profile) => {
      setUser(profile);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenQuote = (
    serviceName?: string,
    planName?: string,
    sizeName?: string,
    priceVal?: string
  ) => {
    if (serviceName) setQuoteService(serviceName);
    if (planName) setQuotePlan(planName);
    if (sizeName) setQuoteSize(sizeName);
    if (priceVal) setQuotePrice(priceVal);
    setQuoteModalOpen(true);
  };

  const handleScrollToServices = () => {
    const el = document.getElementById('servicios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pendingQuotesCount = cotizaciones.filter(
    (c) => c.estado === 'pendiente'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Navigation Bar */}
      <Navbar
        config={config}
        user={user}
        pendingQuotesCount={pendingQuotesCount}
        onOpenQuote={() => handleOpenQuote()}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={(tab) => {
          if (tab) setAdminTab(tab);
          setAdminModalOpen(true);
        }}
        onOpenReview={() => setReviewModalOpen(true)}
      />

      <main className="flex-1">
        {/* Main Hero Section */}
        <Hero
          config={config}
          onOpenQuote={() => handleOpenQuote()}
          onScrollToServices={handleScrollToServices}
        />

        {/* Commercial Trust Pillars */}
        <TrustBar />

        {/* Space Solutions with Real Manual Cleaning Focus */}
        <SpaceSolutions
          onSelectSolution={(solutionTitle) => handleOpenQuote(solutionTitle)}
        />

        {/* Services Catalog */}
        <ServicesSection
          services={services}
          onOpenQuoteForService={(serviceName) => handleOpenQuote(serviceName)}
        />

        {/* Dynamic Plans with Subcategory & Size Pricing (Pequeño, Mediano, Grande) */}
        <PlansSection
          plans={plans}
          categories={categories}
          onOpenQuoteForPlan={(planName, size, spaceTitle, priceVal) =>
            handleOpenQuote(spaceTitle, planName, size, priceVal)
          }
        />

        {/* ¿Qué incluye? (Labor Manual Detallada) */}
        <IncludesSection />

        {/* Lo que no incluimos (Sin Máquinas ni Aspiradoras) */}
        <NotIncludedSection
          onOpenQuote={() => handleOpenQuote()}
        />

        {/* ¿Por qué Aseo Vía? */}
        <WhyAseoVia />

        {/* Cómo funciona (Proceso en 4 pasos con Abono de $10.000) */}
        <HowItWorks
          onOpenQuote={() => handleOpenQuote()}
        />

        {/* Galería (Trabajos de Referencia Manuales) */}
        <GallerySection galleryItems={gallery} />

        {/* Testimonios & Calificación post-servicio de clientes */}
        <TestimonialsSection
          testimonials={testimonials}
          onOpenReviewModal={() => setReviewModalOpen(true)}
        />

        {/* Preguntas Frecuentes */}
        <FAQSection
          faqs={faqs}
          config={config}
        />

        {/* Contacto */}
        <ContactSection
          config={config}
          onOpenQuote={() => handleOpenQuote()}
        />
      </main>

      {/* Footer */}
      <Footer
        config={config}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenReview={() => setReviewModalOpen(true)}
      />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton whatsappNumber={config.whatsapp} />

      {/* Cotizador Modal / Formulario preparado */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        config={config}
        categories={categories}
        initialService={quoteService}
        initialPlan={quotePlan}
        initialSize={quoteSize}
        initialPrice={quotePrice}
      />

      {/* Autenticación Solo Usuario y Contraseña */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(profile) => {
          setUser(profile);
          setAdminModalOpen(true);
        }}
      />

      {/* Panel de Administrador Completo con Gestor de Categorías, Subcategorías, Planes y Cotizaciones */}
      {user && (
        <AdminDashboardModal
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          user={user}
          categories={categories}
          plans={plans}
          gallery={gallery}
          services={services}
          testimonials={testimonials}
          config={config}
          cotizaciones={cotizaciones}
          initialTab={adminTab}
          onRefreshData={loadData}
          onOpenReviewModal={() => setReviewModalOpen(true)}
        />
      )}

      {/* Alerta Visual Flotante para Notificación Inmediata al Equipo */}
      {incomingAlert && (
        <aside
          aria-label="Alerta de nueva cotización"
          className="fixed bottom-20 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-96 bg-slate-950 text-white rounded-2xl shadow-2xl border-2 border-rose-500 p-4 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-rose-600 rounded-xl animate-bounce shadow-md">
                <Bell className="w-5 h-5 text-white" />
              </span>
              <div>
                <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase block">
                  ⚡ ¡Nueva Cotización Recibida!
                </span>
                <h5 className="text-sm font-bold text-white font-serif">
                  {incomingAlert.nombre}
                </h5>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncomingAlert(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Cerrar alerta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-semibold">Comuna:</span>
              <span className="font-bold text-white">{incomingAlert.ubicacion}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-semibold">Plan:</span>
              <span className="font-bold text-sky-400">{incomingAlert.plan}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-semibold">Espacio:</span>
              <span className="font-medium text-slate-200 truncate max-w-[180px]">
                {incomingAlert.tipoEspacio}
              </span>
            </div>
            <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
              <span className="text-slate-400 font-semibold">Valor Estimado:</span>
              <span className="font-black text-emerald-400">
                {incomingAlert.precioReferencial}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setIncomingAlert(null);
                if (user) {
                  setAdminTab('cotizaciones');
                  setAdminModalOpen(true);
                } else {
                  setAuthModalOpen(true);
                }
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Ver en Panel de Cotizaciones ({pendingQuotesCount})</span>
            </button>
          </div>
        </aside>
      )}

      {/* Modal para que los Clientes dejen su Reseña Post-Servicio */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewSubmitted={loadData}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Building, ShieldCheck, Check, Info, CreditCard } from 'lucide-react';
import { CompanyConfig, CategoryItem } from '../types';
import { getWhatsAppUrl, generateQuoteWhatsAppMessage } from '../utils/whatsapp';
import { defaultCategories } from '../data/defaultData';
import { saveCotizacion } from '../services/firestoreService';
import { WhatsAppIcon } from './BrandIcons';

export type OpcionAbono = 'Sin abono' | '10.000 pesos' | 'La mitad' | 'Todo al tiro';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CompanyConfig;
  categories?: CategoryItem[];
  initialService?: string;
  initialPlan?: string;
  initialSize?: string;
  initialPrice?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  config,
  categories = defaultCategories,
  initialService = '',
  initialPlan = 'ESTÁNDAR',
  initialSize = 'Mediano',
  initialPrice = '',
}) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState('Alto Hospicio');
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'hogar');
  const [subcategoria, setSubcategoria] = useState('Casa');
  const [plan, setPlan] = useState(initialPlan || 'ESTÁNDAR');
  const [tamano, setTamano] = useState(initialSize || 'Mediano');
  const [opcionAbono, setOpcionAbono] = useState<OpcionAbono>('10.000 pesos');
  const [detalles, setDetalles] = useState('');

  const currentCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  // Update when initial values change
  useEffect(() => {
    if (initialPlan) setPlan(initialPlan);
    if (initialSize) setTamano(initialSize);
    if (initialService) {
      // If service contains a dash, try to match
      const parts = initialService.split('-');
      if (parts.length > 1) {
        setSubcategoria(parts[1].trim());
      }
    }
  }, [initialService, initialPlan, initialSize]);

  if (!isOpen) return null;

  // Calculate dynamic price
  const calculatePrice = (): string => {
    if (initialPrice && plan === initialPlan) return initialPrice;
    
    const subcatObj = currentCategory?.subcategorias?.find(
      (s) => s.nombre.toLowerCase() === subcategoria.toLowerCase()
    );

    const sizeKey = tamano.toLowerCase().includes('peque')
      ? 'pequeno'
      : tamano.toLowerCase().includes('gran')
      ? 'grande'
      : 'mediano';

    const pName = plan.toLowerCase();

    if (subcatObj?.precios) {
      if (pName.includes('básico') || pName.includes('basico')) {
        return subcatObj.precios.basico?.[sizeKey] || '$34.990';
      }
      if (pName.includes('estándar') || pName.includes('estandar')) {
        return subcatObj.precios.estandar?.[sizeKey] || '$44.990';
      }
      if (pName.includes('profundo')) {
        return subcatObj.precios.profundo?.[sizeKey] || '$54.990';
      }
    }
    return '$44.990';
  };

  const calculatedPrice = calculatePrice();
  const numericPrice = parseInt(calculatedPrice.replace(/[^0-9]/g, ''), 10) || 44990;

  // Las 4 opciones requeridas de abono
  const abonoOptionsConfig: Array<{
    id: OpcionAbono;
    titulo: string;
    descripcionCorta: string;
    montoTexto: string;
    saldoTexto: string;
    porcentaje: string;
  }> = [
    {
      id: 'Sin abono',
      titulo: 'Sin abono',
      descripcionCorta: 'Pagas el 100% al terminar el servicio',
      montoTexto: '$0',
      saldoTexto: calculatedPrice,
      porcentaje: '$0 ahora',
    },
    {
      id: '10.000 pesos',
      titulo: '10.000 pesos',
      descripcionCorta: 'Abono habitual de reserva para congelar fecha',
      montoTexto: '$10.000',
      saldoTexto: `$${Math.max(0, numericPrice - 10000).toLocaleString('es-CL')}`,
      porcentaje: '$10.000 ahora',
    },
    {
      id: 'La mitad',
      titulo: 'La mitad (50%)',
      descripcionCorta: '50% anticipado y 50% al terminar',
      montoTexto: `$${Math.round(numericPrice / 2).toLocaleString('es-CL')}`,
      saldoTexto: `$${(numericPrice - Math.round(numericPrice / 2)).toLocaleString('es-CL')}`,
      porcentaje: '50% ahora',
    },
    {
      id: 'Todo al tiro',
      titulo: 'Todo al tiro (100%)',
      descripcionCorta: 'Pagas el valor total de una vez y queda saldado',
      montoTexto: calculatedPrice,
      saldoTexto: '$0',
      porcentaje: '100% pagado',
    },
  ];

  const currentAbono =
    abonoOptionsConfig.find((o) => o.id === opcionAbono) || abonoOptionsConfig[1];

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSpace = `${currentCategory?.nombre || 'Inmueble'} - ${subcategoria}`;

    // Registrar cotización para el administrador y alertas visuales
    saveCotizacion({
      nombre: nombre.trim() || 'Cliente interesado',
      telefono: telefono.trim() || 'No indicado',
      ubicacion,
      categoria: currentCategory?.nombre || 'General',
      tipoEspacio: finalSpace,
      plan,
      tamano,
      precioReferencial: calculatedPrice,
      abonoReserva: currentAbono.montoTexto,
      opcionAbono,
      montoAbono: currentAbono.montoTexto,
      saldoRestante: currentAbono.saldoTexto,
      detalles: detalles.trim() || 'Sin especificaciones adicionales',
      fecha: new Date().toLocaleString('es-CL', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      timestamp: Date.now(),
      estado: 'pendiente',
      leido: false,
    }).catch((err) => {
      console.warn('Error al almacenar cotización:', err);
    });

    const formattedMessage = generateQuoteWhatsAppMessage({
      nombre: nombre.trim() || undefined,
      telefono: telefono.trim() || undefined,
      ubicacion,
      tipoEspacio: finalSpace,
      categoria: currentCategory?.nombre,
      plan,
      tamano,
      precioReferencial: calculatedPrice,
      opcionAbono,
      montoAbono: currentAbono.montoTexto,
      saldoRestante: currentAbono.saldoTexto,
      detalles: detalles.trim() || undefined,
    });

    const url = getWhatsAppUrl(formattedMessage, config.whatsapp);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white leading-tight">
                Cotizar Servicio de Limpieza Manual
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Aseo Vía · Alto Hospicio e Iquique
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSendViaWhatsApp} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 bg-[#fafaf9]">
          
          {/* Transparency Callout */}
          <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-xs text-sky-950 flex items-start gap-2 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
            <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div className="text-[11.5px] leading-relaxed">
              <span className="font-bold">Limpieza manual prolija (sin máquinas).</span> Llevamos todos los productos de limpieza e implementos. Se reserva con un abono de <span className="font-bold">$10.000</span> y el saldo se paga al finalizar el trabajo.
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tu Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Carolina Rojas"
                className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Comuna */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Comuna / Sector en Tarapacá *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Alto Hospicio', 'Iquique'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setUbicacion(loc)}
                  className={`py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                    ubicacion === loc
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Categoría *
              </label>
              <select
                value={selectedCatId}
                onChange={(e) => {
                  setSelectedCatId(e.target.value);
                  const cat = categories.find((c) => c.id === e.target.value);
                  if (cat && cat.subcategorias && cat.subcategorias.length > 0) {
                    setSubcategoria(cat.subcategorias[0].nombre);
                  }
                }}
                className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tipo de Inmueble *
              </label>
              <select
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
              >
                {(currentCategory?.subcategorias || []).map((s) => (
                  <option key={s.id} value={s.nombre}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Plan & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nivel de Plan *
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="BÁSICO">Plan BÁSICO (Mantener limpio)</option>
                <option value="ESTÁNDAR">Plan ESTÁNDAR (Limpiar y detallar)</option>
                <option value="PROFUNDO">Plan PROFUNDO (Limpiar profundamente)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tamaño del Espacio *
              </label>
              <select
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="Pequeño">Pequeño (Hasta 50 m²)</option>
                <option value="Mediano">Mediano (51 a 100 m²)</option>
                <option value="Grande">Grande (101 a 250 m²)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Price Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Valor Referencial Estimado:
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-slate-950">
                    {calculatedPrice}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">/ visita</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Abono Seleccionado:
                </span>
                <span className="text-sm font-black text-sky-900 bg-sky-100/90 px-2.5 py-0.5 rounded-md inline-block border border-sky-200">
                  {currentAbono.montoTexto}
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="text-[11px]">
                Saldo restante al terminar: <strong className="text-slate-900">{currentAbono.saldoTexto}</strong>
              </span>
              <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {currentAbono.porcentaje}
              </span>
            </div>
          </div>

          {/* Sección Requerida: ¿Cuánto quieres abonar? (4 opciones) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-sky-700" />
                <span>¿Cuánto quieres abonar? *</span>
              </label>
              <span className="text-[10.5px] font-medium text-slate-500">
                Elige tu preferencia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {abonoOptionsConfig.map((opt) => {
                const isSelected = opcionAbono === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOpcionAbono(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-600/30 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-sky-700 bg-sky-700 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-bold ${isSelected ? 'text-sky-950' : 'text-slate-900'}`}>
                          {opt.titulo}
                        </span>
                      </div>

                      <span
                        className={`text-[10.5px] font-black px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.montoTexto}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[10.5px] text-slate-500 leading-snug pl-6">
                      {opt.descripcionCorta}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Details */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Comentarios o requerimientos específicos (opcional)
            </label>
            <textarea
              rows={2}
              value={detalles}
              onChange={(e) => setDetalles(e.target.value)}
              placeholder="Ej: Fecha preferida, cantidad de habitaciones o si hay mascotas..."
              className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white focus:ring-1 focus:ring-sky-700 focus:outline-none"
            />
          </div>

          {/* Action Button con Ícono Oficial de WhatsApp */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/20 cursor-pointer tracking-wider uppercase"
            >
              <WhatsAppIcon variant="official" className="w-5 h-5 shrink-0" />
              <span>Enviar Cotización a WhatsApp</span>
            </button>
            <p className="text-[10.5px] text-slate-400 text-center mt-1.5">
              Sin compromiso · Coordinamos contigo fecha, horario y detalles de abono
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Check, X, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { PlanItem, CategoryItem, SubcategoryItem } from '../types';
import { defaultCategories } from '../data/defaultData';

interface PlansSectionProps {
  plans: PlanItem[];
  categories?: CategoryItem[];
  onOpenQuoteForPlan: (planName: string, selectedSize: string, spaceTitle?: string, priceVal?: string) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({
  plans,
  categories = defaultCategories,
  onOpenQuoteForPlan,
}) => {
  const activeCategories = categories.filter((c) => c.activo !== false);

  const [selectedCatId, setSelectedCatId] = useState<string>(
    activeCategories[0]?.id || 'hogar'
  );

  const currentCategory =
    activeCategories.find((c) => c.id === selectedCatId) || activeCategories[0];

  const subcategories: SubcategoryItem[] = currentCategory?.subcategorias?.filter((s) => s.activo !== false) || [];

  const [selectedSubcatId, setSelectedSubcatId] = useState<string>(
    subcategories[0]?.id || 'casa'
  );

  const currentSubcat =
    subcategories.find((s) => s.id === selectedSubcatId) || subcategories[0];

  const [selectedSize, setSelectedSize] = useState<'pequeno' | 'mediano' | 'grande'>('mediano');

  const sizeOptions = [
    { id: 'pequeno', label: 'Pequeño', range: 'Hasta 50 m²' },
    { id: 'mediano', label: 'Mediano', range: '51–100 m²' },
    { id: 'grande', label: 'Grande', range: '101–250 m²' },
  ];

  // Calculate dynamic price based on selected subcategory, size and plan
  const getPrice = (planName: string): string => {
    const pName = planName.toLowerCase();
    const sizeKey = selectedSize;

    if (currentSubcat?.precios) {
      if (pName.includes('básico') || pName.includes('basico')) {
        return currentSubcat.precios.basico?.[sizeKey] || '$34.990';
      }
      if (pName.includes('estándar') || pName.includes('estandar')) {
        return currentSubcat.precios.estandar?.[sizeKey] || '$44.990';
      }
      if (pName.includes('profundo')) {
        return currentSubcat.precios.profundo?.[sizeKey] || '$54.990';
      }
    }

    // Fallback to plan's own prices
    const foundPlan = plans.find((p) => p.nombre.toLowerCase() === pName);
    if (foundPlan?.preciosPorTamano) {
      return foundPlan.preciosPorTamano[sizeKey] || foundPlan.precioReferencial;
    }
    return '$44.990';
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = activeCategories.find((c) => c.id === catId);
    if (cat && cat.subcategorias && cat.subcategorias.length > 0) {
      setSelectedSubcatId(cat.subcategorias[0].id);
    }
  };

  return (
    <section id="planes" className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Tarifas Claras y Transparentes
          </p>
          <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-950 tracking-tight">
            Nuestros 3 Planes de Limpieza Manual
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Trabajamos con implementos manuales y productos especializados. Selecciona tu tipo de inmueble y metraje para ver los precios exactos de referencia.
          </p>
        </div>

        {/* Step 1: Category Selector (Hogar, Oficinas, Locales, etc.) */}
        <div className="mb-4 max-w-4xl mx-auto">
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              1. Selecciona la Categoría:
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-[#fafaf9] p-1.5 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  selectedCatId === cat.id
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Subcategory Pills (Casa, Depto, etc.) */}
        {subcategories.length > 0 && (
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="text-center mb-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                2. Tipo de Inmueble en {currentCategory?.nombre}:
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubcatId(sub.id)}
                  className={`px-3 py-1 rounded-sm text-xs font-semibold border transition-all cursor-pointer ${
                    selectedSubcatId === sub.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {sub.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Size Switcher (Pequeño, Mediano, Grande) */}
        <div className="max-w-md mx-auto mb-9">
          <div className="text-center mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              3. Metraje de tu espacio:
            </span>
          </div>
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 grid grid-cols-3 gap-1 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
            {sizeOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSize(s.id as 'pequeno' | 'mediano' | 'grande')}
                className={`py-1.5 px-2 rounded-md text-center transition-all cursor-pointer ${
                  selectedSize === s.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="text-xs">{s.label}</div>
                <div
                  className={`text-[9.5px] ${
                    selectedSize === s.id ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {s.range}
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-[10.5px] text-slate-500 mt-1.5">
            Sobre 250 m² se realiza evaluación con fotos previas y cotización especial.
          </p>
        </div>

        {/* Notice of Manual Craftsmanship & Reservation Policy */}
        <div className="max-w-4xl mx-auto mb-8 p-3.5 bg-sky-50/70 border border-sky-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-950 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0" />
            <div>
              <span className="font-bold block">Limpieza 100% manual y detallada</span>
              <span className="text-slate-600 text-[11px]">
                Sin ruidos molestos ni maquinarias pesadas. Incluye todos los productos de limpieza y paños de microfibra.
              </span>
            </div>
          </div>
          <div className="shrink-0 bg-white px-3 py-1 rounded-md border border-sky-200 text-[11px] font-bold text-sky-900">
            Abono de reserva: $10.000
          </div>
        </div>

        {/* 3 Plans Grid (BÁSICO, ESTÁNDAR, PROFUNDO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isFeatured = plan.destacado || plan.nombre.toUpperCase().includes('ESTÁNDAR');
            const price = getPrice(plan.nombre);

            return (
              <div
                key={plan.id}
                className={`relative rounded-lg transition-all flex flex-col justify-between shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] ${
                  isFeatured
                    ? 'bg-white border-2 border-sky-700 lg:-translate-y-1'
                    : 'bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                {isFeatured && (
                  <div className="bg-sky-700 text-white text-[11px] font-bold text-center py-1 px-3 rounded-t-[6px] tracking-wider uppercase">
                    Opción Más Solicitada · Detalle Equilibrado
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-bold text-slate-950">
                      PLAN {plan.nombre}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 uppercase tracking-wider">
                      {currentSubcat?.nombre || 'Espacio'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {plan.descripcion}
                  </p>

                  {/* Price Tag */}
                  <div className="mt-4 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl font-bold text-slate-950 tracking-tight">
                        {price}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ visita</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      Tarifa para {currentSubcat?.nombre || 'espacio'} ({selectedSize}). Abono flexible: Sin abono, $10.000, la mitad o 100%.
                    </p>
                  </div>

                  {/* Tasks Checklist */}
                  <div className="mt-4 space-y-2.5">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                      <span>Lo que incluye este plan:</span>
                    </p>
                    <ul className="space-y-1.5">
                      {plan.incluye.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.noIncluye && plan.noIncluye.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          No incluye:
                        </p>
                        <ul className="space-y-1">
                          {plan.noIncluye.map((noInc, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                              <X className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                              <span>{noInc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenQuoteForPlan(
                        plan.nombre,
                        selectedSize,
                        `${currentCategory.nombre} - ${currentSubcat?.nombre || ''}`,
                        price
                      )
                    }
                    className={`w-full py-2.5 px-3 rounded-md font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
                      isFeatured
                        ? 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Cotizar {plan.nombre} ({price})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

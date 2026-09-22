import React from 'react';
import { MapPin, ShieldCheck, Receipt, Sparkles } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      title: 'Cobertura en la Región',
      description: 'Equipos con base activa en Alto Hospicio e Iquique.',
      icon: MapPin,
    },
    {
      title: 'Personal de Confianza',
      description: 'Equipo capacitado, antecedentes revisados y uniforme institucional.',
      icon: ShieldCheck,
    },
    {
      title: 'Facturación y Boleta',
      description: 'Emitimos comprobantes tributarios para hogares y empresas.',
      icon: Receipt,
    },
    {
      title: 'Insumos Profesionales',
      description: 'Productos desinfectantes certificados y maquinaria especializada.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200/80 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-[#fdfdfc] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:border-slate-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-sky-700 text-white flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './BrandIcons';

interface WhatsAppFloatingButtonProps {
  whatsappNumber: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ whatsappNumber }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const url = getWhatsAppUrl(
    'Hola, Aseo Vía. Me gustaría solicitar información sobre sus servicios de limpieza.',
    whatsappNumber
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Tooltip callout on desktop and mobile */}
      {showTooltip && (
        <div className="bg-white text-slate-900 text-xs font-bold py-1.5 px-3 rounded-full shadow-xl border border-slate-200 flex items-center gap-2 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping"></span>
          <span>¿Hablamos por WhatsApp?</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-700 ml-1 p-0.5 rounded cursor-pointer transition-colors"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button con Ícono Oficial de WhatsApp */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar a Aseo Vía por WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-108 active:scale-95 transition-all group cursor-pointer"
      >
        <WhatsAppIcon variant="official" className="w-14 h-14" />
      </a>
    </div>
  );
};


import React, { useState } from 'react';

interface LogoProps {
  src?: string;
  className?: string;
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  src,
  className = 'h-10 w-auto',
  variant = 'dark',
  showSubtitle = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // If a valid image source is provided and hasn't errored, render the image
  if (src && !imageError) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={src}
          alt="Aseo Vía - Servicios de Limpieza"
          className={`${className} object-contain rounded-md`}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Pure SVG crafted vector logo for Aseo Vía
  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Real Aseo Vía Brand Emblem */}
      <svg
        viewBox="0 0 120 120"
        className="h-10 w-10 shrink-0 drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo Aseo Vía"
      >
        <rect width="120" height="120" rx="24" fill={isLight ? '#0f172a' : '#0369a1'} />
        {/* Dynamic Vía swoosh / crest */}
        <path
          d="M24 86C45 86 64 68 82 40C92 25 96 22 96 22C96 22 84 38 68 56C50 76 34 82 24 86Z"
          fill="#38bdf8"
        />
        {/* Water droplet shine */}
        <path
          d="M60 26C60 26 78 48 78 62C78 72 70 80 60 80C50 80 42 72 42 62C42 48 60 26 60 26Z"
          fill="white"
          fillOpacity="0.95"
        />
        <circle cx="55" cy="52" r="4" fill="#0284c7" />
        <path
          d="M74 38L78 30L82 38L90 42L82 46L78 54L74 46L66 42L74 38Z"
          fill="#34d399"
        />
      </svg>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-serif text-xl font-bold tracking-tight leading-none ${
              isLight ? 'text-white' : 'text-slate-950'
            }`}
          >
            ASEO VÍA
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${
              isLight ? 'text-sky-300' : 'text-slate-500'
            }`}
          >
            Limpieza que se nota
          </span>
        )}
      </div>
    </div>
  );
};

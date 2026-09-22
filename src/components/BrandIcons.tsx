import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Ícono Oficial de WhatsApp
 * Incluye el trazado exacto de la burbuja y el auricular telefónico oficial.
 */
export const WhatsAppIcon: React.FC<IconProps & { variant?: 'official' | 'mono' | 'white' }> = ({
  className = 'w-5 h-5',
  size,
  variant = 'mono',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  if (variant === 'official') {
    return (
      <svg
        viewBox="0 0 32 32"
        style={style}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="16" fill="#25D366" />
        <path
          d="M16.01 5.333C10.12 5.333 5.333 10.12 5.333 16.01c0 2.08.597 4.024 1.636 5.674L5.333 26.667l5.129-1.603a10.61 10.61 0 0 0 5.548 1.583c5.89 0 10.677-4.787 10.677-10.677 0-5.89-4.787-10.677-10.677-10.677Zm6.223 15.093c-.258.723-1.523 1.421-2.09 1.472-.567.051-1.1-.157-3.716-1.187-3.149-1.24-5.137-4.48-5.292-4.686-.155-.207-1.266-1.683-1.266-3.21 0-1.527.8-2.278 1.084-2.588.284-.31.62-.388.826-.388.207 0 .414 0 .595.01.19.01.44-.072.687.522.258.62 1.084 2.106 1.187 2.261.103.155.155.336.052.543-.104.207-.155.336-.31.517-.155.18-.328.403-.465.542-.155.155-.317.324-.136.634.18.31.802 1.32 1.722 2.14 1.182 1.053 2.176 1.378 2.486 1.533.31.155.491.13.672-.077.18-.207.775-.904.982-1.214.207-.31.414-.258.698-.155.284.103 1.808.852 2.118 1.007.31.155.517.232.594.361.077.13.077.749-.18 1.472Z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  // Mono vector icon with official WhatsApp silhouette
  return (
    <svg
      viewBox="0 0 24 24"
      style={style}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2ZM17.89 16.54C17.65 17.22 16.49 17.88 15.96 17.93C15.43 17.98 14.93 17.78 12.48 16.82C9.53 15.66 7.67 12.63 7.52 12.43C7.38 12.24 6.34 10.86 6.34 9.43C6.34 8 7.08 7.3 7.35 7.01C7.61 6.72 7.93 6.65 8.12 6.65C8.31 6.65 8.5 6.65 8.67 6.66C8.85 6.67 9.08 6.59 9.31 7.15C9.55 7.73 10.32 9.12 10.42 9.26C10.52 9.41 10.57 9.58 10.47 9.77C10.37 9.96 10.32 10.08 10.18 10.25C10.03 10.42 9.87 10.63 9.74 10.76C9.6 10.9 9.45 11.06 9.62 11.35C9.79 11.64 10.37 12.59 11.23 13.35C12.34 14.33 13.27 14.64 13.56 14.78C13.85 14.93 14.02 14.9 14.19 14.71C14.36 14.52 14.91 13.87 15.11 13.58C15.3 13.29 15.5 13.34 15.76 13.43C16.03 13.53 17.45 14.23 17.74 14.37C18.03 14.52 18.22 14.59 18.29 14.71C18.37 14.83 18.37 15.41 18.13 16.09L17.89 16.54Z"
      />
    </svg>
  );
};

/**
 * Ícono Oficial de Instagram
 */
export const InstagramIcon: React.FC<IconProps & { variant?: 'official' | 'mono' }> = ({
  className = 'w-5 h-5',
  size,
  variant = 'mono',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  if (variant === 'official') {
    return (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="igGradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD521" />
            <stop offset="0.3" stopColor="#F50000" />
            <stop offset="0.7" stopColor="#B900B4" />
            <stop offset="1" stopColor="#7E00FF" />
          </linearGradient>
        </defs>
        <rect width="20" height="20" x="2" y="2" rx="6" fill="url(#igGradient)" />
        <circle cx="12" cy="12" r="4.2" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="#ffffff" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      style={style}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
};

/**
 * Ícono Oficial de Facebook
 */
export const FacebookIcon: React.FC<IconProps & { variant?: 'official' | 'mono' }> = ({
  className = 'w-5 h-5',
  size,
  variant = 'mono',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  if (variant === 'official') {
    return (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path
          d="M15.12 12.6l.46-3h-2.88V7.65c0-.82.4-1.62 1.69-1.62h1.31V3.48s-1.19-.2-2.33-.2c-2.37 0-3.92 1.44-3.92 4.04V9.6H6.8v3h2.63V20c.53.08 1.07.13 1.62.13s1.09-.05 1.62-.13v-7.4h2.45z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      style={style}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
};

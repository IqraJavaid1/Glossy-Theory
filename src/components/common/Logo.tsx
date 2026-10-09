import React from 'react';
import brandLogo from '../../assets/images/logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  light = false,
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9 max-h-9',
    md: 'h-11 sm:h-12 max-h-12',
    lg: 'h-16 sm:h-20 max-h-20',
    xl: 'h-24 sm:h-28 max-h-28',
  };

  const textClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {light ? (
        /* On dark backgrounds (footer, admin modal, etc.), wrap in a refined warm-cream backing pill so the dark logo colors are 100% visible */
        <div className="bg-[#FFFDFB] rounded-xl px-2 py-1 shadow-xs border border-white/20 inline-flex items-center justify-center transition-transform duration-300 hover:scale-105 shrink-0">
          <img
            src={brandLogo}
            alt="Glossy Theory"
            className={`${sizeClasses[size]} w-auto object-contain shrink-0`}
            loading="eager"
          />
        </div>
      ) : (
        /* On light backgrounds (main store header), display the authentic transparent logo directly */
        <img
          src={brandLogo}
          alt="Glossy Theory"
          className={`${sizeClasses[size]} w-auto object-contain shrink-0 transition-transform duration-300 hover:scale-105 drop-shadow-xs`}
          loading="eager"
        />
      )}

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span
            className={`font-serif tracking-[0.2em] font-bold uppercase transition-colors ${textClasses[size]} ${
              light ? 'text-[#FAF5EE]' : 'text-[#242220]'
            }`}
          >
            GLOSSY THEORY
          </span>
          <span
            className={`text-[8px] sm:text-[9px] tracking-[0.3em] uppercase font-semibold mt-1 ${
              light ? 'text-[#F7CAC9]' : 'text-[#DC143C]'
            }`}
          >
            LUXURY ATELIER
          </span>
        </div>
      )}
    </div>
  );
};

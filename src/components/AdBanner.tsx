import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adivery?: any; // To disable TS errors for injected script
  }
}

interface AdBannerProps {
  /** The Zone ID provided by Adivery */
  zoneId: string;
  /** Optional extra classes */
  className?: string;
  /** Helpful for setting minimum heights so the layout doesn't jump */
  format?: 'banner' | 'rectangle' | 'native';
}

export default function AdBanner({ zoneId, className = '', format = 'banner' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In React/SPA, inserted nodes might need to re-trigger the ad framework.
    // Adivery script is supposed to attach to all '.adivery' classes.
    // We add a tiny delay to ensure the DOM is flushed.
    const timer = setTimeout(() => {
       if (window.adivery && typeof window.adivery.requestAds === 'function') {
           // Request ads again if api provides it
           try { window.adivery.requestAds(); } catch (e) { console.error('Adivery refresh error', e); }
       }
    }, 500);
    return () => clearTimeout(timer);
  }, [zoneId]);

  return (
    <div className={`w-full flex flex-col justify-center items-center my-8 ${className}`}>
      <span className="text-[10px] text-text-secondary/50 mb-1 tracking-widest uppercase">تبلیغات</span>
      {/* 
        This is the Adivery placeholder. 
        If Adivery loads successfully, it replaces the content of this div.
        If ad-blockers are active or it's dev mode, the fallback text remains visibly styled.
      */}
      <div 
        ref={adRef}
        className="adivery w-full flex items-center justify-center bg-bg-secondary border-2 border-border-dark border-dashed rounded-xl text-text-secondary/60 font-medium overflow-hidden relative"
        data-ad-unit={zoneId}
        style={{ 
          minHeight: format === 'rectangle' ? '250px' : '90px', 
          maxWidth: format === 'rectangle' ? '300px' : '728px' 
        }}
        title="مکان قرارگیری بنر تبلیغاتی"
      >
        <div className="p-4 text-center text-sm z-0">
          محل قرارگیری تبلیغات شما 
          <br/>
          <span className="text-xs opacity-50 mt-1 block" dir="ltr">({zoneId})</span>
        </div>
      </div>
    </div>
  );
}

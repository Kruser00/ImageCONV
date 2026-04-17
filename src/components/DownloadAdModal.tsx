import React, { useState, useEffect } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import AdBanner from './AdBanner';

interface DownloadAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  fileName?: string;
}

export default function DownloadAdModal({ isOpen, onClose, onComplete, fileName }: DownloadAdModalProps) {
  // 5 seconds is the optimal industry standard. 
  // It gives ad networks enough time to load the ad and register a "viewable impression", 
  // while not being too long to frustrate the user and cause abandonment.
  const OPTIMAL_SECONDS = 5;
  
  const [countdown, setCountdown] = useState(OPTIMAL_SECONDS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(OPTIMAL_SECONDS);
      setIsReady(false);
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown, isOpen]);

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm p-4">
      <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-border-dark shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-border-dark bg-bg-accent/50">
          <h3 className="font-bold text-text-primary">آماده‌سازی لینک دانلود...</h3>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-red-500 transition-colors p-1"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <p className="text-text-secondary text-sm text-center border-b border-border-dark pb-4 w-full mb-4 leading-relaxed">
            استفاده از این ابزار همیشه <span className="text-green-500 font-bold">رایگان</span> خواهد بود.<br/>
            لطفاً با مشاهده تبلیغات زیر از ما حمایت کنید.
          </p>
          
          {/* Rectangle format works best in modals for maximum eCPM */}
          <div className="w-full flex justify-center min-h-[250px]">
             <AdBanner zoneId="YOUR-MODAL-BANNER-ID" format="rectangle" className="my-0" />
          </div>
          
          <div className="mt-6 w-full flex flex-col items-center min-h-[60px] justify-center">
            {!isReady ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                <p className="text-text-primary font-medium text-sm">
                  لینک دانلود تا <span className="text-accent text-lg font-bold mx-1">{countdown}</span> ثانیه دیگر آماده می‌شود
                </p>
              </div>
            ) : (
              <button 
                onClick={handleDownloadClick}
                className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-xl font-bold hover:brightness-110 shadow-[0_0_15px_var(--color-accent-glow)] transition-all animate-in slide-in-from-bottom-2"
              >
                <Download className="w-5 h-5" />
                {fileName ? `دانلود ${fileName}` : 'شروع دانلود'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

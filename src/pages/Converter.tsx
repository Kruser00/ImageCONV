import { Helmet } from 'react-helmet-async';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UploadCloud, Download, Image as ImageIcon, ArrowRight, Loader2, Info, Sliders, ArrowRightLeft, Settings2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import DownloadAdModal from '../components/DownloadAdModal';

function applySharpen(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  if (amount <= 0) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const tempData = new Uint8ClampedArray(data);
  const w = width;
  const h = height;

  const a = amount * 0.05; // Scale the amount for reasonable effect
  const weights = [
    0, -a, 0,
    -a, 1 + 4 * a, -a,
    0, -a, 0
  ];
  
  const side = 3;
  const halfSide = 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dstOff = (y * w + x) * 4;
      let r = 0, g = 0, b = 0;

      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;
          
          if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
            const srcOff = (scy * w + scx) * 4;
            const wt = weights[cy * side + cx];
            r += tempData[srcOff] * wt;
            g += tempData[srcOff + 1] * wt;
            b += tempData[srcOff + 2] * wt;
          }
        }
      }
      data[dstOff] = r;
      data[dstOff + 1] = g;
      data[dstOff + 2] = b;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

export default function Converter() {
  const { conversionType } = useParams();
  
  const formats = useMemo(() => [
    { label: 'WebP', value: 'image/webp', ext: 'webp' },
    { label: 'JPEG (JPG)', value: 'image/jpeg', ext: 'jpg' },
    { label: 'PNG', value: 'image/png', ext: 'png' },
    { label: 'BMP', value: 'image/bmp', ext: 'bmp' },
    { label: 'GIF', value: 'image/gif', ext: 'gif' }
  ], []);

  // Use the optional parameter to determine SEO values and default target format
  const { fromTerm, toTerm, seoTitle, seoDesc, pageTitle } = useMemo(() => {
    let fromTerm = 'image';
    let toTerm = 'webp';
    let seoTitle = 'تبدیل فرمت عکس آنلاین | تیدیل به WEBP, JPG و PNG';
    let seoDesc = 'با استفاده از این ابزار فرمت عکس های خود را به سرعت و به آسانی به WebP و JPG یا PNG تغییر دهید. تغییر فرمت تصویر کاملا آنلاین در مرورگر.';
    let pageTitle = 'تبدیل فرمت آنلاین تصاویر';

    if (conversionType) {
      const parts = conversionType.split('-to-');
      if (parts.length === 2) {
        fromTerm = parts[0].toUpperCase();
        toTerm = parts[1].toLowerCase();
        seoTitle = `تبدیل فرمت ${fromTerm} به ${toTerm.toUpperCase()} آنلاین | پیکسل‌ابزار`;
        seoDesc = `بهترین و سریعترین ابزار تبدیل عکس ${fromTerm} به ${toTerm.toUpperCase()} بدون افت کیفیت، رایگان و سریع. آپلود عکس ${fromTerm} و دریافت ${toTerm.toUpperCase()} در لحظه.`;
        pageTitle = `تبدیل آنلاین ${fromTerm} به ${toTerm.toUpperCase()}`;
      }
    }
    return { fromTerm, toTerm, seoTitle, seoDesc, pageTitle };
  }, [conversionType]);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const initialFormat = formats.find(f => f.ext === toTerm)?.value || 'image/webp';
  const [targetFormat, setTargetFormat] = useState(initialFormat);
  
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [showEffects, setShowEffects] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [effects, setEffects] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sharpen: 0
  });

  // Sync format state with URL if it changes
  useEffect(() => {
    const newFormat = formats.find(f => f.ext === toTerm)?.value;
    if (newFormat) {
      setTargetFormat(newFormat);
    }
  }, [toTerm, formats]);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید.');
      return;
    }
    setFile(selectedFile);
    setConvertedUrl(null);
    setEffects({ brightness: 100, contrast: 100, saturation: 100, blur: 0, sharpen: 0 }); // Reset effects
    const url = URL.createObjectURL(selectedFile);
    setImagePreviewUrl(url);
  };

  // Handle live preview rendering on canvas
  useEffect(() => {
    if (!imagePreviewUrl || !previewCanvasRef.current) return;
    const img = new Image();
    img.src = imagePreviewUrl;
    img.onload = () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const MAX_WIDTH = 800;
      let scale = 1;
      if (img.width > MAX_WIDTH) {
        scale = MAX_WIDTH / img.width;
      }
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.filter = `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%) blur(${effects.blur}px)`;
      // Add fake background so transparency looks okay in preview
      ctx.fillStyle = '#1a1d23'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (effects.sharpen > 0) {
         applySharpen(ctx, canvas.width, canvas.height, effects.sharpen);
      }
    };
  }, [imagePreviewUrl, effects]);

  const handleConversion = () => {
    if (!file || !imagePreviewUrl) return;
    setIsConverting(true);
    
    const img = new Image();
    img.src = imagePreviewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Apply effects
        ctx.filter = `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%) blur(${effects.blur}px)`;

        // Handle transparency issue for JPEG and BMP
        if (targetFormat === 'image/jpeg' || targetFormat === 'image/bmp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        if (effects.sharpen > 0) {
           applySharpen(ctx, canvas.width, canvas.height, effects.sharpen);
        }
        
        try {
          const newUrl = canvas.toDataURL(targetFormat, 0.9);
          setConvertedUrl(newUrl);
        } catch(e) {
          console.error(e);
          alert('خطا در تبدیل فرمت تصویر.');
        } finally {
          setIsConverting(false);
        }
      }
    };
    img.onerror = () => {
      setIsConverting(false);
      alert('خطا در بارگذاری تصویر جهت خواندن');
    };
  };

  // Clean object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const executeDownload = () => {
    if (!convertedUrl) return;
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `converted_image.${formats.find(f => f.value === targetFormat)?.ext || 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="keywords" content={`تبدیل عکس به webp, تبدیل عکس به jpg, تبدیل فرمت عکس به png, کانورتر عکس آنلاین, ${fromTerm} به ${toTerm}`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Tool Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">{pageTitle}</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            تغییر فرمت سریع و امن تمامی فایل‌های تصویری از جمله WebP, JPEG, PNG, GIF و BMP به صورت مستقیم در مرورگر.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="bg-bg-primary rounded-2xl overflow-hidden mb-16 border-none">
          <div className="">
            
            {/* Drag & Drop Zone */}
            {!file && (
              <div 
                className={`bg-bg-secondary border-2 border-dashed rounded-[16px] p-10 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px] ${
                  dragActive ? 'border-accent bg-bg-accent' : 'border-border-dark hover:border-accent hover:bg-bg-accent'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
                  }}
                />
                <div className="w-16 h-16 bg-bg-accent border border-border-dark rounded-full flex items-center justify-center text-accent mx-auto mb-6 shadow-[0_0_15px_var(--color-accent-glow)]">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-text-secondary mb-6">تصویر خود را به اینجا بکشید یا کلیک کنید</p>
                <button className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all border-none">
                  انتخاب فایل
                </button>
              </div>
            )}

            {/* Editor Workspace */}
            {file && (
              <div className="space-y-8">
                {/* File Header Details */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-bg-secondary p-4 rounded-xl border border-border-dark gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                    <div className="p-2 bg-bg-primary rounded-lg">
                      <ImageIcon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-text-primary truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                       setFile(null);
                       setConvertedUrl(null);
                    }}
                    className="text-sm text-text-secondary hover:text-white px-4 py-2 border border-border-dark rounded-lg hover:bg-bg-accent transition-colors w-full sm:w-auto"
                  >
                    تغییر عکس
                  </button>
                </div>

                <div className="grid lg:grid-cols-[1fr_300px] gap-8">
                  {/* Left: Preview Canvas */}
                  <div className="bg-bg-secondary border border-border-dark rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] relative">
                    <canvas 
                      ref={previewCanvasRef} 
                      className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                    />
                    <div className="absolute top-4 right-4 bg-bg-primary/80 backdrop-blur border border-border-dark px-3 py-1.5 rounded-full text-xs text-text-secondary flex items-center gap-2">
                       <ImageIcon className="w-3.5 h-3.5 text-accent" /> پیش‌نمایش زنده
                    </div>
                  </div>

                  {/* Right: Effects & Settings */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-accent" /> تنظیمات تصویر
                      </h3>
                      <button 
                         onClick={() => setShowEffects(!showEffects)}
                         className="text-accent text-sm md:hidden"
                      >
                        {showEffects ? 'بستن' : 'نمایش'}
                      </button>
                    </div>
                    
                    <div className={`space-y-5 ${!showEffects ? 'hidden md:block' : 'block'}`}>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-text-secondary">روشنایی (Brightness)</label>
                          <span className="text-xs text-text-primary bg-bg-secondary px-2 py-1 rounded">{effects.brightness}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={effects.brightness} onChange={(e) => setEffects({...effects, brightness: Number(e.target.value)})} className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-accent" dir="ltr" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-text-secondary">کنتراست (Contrast)</label>
                          <span className="text-xs text-text-primary bg-bg-secondary px-2 py-1 rounded">{effects.contrast}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={effects.contrast} onChange={(e) => setEffects({...effects, contrast: Number(e.target.value)})} className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-accent" dir="ltr" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-text-secondary">اشباع رنگ (Saturation)</label>
                          <span className="text-xs text-text-primary bg-bg-secondary px-2 py-1 rounded">{effects.saturation}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={effects.saturation} onChange={(e) => setEffects({...effects, saturation: Number(e.target.value)})} className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-accent" dir="ltr" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-text-secondary">تاری (Blur)</label>
                          <span className="text-xs text-text-primary bg-bg-secondary px-2 py-1 rounded">{effects.blur}px</span>
                        </div>
                        <input type="range" min="0" max="20" step="0.5" value={effects.blur} onChange={(e) => setEffects({...effects, blur: Number(e.target.value)})} className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-accent" dir="ltr" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-text-secondary">وضوح (Sharpen)</label>
                          <span className="text-xs text-text-primary bg-bg-secondary px-2 py-1 rounded">{effects.sharpen}</span>
                        </div>
                        <input type="range" min="0" max="100" value={effects.sharpen} onChange={(e) => setEffects({...effects, sharpen: Number(e.target.value)})} className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-accent" dir="ltr" />
                      </div>
                      
                      <button 
                        onClick={() => setEffects({ brightness: 100, contrast: 100, saturation: 100, blur: 0, sharpen: 0 })}
                        className="w-full py-2 border border-border-dark text-text-secondary rounded-lg text-sm hover:bg-bg-accent hover:text-text-primary transition-colors mt-2"
                      >
                        بازگشت به حالت اولیه
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversion Settings */}
            {file && (
              <div className="mt-8 pt-8 border-t border-border-dark flex flex-col md:flex-row gap-8 items-center bg-bg-secondary p-6 rounded-xl border border-border-dark">
                
                <div className="w-full md:w-2/3 flex flex-col gap-4">
                  <label className="text-sm font-medium text-text-primary">فرمت خروجی مورد نظر را انتخاب کنید:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {formats.map(fmt => (
                      <button
                        key={fmt.value}
                        onClick={() => {
                          setTargetFormat(fmt.value);
                          setConvertedUrl(null);
                        }}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold text-center transition-all ${
                          targetFormat === fmt.value 
                            ? 'bg-accent border-accent text-white shadow-[0_0_15px_var(--color-accent-glow)]' 
                            : 'bg-bg-secondary border-border-dark text-text-secondary hover:bg-bg-accent hover:border-accent hover:text-accent'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                  
                    {['image/gif', 'image/bmp'].includes(targetFormat) && (
                      <div className="mt-4 flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-xl text-sm leading-relaxed">
                        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>
                          <strong>توجه در خروجی:</strong> در حالت وب و پردازش کلاینت، فایل‌های GIF بصورت تک‌فریم (تصویر ثابت) ذخیره می‌شوند. همچنین در صورت عدم پشتیبانی مرورگر از BMP یا GIF، تصویر به صورت PNG درمی‌آید. با این حال، تبدیل <span className="underline">از</span> GIF/BMP به سایر فرمت‌ها بدون هیچ مشکلی انجام می‌گیرد.
                        </p>
                      </div>
                    )}
                    
                  <button
                    onClick={handleConversion}
                    disabled={isConverting}
                    className="mt-4 w-full flex justify-center items-center px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-accent hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_var(--color-accent-glow)]"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        در حال تبدیل...
                      </>
                    ) : (
                      'تغییر فرمت'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Results Section */}
            {isConverting && (
              <div className="mt-8 flex flex-col items-center justify-center p-12 bg-bg-secondary border border-border-dark rounded-xl">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-text-secondary font-bold text-lg">در حال پردازش و تغییر فرمت خروجی...</p>
              </div>
            )}

            {!isConverting && convertedUrl && imagePreviewUrl && (
              <div className="mt-8 space-y-8 animate-in fade-in zoom-in duration-300">
                
                {/* Before/After Visual Comparision Slider */}
                <div className="bg-bg-secondary border border-border-dark rounded-xl p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-4 text-center">مقایسه خروجی با تصویر اولیه</h3>
                  
                  <div className="relative w-full max-w-2xl mx-auto h-[300px] sm:h-[400px] rounded-lg overflow-hidden border border-border-dark group bg-bg-primary" dir="ltr">
                    {/* Base Image (Before) */}
                    <img src={imagePreviewUrl} alt="Before" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                    
                    {/* Overlay Image (After with effects) */}
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                      style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                    >
                      <img src={convertedUrl} alt="After" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                    </div>

                    {/* Slider Input */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                    />
                    
                    {/* Divider Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-accent pointer-events-none shadow-[0_0_15px_var(--color-accent-glow)] z-0"
                      style={{ left: `calc(${sliderPos}% - 2px)` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center shadow-lg border border-white/20">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-xs font-bold pointer-events-none">بعد (با تغییرات)</div>
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-xs font-bold pointer-events-none">خام (مبدا)</div>
                  </div>
                </div>

                <div className="bg-bg-accent rounded-xl border border-border-dark p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bg-primary border border-border-dark rounded-full flex items-center justify-center text-accent shadow-[0_0_15px_var(--color-accent-glow)]">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">عملیات با موفقیت انجام شد</p>
                      <p className="text-xs text-text-secondary mt-1">فرمت شما تبدیل شده و آماده دانلود است</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowDownloadModal(true)}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-bold rounded-lg text-white bg-accent hover:brightness-110 shadow-[0_0_15px_var(--color-accent-glow)] transition-all"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    دانلود تصویر
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* AdBanner Space */}
        <AdBanner zoneId="YOUR-CONVERTER-BANNER-ID" format="banner" />

        {/* Dynamic SEO Article */}
        <section className="mt-16 pt-12 border-t border-border-dark space-y-12 mb-16 animate-in fade-in duration-500">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
               {fromTerm === 'IMAGE' 
                  ? 'همه چیز درباره تغییر فرمت عکس‌ها' 
                  : `راهنمای جامع تبدیل ${fromTerm} به ${toTerm.toUpperCase()}`}
            </h2>
            <p className="text-text-secondary mt-4 leading-relaxed">
              {fromTerm === 'IMAGE' 
                 ? 'برای بهبود سئو (SEO)، کاهش حجم و افزایش سرعت سایت، انتخاب فرمت مناسب تصویر اهمیت بالایی دارد. در اینجا با مزایای هر فرمت آشنا می‌شوید.'
                 : `دلایل، مزایا، معایب و آموزش کامل تغییر فرمت فایل‌های تصویری ${fromTerm} به ${toTerm.toUpperCase()} برای استفاده در وب‌سایت، شبکه‌های اجتماعی و نرم‌افزارها.`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-bg-secondary p-8 rounded-2xl border border-border-dark hover:border-accent/50 transition-colors">
                <h3 className="text-xl font-bold text-accent mb-4">چرا باید فرمت {fromTerm !== 'IMAGE' ? fromTerm : 'عکس‌'} را تغییر دهیم؟</h3>
                <p className="text-sm leading-8 text-text-secondary text-justify">
                  {fromTerm === 'PNG' && toTerm === 'jpg' && 'تصاویر PNG دارای حجم بالایی هستند زیرا از قابلیت فشرده‌سازی بدون افت کیفیت (Lossless) و پس‌زمینه شفاف (Transparency) پشتیبانی می‌کنند. اگر تصویر شما یک عکس طبیعی یا پرتره است و نیازی به پس‌زمینه شفاف ندارید، تبدیل آن به JPG باعث کاهش چشمگیر حجم فایل (تا ۸۰٪) می‌شود که برای سئو و سرعت لود سایت بسیار حیاتی است.'}
                  {fromTerm === 'JPG' && toTerm === 'png' && 'گاهی نیاز دارید به یک تصویر JPG افکت‌هایی نظیر حذف پس‌زمینه اضافه کنید یا روی آن متن‌ها و لوگوهای دقیقی قرار دهید. فرمت PNG به دلیل داشتن کانال آلفا (شفافیت) و جلوگیری از محوشدگی لبه‌ها، بهترین گزینه برای گرافیک‌های کامپیوتری، آیکون‌ها و لوگوها پس از ویرایش است.'}
                  {toTerm === 'webp' && `فرمت نسل جدید WebP که توسط گوگل معرفی شده است، می‌تواند حجم تصاویر ${fromTerm !== 'IMAGE' ? fromTerm : ''} را تا ۳۴ درصد نسبت به رقبا کاهش دهد. اگر قصد دارید امتیاز Core Web Vitals سایت خود را در گوگل پیج‌اسپید افزایش دهید، گوگل رسماً توصیه می‌کند تمامی عکس‌ها به WebP کانورت شوند.`}
                  {fromTerm === 'WEBP' && 'با اینکه WebP فرمت بسیار بهینه‌ای برای وب است، اما هنوز برخی از نرم‌افزارهای قدیمی سیستم‌عامل‌ها، پرینترها یا ابزارهای ادیت (مثل نسخه‌های قدیمی فتوشاپ) از آن پشتیبانی نمی‌کنند. تبدیل مجدد آن‌ها به فرمت‌های رایج مثل JPG یا PNG مشکل ناسازگاری (Compatibility) را به سرعت حل می‌کند.'}
                  {fromTerm === 'BMP' && 'فرمت BMP (بیت‌مپ) یک فرمت خام و بدون فشرده‌سازی است که حجم به شدت بالایی دارد (گاهی ده‌ها مگابایت برای یک عکس ساده). در دنیای وبِ امروز جایی برای این فرمت نیست و باید حتما آن را به فرمت‌های مدرن‌تر تغییر دهید.'}
                  {fromTerm === 'GIF' && 'فایل‌های GIF می‌توانند حاوی انیمیشن‌های سنگین باشند. تبدیل آن‌ها به تصاویر ثابت (مثل PNG یا JPG) راهی عالی برای استخراج یکی از فریم‌ها و استفاده از آن به عنوان یک عکس کاور با حجم بسیار کم است.'}
                  {fromTerm === 'IMAGE' && 'تغییر فرمت به شما کمک می‌کند بین کیفیت بصری و حجم فایل یک تعادل منطقی ایجاد کنید. موتورهای جستجو عاشق سایت‌های سریع هستند و بهینه‌سازی فرمت اولین قدم در این مسیر است.'}
                </p>
            </div>

            <div className="bg-bg-secondary p-8 rounded-2xl border border-border-dark hover:border-accent/50 transition-colors">
                <h3 className="text-xl font-bold text-accent mb-4">آموزش نحوه تبدیل {fromTerm !== 'IMAGE' ? `${fromTerm} به ${toTerm.toUpperCase()}` : ''}</h3>
                <ul className="text-sm leading-8 text-text-secondary list-decimal list-inside space-y-3">
                  <li>ابتدا بر روی کادر <strong>«انتخاب فایل»</strong> کلیک کرده یا تصویر {fromTerm !== 'IMAGE' ? fromTerm : ''} خود را در آن رها کنید (Drag & Drop).</li>
                  <li>در بخش پایین، فرمت خروجی <strong>{toTerm.toUpperCase()}</strong> را انتخاب کنید.</li>
                  <li>در صورت تمایل، از ابزارهای پنل «تنظیمات تصویر» برای افزایش کنتراست، روشنایی یا وضوح عکس استفاده کنید (پیش‌نمایش آنلاین).</li>
                  <li>روی دکمه <strong>«تغییر فرمت»</strong> کلیک کنید. تمامی پردازش‌ها در مرورگر شما انجام می‌شود.</li>
                  <li>پس از اتمام، با استفاده از اسلایدر مقایسه، خروجی را بررسی کرده و فایل جدید را دانلود کنید.</li>
                </ul>
            </div>
            
            <div className="bg-bg-secondary p-8 rounded-2xl border border-border-dark hover:border-accent/50 transition-colors md:col-span-2 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-500 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> نکات مثبت (Positives)</h3>
                <ul className="text-sm leading-7 text-text-secondary space-y-2 list-disc list-inside">
                  {toTerm === 'webp' && <li>تضمین دریافت بهترین استاندارد سئو تصاویر از سمت گوگل</li>}
                  {toTerm === 'webp' && <li>پشتیبانی از شفافیت و فشرده‌سازی بسیار بالا به صورت همزمان</li>}
                  {toTerm === 'jpg' && <li>بدون شک بهترین پشتیبانی (۱۰۰٪ سازگاری) در تمامی دستگاه‌های دیجیتال</li>}
                  {toTerm === 'jpg' && <li>مناسب‌ترین گزینه برای عکس‌های دوربین عکاسی با رنگ‌های طبیعی</li>}
                  {toTerm === 'png' && <li>عدم افت کیفیت در صورت ذخیره و بازکردن‌های متوالی (Lossless)</li>}
                  {toTerm === 'png' && <li>پشتیبانی از کانال شفافیت (Background Transparency) فوق‌العاده دقیق</li>}
                </ul>
              </div>
              <div className="w-px bg-border-dark hidden md:block"></div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> بررسی محدودیت‌ها (Negatives)</h3>
                <ul className="text-sm leading-7 text-text-secondary space-y-2 list-disc list-inside">
                  {toTerm === 'webp' && <li>نسخه‌های بسیار قدیمی سافاری یا برخی از ابزارهای گرافیکی قدیمی این فرمت را نمی‌شناسند.</li>}
                  {toTerm === 'jpg' && <li>عدم پشتیبانی از پس‌زمینه شیشه‌ای یا شفاف (Trancparency).</li>}
                  {toTerm === 'jpg' && <li>فشرده‌سازی آن مخرب است (Lossy) و ممکن است به مرور زمان و سیوهای متوالی اطراف لبه‌ها را محو کند.</li>}
                  {toTerm === 'png' && <li>حجم آن مشخصا از فرمت‌های WebP و JPG بالاتر خواهد بود.</li>}
                  {toTerm === 'png' && <li>برای عکس‌های سنگین و پرتره‌های طبیعت اصلا توصیه نمی‌شود (باعث کندی سایت می‌شود).</li>}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Internal SEO links cluster */}
        <div className="mt-12 bg-bg-secondary border border-border-dark rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text-primary mb-4">تبدیل‌های پرکاربرد (SEO Links)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/convert/png-to-jpg" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-border-dark" />
              تبدیل PNG به JPG
            </Link>
            <Link to="/convert/jpg-to-png" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-border-dark" />
              تبدیل JPG به PNG
            </Link>
            <Link to="/convert/webp-to-jpg" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-border-dark" />
              تبدیل WebP به JPG
            </Link>
            <Link to="/convert/jpg-to-webp" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-border-dark" />
              تبدیل JPG به WebP
            </Link>
            <Link to="/convert/bmp-to-jpg" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-border-dark" />
              تبدیل BMP به JPG
            </Link>
            <Link to="/convert/gif-to-png" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-border-dark" />
              تبدیل GIF به PNG
            </Link>
          </div>
        </div>
      </div>
      
      <DownloadAdModal 
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onComplete={executeDownload}
        fileName={`تصویر.${formats.find(f => f.value === targetFormat)?.ext || 'jpg'}`}
      />
    </>
  );
}

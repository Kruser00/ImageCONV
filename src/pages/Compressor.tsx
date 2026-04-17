import { Helmet } from 'react-helmet-async';
import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { UploadCloud, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import DownloadAdModal from '../components/DownloadAdModal';

export default function Compressor() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [dragActive, setDragActive] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید.');
      return;
    }
    setFile(selectedFile);
    setCompressedFile(null);
    compressImage(selectedFile, quality);
  };

  const compressImage = async (imageFile: File, targetQuality: number) => {
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        initialQuality: targetQuality,
      };
      
      const compressed = await imageCompression(imageFile, options);
      setCompressedFile(compressed);
    } catch (error) {
      console.error(error);
      alert('خطایی در حین فشرده‌سازی رخ داد.');
    } finally {
      setIsCompressing(false);
    }
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

  const handleDownload = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement('a');
    link.href = url;
    // append _compressed to the original filename
    const nameExt = file?.name.split('.') || ['image', 'jpg'];
    const ext = nameExt.pop();
    const newName = `${nameExt.join('.')}_compressed.${ext}`;
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>فشرده‌ساز آنلاین عکس | کم کردن حجم بون افت کیفیت</title>
        <meta name="description" content="با این ابزار رایگان حجم عکس‌های JPEG، PNG و WebP خود را تا 90% کاهش دهید. فشرده‌سازی سریع و ایمن درون مرورگر برای سئو و سرعت سایت." />
        <meta name="keywords" content="فشرده سازی عکس, کاهش حجم عکس, کم کردن حجم تصویر, فشرده ساز آنلاین تصویر" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Tool Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">تغییر اندازه آنلاین تصاویر بدون افت کیفیت</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            فایل‌های خود را به صورت امن و سریع آپلود کنید.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="bg-bg-primary rounded-2xl overflow-hidden mb-16">
          <div className="">
            
            {/* Drag & Drop Zone */}
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
              <p className="text-text-secondary mb-6">تصاویر خود را به اینجا بکشید یا کلیک کنید</p>
              <button className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all border-none">
                انتخاب فایل تصویر
              </button>
              <p className="text-text-secondary text-xs mt-4">فرمت‌های پشتیبانی شده: JPG, PNG, WEBP, SVG</p>
            </div>

            {/* Quality Slider (visible if file selected) */}
            {file && (
              <div className="mt-8 pt-8 border-t border-border-dark">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-text-primary">کیفیت تصویر مورد نظر:</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bg-accent text-accent border border-border-dark">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05"
                  value={quality}
                  onChange={(e) => {
                    const newQ = parseFloat(e.target.value);
                    setQuality(newQ);
                    compressImage(file, newQ);
                  }}
                  className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-accent"
                  dir="ltr"
                />
                <div className="flex justify-between text-xs text-text-secondary mt-3">
                  <span>حجم کمتر / کیفیت پایین‌تر</span>
                  <span>حجم بیشتر / کیفیت بالاتر</span>
                </div>
              </div>
            )}

            {/* Results Section */}
            {isCompressing && (
              <div className="mt-8 flex flex-col items-center justify-center p-6 bg-bg-secondary border border-border-dark rounded-xl">
                <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
                <p className="text-text-secondary font-medium">در حال پردازش تصویر...</p>
              </div>
            )}

            {!isCompressing && compressedFile && file && (
              <div className="mt-8 bg-bg-accent rounded-xl border border-border-dark p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="flex-1 w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-text-secondary" />
                      <span className="text-sm font-medium text-text-primary">حجم اولیه:</span>
                    </div>
                    <span className="text-sm text-text-secondary" dir="ltr">{formatSize(file.size)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-accent" />
                      <span className="text-sm font-bold text-text-primary">حجم نهایی:</span>
                    </div>
                    <span className="text-sm font-bold text-accent" dir="ltr">{formatSize(compressedFile.size)}</span>
                  </div>
                  
                  {file.size > compressedFile.size && (
                     <div className="pt-3 border-t border-border-dark">
                       <p className="text-sm text-accent text-center font-medium">
                         شما <strong>{Math.round((1 - compressedFile.size / file.size) * 100)}%</strong> در حجم عکس صرفه‌جویی کردید!
                       </p>
                     </div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-[0_0_15px_var(--color-accent-glow)] text-white bg-accent hover:brightness-110 transition-all"
                >
                  <Download className="w-5 h-5 ml-2" />
                  دانلود عکس
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AdBanner Space */}
        <AdBanner zoneId="YOUR-COMPRESSOR-BANNER-ID" format="banner" />

        {/* SEO Section matched to Elegant Dark */}
        <section className="mt-16 pt-12 border-t border-border-dark space-y-12 mb-16 animate-in fade-in duration-500">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
               راهنمای جامع کاهش حجم عکس و فشرده‌سازی تصاویر
            </h2>
            <p className="text-text-secondary mt-4 leading-relaxed">
              آموزش ۰ تا ۱۰۰ کم کردن حجم عکس‌ها بدون افت کیفیت مشهود برای وب‌سایت‌ها، فروشگاه‌های اینترنتی و ارسال سریع‌تر در شبکه‌های اجتماعی.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-bg-secondary p-8 rounded-2xl border border-border-dark hover:border-accent/50 transition-colors">
                <h3 className="text-xl font-bold text-accent mb-4">چرا کاهش حجم عکس برای سئو (SEO) مهم است؟</h3>
                <p className="text-sm leading-8 text-text-secondary text-justify">
                  سرعت بارگذاری صفحات وب تاثیر مستقیمی بر روی تجربه کاربری و رتبه‌بندی سرچ گوگل دارد. تصاویر معمولاً بیش از ۶۰٪ حجم یک صفحه وب را تشکیل می‌دهند. اگر عکس‌های شما بهینه‌سازی و فشرده نشده باشند، لود شدن سایت شما طول می‌کشد. گوگل با معرفی سیستم ارزیابی Core Web Vitals اهمیت فاکتور LCP (همان بزرگترین محتوای قابل مشاهده در صفحه) را دوچندان کرده است. با ابزار پیکسل‌ابزار می‌توانید حجم عکس‌ها را در عرض چند ثانیه تا ۹۰٪ کاهش دهید و رتبه سئوی خود را بهبود ببخشید.
                </p>
            </div>

            <div className="bg-bg-secondary p-8 rounded-2xl border border-border-dark hover:border-accent/50 transition-colors">
                <h3 className="text-xl font-bold text-accent mb-4">چگونه حجم عکس را بدون افت کیفیت کم کنیم؟</h3>
                <p className="text-sm leading-8 text-text-secondary text-justify mb-4">
                  پیکسل‌ابزار از پیشرفته‌ترین کتابخانه‌های فشرده‌سازی درون‌مرورگر (Browser-side Compression) استفاده می‌کند. برای شروع:
                </p>
                <ul className="text-sm leading-8 text-text-secondary list-decimal list-inside space-y-2">
                  <li>عکس خود را در کادر آپلود بالا رها کنید.</li>
                  <li>اسلایدر کیفیت را تنظیم کنید. معمولا کیفیت ۷۵ تا ۸۰٪ بهترین تعادل را بین حجم کمتر و وضوح بالا می‌دهد.</li>
                  <li>سیستم بلافاصله و بدون ارسال عکس به سرور، سایز را کم می‌کند.</li>
                  <li>درصد کاهش حجم را بررسی کرده و روی «دانلود عکس» کلیک کنید!</li>
                </ul>
            </div>
            
            <div className="bg-bg-secondary p-8 rounded-2xl border border-border-dark hover:border-accent/50 transition-colors md:col-span-2 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-500 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> فشرده‌سازی با افت کیفیت (Lossy)</h3>
                <p className="text-sm leading-7 text-text-secondary text-justify">
                  در این روش (که در ابزار بالا از آن بهره برده شده)، برخی از داده‌های پیکسلی غیرضروری تصویر حذف می‌شوند. نتیجه آن، <strong>تقلیل فوق‌العاده حجم (گاهی تا ۹۵٪)</strong> است در حالی که چشم انسان به سختی متوجه تغییر کیفیت می‌شود. فرمت‌های استاندارد آن JPEG و WebP هستند.
                </p>
              </div>
              <div className="w-px bg-border-dark hidden md:block"></div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-500 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> فشرده‌سازی بدون افت کیفیت (Lossless)</h3>
                <p className="text-sm leading-7 text-text-secondary text-justify">
                  در این مدل، فایل تصویر بدون از دست دادن هیچ پیکسلی صرفا با حذف متادیتای اضافه بهینه‌سازی می‌شود. خروجی دقیقا کیفیت نسخه اولیه را دارد اما <strong>حجم آن تغییر بسیار محسوسی نمی‌کند (نهایتا ۱۰ تا ۱۵٪ کاهش)</strong>. این روش در فرمت‌هایی مثل PNG رایج‌تر است.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      <DownloadAdModal 
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onComplete={handleDownload}
        fileName="تصویر فشرده‌شده"
      />
    </>
  );
}

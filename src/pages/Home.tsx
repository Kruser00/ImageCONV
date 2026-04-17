import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Minimize2, ArrowRightLeft, ShieldCheck, Zap, Image as ImageIcon } from 'lucide-react';
import AdBanner from '../components/AdBanner';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>ابزار آنلاین عکس | فشرده‌سازی و تغییر فرمت تصاویر</title>
        <meta name="description" content="بهترین ابزارهای آنلاین، رایگان و سریع برای ویرایش، فشرده‌سازی و تغییر فرمت تصاویر. کم کردن حجم عکس بدون افت کیفیت با پشتیبانی کامل از وب." />
        <meta name="keywords" content="کاهش حجم عکس, فشرده سازی تصویر, تبدیل فرمت عکس, تغییر فرمت به jpg, کمپرس عکس, ابزار آنلاین ویرایش عکس" />
        <link rel="canonical" href={process.env.APP_URL || undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-bg-primary border-b border-border-dark overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-border-dark)_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-tight mb-6 mt-8">
            ابزارهای هوشمند <span className="text-accent">پیکسل‌ابزار</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-text-secondary mx-auto mb-6">
            تغییر اندازه آنلاین، فشرده‌سازی و تبدیل فرمت تصاویر بدون افت کیفیت. فایل‌های خود را به صورت امن و سریع آپلود کنید.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
            <Link
              to="/compress"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-lg text-white bg-accent hover:brightness-110 md:text-lg shadow-[0_0_15px_var(--color-accent-glow)] transition-all hover:-translate-y-1 min-w-[200px]"
            >
              <Minimize2 className="w-5 h-5 ms-2" />
              کاهش حجم عکس
            </Link>
            <Link
              to="/convert"
              className="inline-flex items-center justify-center px-8 py-4 border border-border-dark text-base font-bold rounded-lg text-text-primary bg-bg-secondary hover:bg-bg-accent md:text-lg shadow-sm transition-all hover:-translate-y-1 min-w-[200px]"
            >
              <ArrowRightLeft className="w-5 h-5 ms-2 text-accent" />
              تبدیل فرمت
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Section (SEO structure) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary">ابزارهای در دسترس</h2>
          <p className="mt-4 text-lg text-text-secondary">سریع، مطمئن و با کاربری آسان.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compressor Card */}
          <Link to="/compress" className="group bg-bg-secondary rounded-[16px] p-8 border border-border-dark hover:border-accent hover:bg-bg-accent transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-bg-accent border border-border-dark rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-[0_0_15px_var(--color-accent-glow)]">
              <Minimize2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">فشرده‌سازی تصویر</h3>
            <p className="text-text-secondary leading-relaxed max-w-sm">
              حجم تصاویر خود را به شکل بی‌نظیری با حفظ کیفیت اصلی کم کنید. مناسب ارتقاء سرعت سایت.
            </p>
            <div className="mt-auto pt-4 text-accent font-medium flex items-center bg-bg-accent px-6 py-2 rounded-lg border border-border-dark group-hover:bg-bg-primary">
              شروع به کار
            </div>
          </Link>

          {/* Converter Card */}
          <Link to="/convert" className="group bg-bg-secondary rounded-[16px] p-8 border border-border-dark hover:border-accent hover:bg-bg-accent transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-bg-accent border border-border-dark rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-[0_0_15px_var(--color-accent-glow)]">
              <ArrowRightLeft className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">تبدیل فرمت عکس</h3>
            <p className="text-text-secondary leading-relaxed max-w-sm">
              فرمت تصاویر خود را تنها با یک کلیک به JPEG, PNG و WebP تغییر دهید. سریع و ایمن.
            </p>
            <div className="mt-auto pt-4 text-accent font-medium flex items-center bg-bg-accent px-6 py-2 rounded-lg border border-border-dark group-hover:bg-bg-primary">
              شروع به کار
            </div>
          </Link>
        </div>
      </section>

      {/* AdBanner Space */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner zoneId="YOUR-HOME-BANNER-ID" format="banner" />
      </div>

      {/* SEO Content Section */}
      <section className="bg-bg-primary py-20 px-4 sm:px-6 lg:px-8 border-t border-border-dark">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg text-text-secondary">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-8">چرا بهینه‌سازی تصاویر اهمیت دارد؟</h2>
          
          <div className="grid sm:grid-cols-2 gap-8 mb-12">
            <div className="bg-bg-secondary p-6 rounded-xl border border-border-dark">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-text-primary m-0">افزایش سرعت سایت</h3>
              </div>
              <p className="text-sm text-text-secondary">
                تصاویر بهینه‌نشده اصلی‌ترین دلیل کندی وب‌سایت‌ها هستند. با کاهش حجم عکس‌ها، صفحات شما سریع‌تر بارگذاری شده و تجربه کاربری (UX) بسیار بهتری رقم می‌زنند.
              </p>
            </div>
            <div className="bg-bg-secondary p-6 rounded-xl border border-border-dark">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-text-primary m-0">امنیت حریم خصوصی</h3>
              </div>
              <p className="text-sm text-text-secondary">
                تمام پردازش‌های این وب‌سایت درون مرورگر شما انجام می‌گیرد (Client-side Processing) و هیچ تصویر یا اطلاعاتی در سرورهای ما ذخیره نخواهد شد.
              </p>
            </div>
          </div>

          <p className="leading-loose">
            در دنیای دیجیتال امروز، تجربه کاربری حرف اول را می‌زند. تحقیقات نشان می‌دهد اگر یک سایت بیش از ۳ ثانیه برای بارگذاری زمان ببرد، درصد زیادی از کاربران آن را ترک می‌کنند. برای طراحان وب و سئوکاران، تبدیل تصاویر به فرمت‌های بهینه مانند <strong className="text-text-primary">WebP</strong> و کاهش حجم عکس پیش از آپلود، یک ضرورت محسوب می‌شود.
          </p>
          <p className="leading-loose">
            ما در <strong className="text-text-primary">پیکسل‌ابزار</strong> تلاش کرده‌ایم فرآیند آماده‌سازی و بهینه‌سازی تصاویر را برای وب‌مستران ایرانی و تمامی کاربرانی که نیازمند ابزاری سریع و بی‌دردسر هستند، ساده کنیم. با این سرویس شما نیازی به نرم‌افزارهای سنگین نیازمند نصب نخواهید داشت. کافیست عکس را بکشید و رها کنید (Drag and Drop) و خروجی مورد نظرتان را در کسری از ثانیه تحویل بگیرید.
          </p>
        </div>
      </section>
    </>
  );
}

import { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Image, Minimize2, ArrowRightLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'صفحه اصلی', path: '/', icon: <Image className="w-5 h-5 ms-2" /> },
    { name: 'فشرده‌سازی عکس', path: '/compress', icon: <Minimize2 className="w-5 h-5 ms-2" /> },
    { name: 'تبدیل فرمت', path: '/convert', icon: <ArrowRightLeft className="w-5 h-5 ms-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-bg-primary text-text-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <div className="bg-bg-accent rounded-lg p-2">
                    <Image className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-xl font-bold text-text-primary tracking-tight">پیکسل‌ابزار</span>
                </Link>
              </div>
              <nav className="hidden sm:ms-6 sm:flex sm:space-s-2 items-center gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-bg-accent text-accent border border-border-dark'
                        : 'text-text-secondary hover:bg-bg-accent hover:text-text-primary'
                    }`}
                  >
                    {link.icon}
                    <span className="ms-2">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-accent focus:outline-none"
              >
                <span className="sr-only">باز کردن منو</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-bg-secondary border-t border-border-dark`}>
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium mb-1 ${
                  location.pathname === link.path
                    ? 'bg-bg-accent text-accent border border-border-dark'
                    : 'text-text-secondary hover:bg-bg-accent hover:text-text-primary'
                }`}
              >
                {link.icon}
                <span className="ms-2">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-bg-primary w-full overflow-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border-dark py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-start">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="bg-bg-accent rounded-lg p-2">
                 <Image className="h-5 w-5 text-accent" />
              </div>
              <span className="text-lg font-bold text-accent">پیکسل‌ابزار</span>
            </Link>
            <p className="text-sm text-text-secondary max-w-sm">
              مجموعه‌ای کامل از ابزارهای آنلاین برای ویرایش، فشرده‌سازی و تغییر فرمت تصاویر شما با حفظ کیفیت.
            </p>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-text-primary">ابزارها</span>
              <Link to="/compress" className="text-sm text-text-secondary hover:text-accent transition">فشرده‌ساز تصویر</Link>
              <Link to="/convert" className="text-sm text-text-secondary hover:text-accent transition">تبدیل فرمت</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-text-primary">لینک‌های مفید</span>
              <Link to="/" className="text-sm text-text-secondary hover:text-accent transition">درباره ما</Link>
              <Link to="/" className="text-sm text-text-secondary hover:text-accent transition">تماس با ما</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-border-dark text-center">
          <p className="text-sm text-text-secondary">© ۲۰۲۶ پیکسل‌ابزار. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LogoPlaceholder from '@/components/landing/LogoPlaceholder';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const navLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Áreas de Trabajo', href: '#areas' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Clientes', href: '#clientes' },
  { label: 'Proyectos', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logo_url, logo_light_url, loading } = useSiteSettings();

  const renderLogo = (height: number, useLight: boolean) => {
    const url = useLight ? (logo_light_url || logo_url) : (logo_url || logo_light_url);
    if (url) {
      return (
        <img
          src={url}
          alt="Constructora El Gallego"
          style={{ height, width: 'auto', maxWidth: 260 }}
          className="object-contain transition-all duration-300"
        />
      );
    }
    if (loading) return <div style={{ height, width: height * 2.3 }} />;
    return <LogoPlaceholder size={height} variant={useLight ? 'light' : 'dark'} />;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-8xl mx-auto container-px flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            {renderLogo(scrolled ? 44 : 52, !scrolled)}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-terracotta-500 ${
                  scrolled ? 'text-charcoal-600' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden p-1.5 transition-colors ${
              scrolled ? 'text-charcoal-800' : 'text-white'
            }`}
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-100">
                <div className="flex items-center">
                  {renderLogo(44, false)}
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-charcoal-600 p-1"
                  aria-label="Cerrar menú"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col px-6 py-6 gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-charcoal-700 text-base font-medium py-3 border-b border-charcoal-50 hover:text-terracotta-500 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

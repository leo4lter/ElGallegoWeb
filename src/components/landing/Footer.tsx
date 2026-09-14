import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, ArrowUp, Mail, Send } from 'lucide-react';
import LogoPlaceholder from '@/components/landing/LogoPlaceholder';

const WHATSAPP_NUMBER = '5492920548971';

export default function Footer() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Mensaje de ${name || 'un visitante'}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:contacto@constructoraelgallego.com.ar?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setName('');
    setMessage('');
  };

  return (
    <footer id="contacto" className="bg-charcoal-900 text-white">
      <div className="max-w-8xl mx-auto container-px py-20">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <LogoPlaceholder size={32} variant="light" />
              <span className="font-display font-bold text-xl">Constructora El Gallego</span>
            </div>
            <p className="text-white/60 leading-relaxed max-w-sm">
              Empresa 100% local con 18 años de trayectoria en construcción.
              Soluciones reales para entidades privadas y públicas en Sierra Grande.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white/80 text-sm font-semibold tracking-widest uppercase mb-6">
              Contacto
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-terracotta-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-white/50 text-sm">Teléfono</p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-white text-base font-medium hover:text-terracotta-400 transition-colors">
                    2920 548971
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-terracotta-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-white/50 text-sm">Email</p>
                  <a href="mailto:contacto@constructoraelgallego.com.ar" className="text-white text-base font-medium hover:text-terracotta-400 transition-colors">
                    contacto@constructoraelgallego.com.ar
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <User className="w-5 h-5 text-terracotta-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-white/50 text-sm">Responsable Operativo</p>
                  <p className="text-white text-base font-medium">Fernando Daniel Maggiori</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-white/50 text-sm">Ubicación</p>
                  <p className="text-white text-base font-medium">Sierra Grande - Río Negro</p>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-white/80 text-sm font-semibold tracking-widest uppercase mb-6">
              Envíanos un mensaje
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-charcoal-800 border border-charcoal-700 text-white text-sm px-4 py-3 focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-white/30"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tu mensaje"
                rows={3}
                className="w-full bg-charcoal-800 border border-charcoal-700 text-white text-sm px-4 py-3 focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-white/30 resize-y"
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-terracotta-500 text-white font-semibold text-sm py-3 hover:bg-terracotta-600 transition-colors"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
                {sent ? 'Abriendo tu correo...' : 'Enviar mensaje'}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="text-white/80 text-sm font-semibold tracking-widest uppercase mb-6">
                Navegación
              </h3>
              <ul className="space-y-3">
                <li><a href="#nosotros" className="text-white/60 hover:text-terracotta-400 transition-colors">Sobre Nosotros</a></li>
                <li><a href="#areas" className="text-white/60 hover:text-terracotta-400 transition-colors">Áreas de Trabajo</a></li>
                <li><a href="#servicios" className="text-white/60 hover:text-terracotta-400 transition-colors">Servicios</a></li>
                <li><a href="#clientes" className="text-white/60 hover:text-terracotta-400 transition-colors">Clientes</a></li>
                <li><a href="#galeria" className="text-white/60 hover:text-terracotta-400 transition-colors">Galería</a></li>
              </ul>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-white/60 hover:text-terracotta-400 transition-colors text-sm mt-8"
            >
              <ArrowUp className="w-4 h-4" strokeWidth={1.5} />
              Volver arriba
            </a>
          </motion.div>
        </div>

        <div className="border-t border-charcoal-700 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Constructora El Gallego. Todos los derechos reservados.
          </p>
          <p className="text-white/40 text-sm">
            Desarrollado por{' '}
            <a
              href="https://elmanca.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta-400 hover:text-terracotta-300 transition-colors font-medium"
            >
              Manca
            </a>
            {' · '}
            <a
              href="https://elmanca.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-terracotta-400 transition-colors"
            >
              elmanca.com.ar
            </a>
          </p>
          <p className="text-white/40 text-sm">Sierra Grande · Río Negro · Argentina</p>
        </div>
      </div>
    </footer>
  );
}

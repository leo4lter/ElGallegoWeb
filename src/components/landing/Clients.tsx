import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { Building2 } from 'lucide-react';

export default function Clients() {
  const { clients, loading } = useData();

  return (
    <section id="clientes" className="section-py bg-white">
      <div className="max-w-8xl mx-auto container-px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-terracotta-500" />
            <span className="text-terracotta-500 text-sm font-semibold tracking-widest uppercase">
              Clientes
            </span>
            <div className="w-10 h-px bg-terracotta-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-charcoal-900">
            Clientes que trabajan con nosotros
          </h2>
          <p className="text-charcoal-500 text-lg mt-6 leading-relaxed">
            Entidades públicas y privadas que confían en nuestra experiencia y
            capacidad de ejecución.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/2] bg-charcoal-100 animate-pulse" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16 text-charcoal-400">
            <Building2 className="w-12 h-12 mx-auto mb-4" strokeWidth={1} />
            <p>Próximamente mostraremos aquí a nuestros clientes.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clients.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-charcoal-50 border border-charcoal-100 hover:border-terracotta-200 transition-colors duration-300 p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 mb-5 overflow-hidden bg-white border border-charcoal-100 flex items-center justify-center">
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base text-charcoal-700 font-medium">{client.name}</h3>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

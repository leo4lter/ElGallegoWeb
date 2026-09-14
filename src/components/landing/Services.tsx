import { motion } from 'framer-motion';
import {
  Building2,
  HardHat,
  PaintRoller,
  Truck,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Service = {
  icon: LucideIcon;
  title: string;
  short: string;
  description: string;
  category: string;
};

export const services: Service[] = [
  {
    icon: Building2,
    title: 'Construcción',
    short: 'Obras privadas y públicas de cualquier escala.',
    description:
      'Ejecutamos obras privadas y públicas de cualquier escala, desde viviendas unifamiliares hasta edificios e infraestructura. Nos ocupamos de cada etapa del proceso: cimientos, estructura, mampostería, terminaciones y entrega. Trabajamos con materiales de primera y mano de obra local calificada, garantizando solidez y durabilidad en cada proyecto.',
    category: 'Construcción',
  },
  {
    icon: HardHat,
    title: 'Remodelaciones',
    short: 'Renovación y ampliación de espacios existentes.',
    description:
      'Renovamos y ampliamos espacios existentes con un enfoque práctico y eficiente. Manejamos desde refacciones menores hasta remodelaciones integrales: pintura, pisos, electricidad, plomería y terminaciones. Nos adaptamos a las necesidades de cada cliente, minimizando tiempos de obra y respetando el espacio habitado.',
    category: 'Remodelaciones',
  },
  {
    icon: PaintRoller,
    title: 'Pintura',
    short: 'Pintura interior y exterior para todo tipo de edificaciones.',
    description:
      'Aplicamos pintura interior y exterior en viviendas, comercios y edificios públicos. Preparamos cada superficie con esmero para asegurar un acabado uniforme y duradero. Trabajamos con productos de primera línea y técnicas que garantizan resistencia al clima y al paso del tiempo.',
    category: 'Pintura',
  },
  {
    icon: Truck,
    title: 'Servicio de Camiones',
    short: 'Transporte y logística con flota propia.',
    description:
      'Ofrecemos transporte de materiales, áridos y maquinaria con flota de camiones propia. Cubrimos la logística de obra de punta a punta, desde el acopio de materiales hasta el retiro de escombros. Nuestro servicio garantiza respuesta inmediata y abastecimiento continuo, incluso en condiciones operativas exigentes.',
    category: 'Servicio de Camiones',
  },
  {
    icon: Layers,
    title: 'Movimiento de Suelo',
    short: 'Excavación, relleno y preparación de terrenos.',
    description:
      'Realizamos excavación, relleno, nivelación y compactación de terrenos con maquinaria pesada propia. Preparamos el suelo para plateas, cimientos, caminos y obras civiles, asegurando la estabilidad necesaria para cada tipo de construcción. Optimizamos tiempos y costos con equipamiento y experiencia operativa local.',
    category: 'Movimiento de Suelo',
  },
];

type ServicesProps = {
  onViewProjects: (category: string) => void;
};

export default function Services({ onViewProjects }: ServicesProps) {
  return (
    <section id="servicios" className="section-py bg-charcoal-50">
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
              Nuestros Servicios
            </span>
            <div className="w-10 h-px bg-terracotta-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-charcoal-900">
            Soluciones de construcción para cada etapa
          </h2>
          <p className="text-charcoal-500 text-lg mt-6 leading-relaxed">
            Capacidad, experiencia y ejecución responsable en obras privadas y
            públicas en Sierra Grande y la región.
          </p>
        </motion.div>

        <div className="space-y-6">
          {services.map((service, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white border border-charcoal-100 hover:border-terracotta-200 transition-colors duration-300 overflow-hidden"
              >
                <div className="grid lg:grid-cols-12 gap-0 items-stretch">
                  <div className={`lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 flex items-center justify-center bg-charcoal-50 flex-shrink-0">
                        <service.icon className="w-7 h-7 text-terracotta-500" strokeWidth={1.25} />
                      </div>
                      <h3 className="text-2xl text-charcoal-900">{service.title}</h3>
                    </div>
                    <p className="text-charcoal-500 leading-relaxed text-base">
                      {service.description}
                    </p>
                    <button
                      onClick={() => onViewProjects(service.category)}
                      className="inline-flex items-center gap-2 mt-6 text-terracotta-600 font-semibold text-sm hover:gap-3 transition-all duration-300 w-fit"
                    >
                      Ver proyectos
                      <span aria-hidden>&rarr;</span>
                    </button>
                  </div>
                  <div className={`lg:col-span-8 ${isEven ? 'lg:order-2' : 'lg:order-1'} min-h-[200px] lg:min-h-[280px] relative`}>
                    <ServiceImage index={i} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="#contacto"
            className="inline-flex items-center justify-center bg-terracotta-500 text-white font-semibold px-8 py-3.5 hover:bg-terracotta-600 transition-colors duration-300"
          >
            Solicitar cotización
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceImage({ index }: { index: number }) {
  const images = [
    'https://images.pexels.com/photos/8961343/pexels-photo-8961343.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    'https://images.pexels.com/photos/5690811/pexels-photo-5690811.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    'https://images.pexels.com/photos/15071423/pexels-photo-15071423.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    'https://images.pexels.com/photos/30751525/pexels-photo-30751525.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
  ];
  const src = images[index % images.length];
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

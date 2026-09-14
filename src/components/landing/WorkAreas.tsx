import { motion } from 'framer-motion';
import {
  Route,
  Building2,
  Droplets,
  Layers,
  Sprout,
  Factory,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type WorkArea = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const areas: WorkArea[] = [
  {
    icon: Route,
    title: 'Obras Viales',
    description:
      'Conectividad que resiste el paso del tiempo. Construcción, pavimentación y mejora de caminos con los más altos estándares de calidad. Garantizamos durabilidad y un rendimiento óptimo, incluso frente a las condiciones de tránsito y clima más exigentes.',
  },
  {
    icon: Building2,
    title: 'Infraestructura Urbana',
    description:
      'Bases sólidas para las ciudades del futuro. Desarrollo de redes y espacios públicos eficientes e integrados. Proyectamos entornos sostenibles y funcionales, pensados para crecer, adaptarse a la comunidad y perdurar en el tiempo.',
  },
  {
    icon: Droplets,
    title: 'Obras Hidráulicas',
    description:
      'Gestión inteligente y segura de recursos hídricos. Soluciones integrales para el control, canalización y manejo del agua. Diseñamos infraestructuras confiables que protegen el entorno, previenen riesgos y optimizan la viabilidad de cada proyecto.',
  },
  {
    icon: Layers,
    title: 'Movimiento de Suelos',
    description:
      'El punto de partida exacto para grandes construcciones. Excavación, nivelación y preparación integral de terrenos. Contamos con el equipo adecuado para asegurar la máxima eficiencia, seguridad y precisión operativa desde la base misma de tu obra.',
  },
  {
    icon: Sprout,
    title: 'Paisajismo y Sistemas de Riegos',
    description:
      'Entornos naturales, vivos y eficientes. Diseño y ejecución de áreas verdes integrales. Implementamos soluciones de paisajismo acompañadas de sistemas de riego automatizados y de bajo consumo, realzando la estética de los espacios mientras cuidamos cada gota de agua.',
  },
  {
    icon: Factory,
    title: 'Fábrica',
    description:
      'Producción propia de materiales y elementos para la construcción. Contamos con instalaciones equipadas para fabricar y suministrar insumos de calidad, garantizando trazabilidad, control de costos y tiempos de entrega confiables para cada obra.',
  },
];

export default function WorkAreas() {
  return (
    <section id="areas" className="section-py bg-charcoal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-terracotta-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-8xl mx-auto container-px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-terracotta-400" />
            <span className="text-terracotta-400 text-sm font-semibold tracking-widest uppercase">
              Áreas de Trabajo
            </span>
            <div className="w-10 h-px bg-terracotta-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Especialistas en cada frente de obra
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-charcoal-800 p-8 border border-charcoal-700 hover:border-terracotta-500 transition-colors duration-300 cursor-default"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-charcoal-700 group-hover:bg-terracotta-100 transition-colors duration-300 mb-6">
                <area.icon
                  className="w-7 h-7 text-terracotta-400"
                  strokeWidth={1.25}
                />
              </div>
              <h3 className="text-xl text-white mb-3">{area.title}</h3>
              <p className="text-white/60 leading-relaxed">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

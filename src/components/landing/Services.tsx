import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import type { Project } from '@/lib/supabase';
import {
  Building2,
  HardHat,
  PaintRoller,
  Truck,
  Layers,
  X,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
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

const SERVICE_IMAGES = [
  'https://images.pexels.com/photos/8961343/pexels-photo-8961343.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
  'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
  'https://images.pexels.com/photos/5690811/pexels-photo-5690811.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
  'https://images.pexels.com/photos/15071423/pexels-photo-15071423.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
  'https://images.pexels.com/photos/30751525/pexels-photo-30751525.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
];

export default function Services() {
  const { projects, loading } = useData();
  const [lightboxCategory, setLightboxCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const serviceProjects = useMemo(() => {
    if (!lightboxCategory) return [];
    return projects.filter((p) => p.category === lightboxCategory);
  }, [projects, lightboxCategory]);

  const currentProject = useMemo(() => {
    if (!selectedProject) return null;
    return projects.find((p) => p.id === selectedProject) || null;
  }, [projects, selectedProject]);

  const currentGallery = useMemo(() => {
    if (!currentProject) return [];
    const imgs = currentProject.gallery_images && currentProject.gallery_images.length > 0
      ? currentProject.gallery_images
      : [currentProject.image_url];
    return imgs;
  }, [currentProject]);

  const closeLightbox = () => {
    setLightboxCategory(null);
    setSelectedProject(null);
    setImageIndex(0);
  };

  const openProject = (id: string) => {
    setSelectedProject(id);
    setImageIndex(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
    setImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev + 1) % currentGallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev - 1 + currentGallery.length) % currentGallery.length);
  };

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
                      onClick={() => setLightboxCategory(service.category)}
                      className="inline-flex items-center gap-2 mt-6 text-terracotta-600 font-semibold text-sm hover:gap-3 transition-all duration-300 w-fit"
                    >
                      Ver proyectos
                      <span aria-hidden>&rarr;</span>
                    </button>
                  </div>
                  <div className={`lg:col-span-8 ${isEven ? 'lg:order-2' : 'lg:order-1'} min-h-[200px] lg:min-h-[280px] relative`}>
                    <img
                      src={SERVICE_IMAGES[i % SERVICE_IMAGES.length]}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
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

      {/* Lightbox: project list for a service */}
      <AnimatePresence>
        {lightboxCategory && !selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
            onClick={closeLightbox}
          >
            <div className="absolute inset-0 bg-charcoal-900/85 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 bg-white/90 p-2 text-charcoal-700 hover:bg-terracotta-500 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <div className="p-6 sm:p-8">
                <span className="text-terracotta-500 text-xs font-semibold tracking-widest uppercase">
                  {lightboxCategory}
                </span>
                <h3 className="text-2xl sm:text-3xl text-charcoal-900 mt-2 mb-6">
                  Proyectos de {lightboxCategory}
                </h3>

                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="aspect-[4/3] bg-charcoal-100 animate-pulse" />
                    ))}
                  </div>
                ) : serviceProjects.length === 0 ? (
                  <div className="text-center py-16 text-charcoal-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4" strokeWidth={1} />
                    <p>No hay proyectos en esta categoría todavía.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {serviceProjects.map((project, i) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        onClick={() => openProject(project.id)}
                        className="group relative overflow-hidden cursor-pointer"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                          <h4 className="text-white text-lg font-bold">{project.title}</h4>
                          <p className="text-white/70 text-sm mt-1 line-clamp-2">{project.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox: individual project detail */}
      <AnimatePresence>
        {currentProject && (
          <ProjectDetailModal
            project={currentProject}
            gallery={currentGallery}
            imageIndex={imageIndex}
            onClose={closeProject}
            onNext={nextImage}
            onPrev={prevImage}
            onSetImage={setImageIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

type ProjectDetailModalProps = {
  project: Project;
  gallery: string[];
  imageIndex: number;
  onClose: () => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  onSetImage: (i: number) => void;
};

function ProjectDetailModal({
  project,
  gallery,
  imageIndex,
  onClose,
  onNext,
  onPrev,
  onSetImage,
}: ProjectDetailModalProps) {
  const hasDetails = project.location || project.client || project.year || project.scope;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-charcoal-900/85 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 p-2 text-charcoal-700 hover:bg-terracotta-500 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div className="relative h-72 sm:h-96 overflow-hidden bg-charcoal-100">
          <img
            src={gallery[imageIndex]}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {gallery.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-charcoal-900/60 text-white p-2 hover:bg-terracotta-500 transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-charcoal-900/60 text-white p-2 hover:bg-terracotta-500 transition-colors"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-charcoal-900/60 text-white text-xs px-3 py-1">
                {imageIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => onSetImage(i)}
                className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors ${
                  i === imageIndex ? 'border-terracotta-500' : 'border-transparent hover:border-charcoal-200'
                }`}
              >
                <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-6 sm:p-8">
          <span className="text-terracotta-500 text-xs font-semibold tracking-widest uppercase">
            {project.category}
          </span>
          <h3 className="text-2xl sm:text-3xl text-charcoal-900 mt-2 mb-4">{project.title}</h3>
          <p className="text-charcoal-600 leading-relaxed mb-6">{project.description}</p>

          {hasDetails && (
            <div className="border-t border-charcoal-100 pt-6">
              <h4 className="text-sm font-semibold tracking-widest uppercase text-charcoal-400 mb-4">
                Información técnica
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.location && (
                  <DetailItem icon={MapPin} label="Ubicación" value={project.location} />
                )}
                {project.client && (
                  <DetailItem icon={User} label="Cliente" value={project.client} />
                )}
                {project.year && (
                  <DetailItem icon={Calendar} label="Año" value={project.year} />
                )}
                {project.scope && (
                  <DetailItem icon={Layers} label="Alcance" value={project.scope} />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-terracotta-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
      <div>
        <p className="text-charcoal-400 text-xs font-semibold tracking-wider uppercase">{label}</p>
        <p className="text-charcoal-700 text-sm mt-0.5">{value}</p>
      </div>
    </div>
  );
}

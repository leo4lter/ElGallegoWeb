import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import type { Project } from '@/lib/supabase';
import { X, ImageIcon, MapPin, Calendar, User, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
  const { projects, loading } = useData();
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ['Todos', ...Array.from(cats)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (filter === 'Todos') return projects;
    return projects.filter((p) => p.category === filter);
  }, [projects, filter]);

  const selectedProject = projects.find((p) => p.id === selected);

  const galleryImages = useMemo(() => {
    if (!selectedProject) return [];
    const imgs = selectedProject.gallery_images && selectedProject.gallery_images.length > 0
      ? selectedProject.gallery_images
      : [selectedProject.image_url];
    return imgs;
  }, [selectedProject]);

  const closeLightbox = () => {
    setSelected(null);
    setLightboxIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section id="galeria" className="section-py bg-white">
      <div className="max-w-8xl mx-auto container-px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-terracotta-500" />
            <span className="text-terracotta-500 text-sm font-semibold tracking-widest uppercase">
              Galería de Proyectos
            </span>
            <div className="w-10 h-px bg-terracotta-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-charcoal-900">
            Obras que hablan por nosotros
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-charcoal-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 text-sm font-medium border transition-all duration-300 ${
                    filter === cat
                      ? 'bg-terracotta-500 text-white border-terracotta-500'
                      : 'bg-white text-charcoal-600 border-charcoal-200 hover:border-terracotta-500 hover:text-terracotta-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-charcoal-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-4" strokeWidth={1} />
                <p>No hay proyectos en esta categoría.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                    onClick={() => {
                      setSelected(project.id);
                      setLightboxIndex(0);
                    }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-terracotta-300 text-xs font-semibold tracking-widest uppercase mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-white text-xl font-bold">{project.title}</h3>
                      <p className="text-white/70 text-sm mt-1 line-clamp-2">{project.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            galleryImages={galleryImages}
            lightboxIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
            onSetLightbox={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

type ProjectModalProps = {
  project: Project;
  galleryImages: string[];
  lightboxIndex: number;
  onClose: () => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  onSetLightbox: (i: number) => void;
};

function ProjectModal({
  project,
  galleryImages,
  lightboxIndex,
  onClose,
  onNext,
  onPrev,
  onSetLightbox,
}: ProjectModalProps) {
  const hasDetails = project.location || project.client || project.year || project.scope;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
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
            src={galleryImages[lightboxIndex]}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {galleryImages.length > 1 && (
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
                {lightboxIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}
        </div>

        {galleryImages.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => onSetLightbox(i)}
                className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors ${
                  i === lightboxIndex ? 'border-terracotta-500' : 'border-transparent hover:border-charcoal-200'
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import type { Project } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, AlertCircle, ImagePlus, Trash } from 'lucide-react';

const SERVICE_CATEGORIES = [
  'Construcción',
  'Remodelaciones',
  'Pintura',
  'Servicio de Camiones',
  'Movimiento de Suelo',
];

type FormState = {
  title: string;
  description: string;
  image_url: string;
  category: string;
  gallery_images: string[];
  location: string;
  client: string;
  year: string;
  scope: string;
};

const emptyForm: FormState = {
  title: '',
  description: '',
  image_url: '',
  category: 'Construcción',
  gallery_images: [],
  location: '',
  client: '',
  year: '',
  scope: '',
};

export default function ProjectsManager() {
  const { projects, addProject, updateProject, deleteProject, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
    setNewImageUrl('');
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      description: p.description,
      image_url: p.image_url,
      category: p.category,
      gallery_images: p.gallery_images || [],
      location: p.location || '',
      client: p.client || '',
      year: p.year || '',
      scope: p.scope || '',
    });
    setEditingId(p.id);
    setShowForm(true);
    setError('');
    setNewImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url.trim()) {
      setError('El título y la URL de imagen principal son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await addProject(payload);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    try {
      await deleteProject(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const addGalleryImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setForm({ ...form, gallery_images: [...form.gallery_images, url] });
    setNewImageUrl('');
  };

  const removeGalleryImage = (index: number) => {
    setForm({ ...form, gallery_images: form.gallery_images.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Gestor de Proyectos</h1>
          <p className="text-charcoal-500 mt-1">Administra las obras visibles en la galería.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Nuevo Proyecto
        </button>
      </div>

      {loading ? (
        <div className="text-charcoal-400 text-center py-16">Cargando proyectos...</div>
      ) : projects.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-charcoal-400">No hay proyectos. Crea el primero.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-card overflow-hidden group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-charcoal-100">
                <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-terracotta-500 uppercase tracking-wider">{p.category}</span>
                <h3 className="text-base font-bold text-charcoal-900 mt-1 mb-1">{p.title}</h3>
                <p className="text-sm text-charcoal-500 line-clamp-2 mb-4">{p.description}</p>
                {(p.location || p.year) && (
                  <p className="text-xs text-charcoal-400 mb-3">
                    {p.location}{p.location && p.year ? ' · ' : ''}{p.year}
                  </p>
                )}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 border border-charcoal-200 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors">
                    <Pencil className="w-4 h-4" strokeWidth={1.5} /> Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex items-center justify-center gap-1.5 border border-charcoal-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-5"
          >
            <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-charcoal-900">
                  {editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-charcoal-400 hover:text-charcoal-700 p-1">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Título *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="Nombre del proyecto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Servicio / Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Descripción</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field min-h-[100px] resize-y"
                    placeholder="Breve descripción del proyecto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">URL de Imagen Principal *</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="input-field"
                    placeholder="https://..."
                  />
                  {form.image_url && (
                    <div className="mt-3 aspect-video bg-charcoal-100 overflow-hidden">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Gallery images */}
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Galería de Imágenes</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="input-field flex-1"
                      placeholder="https://..."
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGalleryImage(); } }}
                    />
                    <button
                      type="button"
                      onClick={addGalleryImage}
                      className="flex items-center gap-1.5 border border-charcoal-200 px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
                    >
                      <ImagePlus className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  {form.gallery_images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {form.gallery_images.map((url, i) => (
                        <div key={i} className="relative group aspect-square overflow-hidden bg-charcoal-100">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            className="absolute inset-0 bg-charcoal-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          >
                            <Trash className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Technical details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Ubicación</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="input-field"
                      placeholder="Sierra Grande, Río Negro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Cliente</label>
                    <input
                      type="text"
                      value={form.client}
                      onChange={(e) => setForm({ ...form, client: e.target.value })}
                      className="input-field"
                      placeholder="Privado / Municipalidad..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Año</label>
                    <input
                      type="text"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="input-field"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Alcance</label>
                    <input
                      type="text"
                      value={form.scope}
                      onChange={(e) => setForm({ ...form, scope: e.target.value })}
                      className="input-field"
                      placeholder="Resumen técnico del trabajo"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm py-2.5">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 text-sm py-2.5 disabled:opacity-50">
                    {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear proyecto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

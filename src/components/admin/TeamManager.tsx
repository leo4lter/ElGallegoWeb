import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { uploadImage, type TeamMember } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, AlertCircle, Upload, ArrowUp, ArrowDown, UserCircle } from 'lucide-react';

const emptyForm: Omit<TeamMember, 'id' | 'created_at'> = {
  name: '',
  role: '',
  bio: '',
  image_url: '',
  display_order: 0,
};

export default function TeamManager() {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setForm({ ...emptyForm, display_order: teamMembers.length });
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (m: TeamMember) => {
    setForm({ name: m.name, role: m.role, bio: m.bio ?? '', image_url: m.image_url ?? '', display_order: m.display_order });
    setEditingId(m.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      setError('El nombre y el cargo son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateTeamMember(editingId, form);
      } else {
        await addTeamMember(form);
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
    if (!confirm('¿Eliminar este miembro del equipo?')) return;
    try {
      await deleteTeamMember(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('La imagen no debe superar los 3 MB.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file, 'team');
      if (url) {
        setForm((prev) => ({ ...prev, image_url: url }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const moveOrder = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...teamMembers].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((m) => m.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    try {
      await Promise.all([
        updateTeamMember(a.id, { display_order: b.display_order }),
        updateTeamMember(b.id, { display_order: a.display_order }),
      ]);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Gestor de Equipo</h1>
          <p className="text-charcoal-500 mt-1">Miembros del equipo que se muestran en la página.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Nuevo Miembro
        </button>
      </div>

      {loading ? (
        <div className="text-charcoal-400 text-center py-16">Cargando equipo...</div>
      ) : teamMembers.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-charcoal-400">No hay miembros del equipo. Agrega el primero.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...teamMembers].sort((a, b) => a.display_order - b.display_order).map((m, i, arr) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-card overflow-hidden group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-charcoal-100">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-charcoal-300" strokeWidth={1} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-charcoal-900 mb-0.5">{m.name}</h3>
                <p className="text-sm text-terracotta-500 font-medium mb-3">{m.role}</p>
                <div className="flex items-center gap-1 mb-3">
                  <button
                    onClick={() => moveOrder(m.id, 'up')}
                    disabled={i === 0}
                    className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Mover arriba"
                  >
                    <ArrowUp className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => moveOrder(m.id, 'down')}
                    disabled={i === arr.length - 1}
                    className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Mover abajo"
                  >
                    <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <span className="text-xs text-charcoal-300 ml-1">Orden: {m.display_order}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-1.5 border border-charcoal-200 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors">
                    <Pencil className="w-4 h-4" strokeWidth={1.5} /> Editar
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="flex items-center justify-center gap-1.5 border border-charcoal-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
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
                  {editingId ? 'Editar Miembro' : 'Nuevo Miembro'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-charcoal-400 hover:text-charcoal-700 p-1">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Nombre *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Ej: Fernando Daniel Maggiori"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Cargo *</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="input-field"
                    placeholder="Ej: Responsable Operativo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Biografía</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="input-field min-h-[100px] resize-y"
                    placeholder="Breve descripción del rol y experiencia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Foto</label>
                  <p className="text-charcoal-400 text-xs mb-3">Medidas recomendadas: 600 x 800 px · Formato: PNG o JPG</p>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="aspect-[3/4] w-32 overflow-hidden bg-charcoal-100 border border-charcoal-200 flex items-center justify-center flex-shrink-0">
                      {form.image_url ? (
                        <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-12 h-12 text-charcoal-300" strokeWidth={1} />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
                      <div className="flex items-center justify-center gap-2 border border-charcoal-200 px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors">
                        <Upload className="w-4 h-4" strokeWidth={1.5} />
                        {uploading ? 'Subiendo...' : 'Subir foto'}
                      </div>
                    </label>
                  </div>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="input-field"
                    placeholder="O pega una URL: https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Orden de aparición</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    min={0}
                  />
                  <p className="text-charcoal-400 text-xs mt-1">Los números más bajos aparecen primero.</p>
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
                    {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear miembro'}
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

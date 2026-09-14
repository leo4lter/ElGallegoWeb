import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { uploadImage, type Client } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, AlertCircle, Upload } from 'lucide-react';

const emptyForm: Omit<Client, 'id' | 'created_at'> = {
  name: '',
  logo_url: '',
};

const LOGO_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNjZWNlY2UiLz48dGV4dCB4PSIxMDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ28gMjAweDIwMCAuUE5HIC8gLlNWRzwvdGV4dD48L3N2Zz4=';

export default function ClientsManager() {
  const { clients, addClient, updateClient, deleteClient, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (c: Client) => {
    setForm({ name: c.name, logo_url: c.logo_url });
    setEditingId(c.id);
    setShowForm(true);
    setError('');
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2 MB.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file, 'clients');
      if (url) {
        setForm((prev) => ({ ...prev, logo_url: url }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.logo_url.trim()) {
      setError('El nombre y el logo son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateClient(editingId, form);
      } else {
        await addClient(form);
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
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await deleteClient(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Gestor de Clientes</h1>
          <p className="text-charcoal-500 mt-1">Logos que aparecen en la tira de la landing.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Nuevo Cliente
        </button>
      </div>

      {loading ? (
        <div className="text-charcoal-400 text-center py-16">Cargando clientes...</div>
      ) : clients.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-charcoal-400">No hay clientes. Agrega el primero.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {clients.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-card p-5 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 overflow-hidden bg-charcoal-100 flex items-center justify-center">
                <img src={c.logo_url} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-bold text-charcoal-900 mb-3 line-clamp-2">{c.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 border border-charcoal-200 py-2 text-xs font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors">
                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} /> Editar
                </button>
                <button onClick={() => handleDelete(c.id)} className="flex items-center justify-center border border-charcoal-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
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
              className="relative bg-white w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-charcoal-900">
                  {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-charcoal-400 hover:text-charcoal-700 p-1">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Nombre del Cliente *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Empresa o institución"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                    Logo del Cliente *
                  </label>
                  <p className="text-charcoal-400 text-xs mb-3">
                    Medidas recomendadas: 200 x 200 px · Formato: PNG o SVG
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 overflow-hidden bg-charcoal-100 border border-charcoal-200 flex items-center justify-center flex-shrink-0">
                      <img
                        src={form.logo_url || LOGO_PLACEHOLDER}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/jpeg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2 border border-charcoal-200 py-3 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors">
                        <Upload className="w-4 h-4" strokeWidth={1.5} />
                        {uploading ? 'Subiendo...' : 'Subir imagen'}
                      </div>
                    </label>
                  </div>
                  <div className="mt-3">
                    <p className="text-charcoal-400 text-xs mb-1">O pega una URL:</p>
                    <input
                      type="url"
                      value={form.logo_url}
                      onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
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
                    {saving ? 'Guardando...' : editingId ? 'Guardar' : 'Crear'}
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

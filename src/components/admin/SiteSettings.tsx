import { useState, useEffect } from 'react';
import { Upload, AlertCircle, Check } from 'lucide-react';
import { uploadImage, getSiteSettings, saveSiteSettings } from '@/lib/supabase';

const LOGO_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyMDAgNDAiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNDAiIGZpbGw9IiNjZWNlY2UiLz48dGV4dCB4PSIxMDAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD48L3N2Zz4=';
const FAVICON_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNjZWNlY2UiLz48dGV4dCB4PSIzMiIgeT0iMzciIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj42NHg2NDwvdGV4dD48L3N2Zz4=';

type ImageConfig = {
  key: 'logo' | 'logo_light' | 'favicon';
  label: string;
  description: string;
  dimensions: string;
  formats: string;
  placeholder: string;
  previewHeight: number;
  previewBg: string;
};

const imageConfigs: ImageConfig[] = [
  {
    key: 'logo',
    label: 'Logo Original (oscuro)',
    description: 'Se muestra cuando el header es blanco (al hacer scroll) y en el pie de página.',
    dimensions: '200 x 40 px',
    formats: 'SVG o PNG',
    placeholder: LOGO_PLACEHOLDER,
    previewHeight: 40,
    previewBg: 'bg-white border border-charcoal-200',
  },
  {
    key: 'logo_light',
    label: 'Logo Claro (blanco)',
    description: 'Se muestra cuando el header es transparente (al inicio de la página).',
    dimensions: '200 x 40 px',
    formats: 'SVG o PNG',
    placeholder: LOGO_PLACEHOLDER,
    previewHeight: 40,
    previewBg: 'bg-charcoal-900',
  },
  {
    key: 'favicon',
    label: 'Icono del Sitio (Favicon)',
    description: 'Aparece en la pestaña del navegador.',
    dimensions: '64 x 64 px',
    formats: 'SVG o PNG',
    placeholder: FAVICON_PLACEHOLDER,
    previewHeight: 64,
    previewBg: 'bg-white border border-charcoal-200',
  },
];

export default function SiteSettings() {
  const [images, setImages] = useState<Record<string, string>>({
    logo: '',
    logo_light: '',
    favicon: '',
  });
  const [originalUrls, setOriginalUrls] = useState<Record<string, string | null>>({
    logo: null,
    logo_light: null,
    favicon: null,
  });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const settings = await getSiteSettings();
        setImages({
          logo: settings.logo_url || '',
          logo_light: settings.logo_light_url || '',
          favicon: settings.favicon_url || '',
        });
        setOriginalUrls({
          logo: settings.logo_url,
          logo_light: settings.logo_light_url,
          favicon: settings.favicon_url,
        });
      } catch {
        // ignore — use defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFileUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2 MB.');
      return;
    }
    setUploadingKey(key);
    setError('');
    try {
      const url = await uploadImage(file, 'site');
      if (url) {
        setImages((prev) => ({ ...prev, [key]: url }));
        setSaved(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await saveSiteSettings(
        images.logo || null,
        images.logo_light || null,
        images.favicon || null,
      );
      setOriginalUrls({
        logo: images.logo || null,
        logo_light: images.logo_light || null,
        favicon: images.favicon || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-charcoal-400 text-center py-16">Cargando configuración...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Configuración del Sitio</h1>
        <p className="text-charcoal-500 mt-1">Sube el logo (claro y oscuro) y el favicon que aparecen en la página.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {imageConfigs.map((config) => (
          <div key={config.key} className="admin-card p-6">
            <h3 className="text-base font-bold text-charcoal-900 mb-1">{config.label}</h3>
            <p className="text-charcoal-500 text-sm mb-4">{config.description}</p>

            <div className="mb-4">
              <div
                className={`flex items-center justify-center overflow-hidden ${config.previewBg}`}
                style={{ height: config.previewHeight + 24, minWidth: 200 }}
              >
                <img
                  src={images[config.key] || config.placeholder}
                  alt={config.label}
                  style={{ height: config.previewHeight, width: 'auto', maxWidth: 200 }}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="bg-charcoal-50 border border-dashed border-charcoal-300 px-4 py-3 mb-3">
              <p className="text-charcoal-400 text-xs font-medium">
                Medidas: {config.dimensions}
              </p>
              <p className="text-charcoal-400 text-xs">
                Formato: {config.formats}
              </p>
            </div>
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/png,image/svg+xml,image/jpeg"
                onChange={(e) => handleFileUpload(config.key, e)}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 border border-charcoal-200 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors">
                <Upload className="w-4 h-4" strokeWidth={1.5} />
                {uploadingKey === config.key ? 'Subiendo...' : 'Subir imagen'}
              </div>
            </label>

            {images[config.key] && images[config.key] !== originalUrls[config.key] && (
              <p className="text-amber-600 text-xs flex items-center gap-1.5 mt-3">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                Imagen cargada (guarda para aplicar los cambios)
              </p>
            )}
            {originalUrls[config.key] && images[config.key] === originalUrls[config.key] && (
              <p className="text-green-600 text-xs flex items-center gap-1.5 mt-3">
                <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                Imagen guardada en el servidor
              </p>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          {error}
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50">
        {saved ? (
          <span className="inline-flex items-center gap-2">
            <Check className="w-4 h-4" strokeWidth={1.5} />
            Guardado
          </span>
        ) : saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}

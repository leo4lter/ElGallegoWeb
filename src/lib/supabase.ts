import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { safeStorage } from './storage';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  gallery_images?: string[];
  location?: string;
  client?: string;
  year?: string;
  scope?: string;
  created_at?: string;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string;
  created_at?: string;
};

export type Equipment = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at?: string;
};

export const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Construcción de Vivienda',
    description: 'Construcción de vivienda familiar con cimientos, estructura y terminaciones completas.',
    image_url: 'https://images.pexels.com/photos/8961343/pexels-photo-8961343.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Infraestructura Urbana',
    gallery_images: [
      'https://images.pexels.com/photos/8961343/pexels-photo-8961343.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/8961062/pexels-photo-8961062.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/8961070/pexels-photo-8961070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Sierra Grande, Río Negro',
    client: 'Privado',
    year: '2023',
    scope: 'Construcción de vivienda de 120 m² con cimientos, mampostería, techo y terminaciones.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Remodelación de Espacio Comercial',
    description: 'Remodelación integral de local comercial con pintura, pisos y electricidad.',
    image_url: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Infraestructura Urbana',
    gallery_images: [
      'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/8961086/pexels-photo-8961086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Sierra Grande, Río Negro',
    client: 'Comercio local',
    year: '2023',
    scope: 'Remodelación integral de 80 m²: pintura, pisos, electricidad y terminaciones.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Pintura de Edificio Público',
    description: 'Pintura exterior e interior de edificio público municipal.',
    image_url: 'https://images.pexels.com/photos/5690811/pexels-photo-5690811.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Obras Viales',
    gallery_images: [
      'https://images.pexels.com/photos/5690811/pexels-photo-5690811.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/5690809/pexels-photo-5690809.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Sierra Grande, Río Negro',
    client: 'Municipalidad de Sierra Grande',
    year: '2022',
    scope: 'Pintura exterior e interior de 300 m² con preparación de superficies.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: '4',
    title: 'Transporte de Materiales',
    description: 'Servicio de camiones para transporte de materiales de construcción.',
    image_url: 'https://images.pexels.com/photos/15071423/pexels-photo-15071423.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Movimiento de Suelos',
    gallery_images: [
      'https://images.pexels.com/photos/15071423/pexels-photo-15071423.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/35846752/pexels-photo-35846752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Sierra Grande, Río Negro',
    client: 'Varios',
    year: '2024',
    scope: 'Transporte de áridos, materiales y maquinaria con flota de camiones propia.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '5',
    title: 'Movimiento de Suelo Urbano',
    description: 'Excavación, relleno y nivelación de terreno para obra civil.',
    image_url: 'https://images.pexels.com/photos/30751525/pexels-photo-30751525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Movimiento de Suelos',
    gallery_images: [
      'https://images.pexels.com/photos/30751525/pexels-photo-30751525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/37733178/pexels-photo-37733178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Sierra Grande, Río Negro',
    client: 'Privado',
    year: '2024',
    scope: 'Excavación y relleno de 500 m³ con maquinaria pesada propia.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: '6',
    title: 'Construcción de Platea',
    description: 'Platea de hormigón para construcción residencial.',
    image_url: 'https://images.pexels.com/photos/36606410/pexels-photo-36606410.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Obras Hidráulicas',
    gallery_images: [
      'https://images.pexels.com/photos/36606410/pexels-photo-36606410.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/37733178/pexels-photo-37733178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Sierra Grande, Río Negro',
    client: 'Privado',
    year: '2023',
    scope: 'Platea de hormigón armado de 100 m² con armadura y curado.',
    created_at: new Date().toISOString(),
  },
];

export const initialClients: Client[] = [
  {
    id: '1',
    name: 'Municipalidad de Sierra Grande',
    logo_url: 'https://images.pexels.com/photos/8961146/pexels-photo-8961146.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Vialidad Provincial',
    logo_url: 'https://images.pexels.com/photos/544971/pexels-photo-544971.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Cámara de Construcción',
    logo_url: 'https://images.pexels.com/photos/8482546/pexels-photo-8482546.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Desarrollos Playas Doradas',
    logo_url: 'https://images.pexels.com/photos/8482551/pexels-photo-8482551.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    created_at: new Date().toISOString(),
  },
];

export const initialEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Excavadora Hidráulica',
    description: 'Equipo pesado para movimiento de suelo y excavación de gran escala.',
    image_url: 'https://images.pexels.com/photos/15071423/pexels-photo-15071423.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Retroexcavadora',
    description: 'Maquinaria versátil para obras civiles, mantenimiento y refacciones.',
    image_url: 'https://images.pexels.com/photos/35846752/pexels-photo-35846752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Excavadora Urbana',
    description: 'Equipo compacto para trabajos en zonas urbanas con espacio reducido.',
    image_url: 'https://images.pexels.com/photos/30751525/pexels-photo-30751525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    created_at: new Date().toISOString(),
  },
];

type BaseRecord = {
  id?: string;
  created_at?: string;
  [key: string]: unknown;
};

// Helper to access in-memory / localStorage store
function getLocalTable(table: string): BaseRecord[] {
  try {
    const raw = safeStorage.getItem(`constructora_${table}`);
    if (raw) {
      return JSON.parse(raw) as BaseRecord[];
    }
  } catch {
    // fallback
  }

  let defaults: BaseRecord[] = [];
  if (table === 'projects') defaults = initialProjects;
  else if (table === 'clients') defaults = initialClients;
  else if (table === 'equipment') defaults = initialEquipment;

  try {
    safeStorage.setItem(`constructora_${table}`, JSON.stringify(defaults));
  } catch {
    // ignore
  }
  return [...defaults];
}

function setLocalTable(table: string, items: BaseRecord[]) {
  try {
    safeStorage.setItem(`constructora_${table}`, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function createLocalMock() {
  return {
    from: (table: string) => ({
      select: () => ({
        order: (_col?: string, options?: { ascending?: boolean }) => {
          const items = getLocalTable(table);
          if (options?.ascending) {
            items.sort((a, b) => (String(a.created_at || '') > String(b.created_at || '') ? 1 : -1));
          } else {
            items.sort((a, b) => (String(a.created_at || '') < String(b.created_at || '') ? 1 : -1));
          }
          return Promise.resolve({ data: items, error: null });
        },
      }),
      insert: (rows: BaseRecord[]) => {
        const existing = getLocalTable(table);
        const newRows = rows.map((r) => ({
          ...r,
          id: r.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
          created_at: r.created_at || new Date().toISOString(),
        }));
        const updated = [...newRows, ...existing];
        setLocalTable(table, updated);
        return Promise.resolve({ data: newRows, error: null });
      },
      update: (updates: Partial<BaseRecord>) => ({
        eq: (column: string, value: unknown) => {
          const existing = getLocalTable(table);
          const updated = existing.map((item) => (item[column] === value ? { ...item, ...updates } : item));
          setLocalTable(table, updated);
          return Promise.resolve({ data: updated, error: null });
        },
      }),
      delete: () => ({
        eq: (column: string, value: unknown) => {
          const existing = getLocalTable(table);
          const updated = existing.filter((item) => item[column] !== value);
          setLocalTable(table, updated);
          return Promise.resolve({ data: updated, error: null });
        },
      }),
    }),
  };
}

let realClient: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    realClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[AI Studio] Supabase client initialization failed, using local mock store:', err);
  }
}

const localMock = createLocalMock();

export const supabase = {
  from: (table: string) => {
    if (!realClient) {
      return localMock.from(table);
    }

    return {
      select: (fields?: string) => ({
        order: async (col: string, options?: { ascending?: boolean }) => {
          try {
            const res = await realClient!.from(table).select(fields).order(col, options);
            if (res.error) {
              console.warn(`[AI Studio] Supabase error on ${table}.select, using local fallback:`, res.error);
              return localMock.from(table).select().order(col, options);
            }
            return res;
          } catch (e) {
            console.warn(`[AI Studio] Failed to fetch from Supabase table ${table}, using local fallback:`, e);
            return localMock.from(table).select().order(col, options);
          }
        },
      }),
      insert: async (rows: BaseRecord[]) => {
        try {
          const res = await realClient!.from(table).insert(rows);
          if (res.error) {
            console.warn(`[AI Studio] Supabase error on ${table}.insert, using local fallback:`, res.error);
            return localMock.from(table).insert(rows);
          }
          return res;
        } catch (e) {
          console.warn(`[AI Studio] Failed to insert to Supabase table ${table}, using local fallback:`, e);
          return localMock.from(table).insert(rows);
        }
      },
      update: (updates: Partial<BaseRecord>) => ({
        eq: async (col: string, val: unknown) => {
          try {
            const res = await realClient!.from(table).update(updates).eq(col, val);
            if (res.error) {
              console.warn(`[AI Studio] Supabase error on ${table}.update, using local fallback:`, res.error);
              return localMock.from(table).update(updates).eq(col, val);
            }
            return res;
          } catch (e) {
            console.warn(`[AI Studio] Failed to update in Supabase table ${table}, using local fallback:`, e);
            return localMock.from(table).update(updates).eq(col, val);
          }
        },
      }),
      delete: () => ({
        eq: async (col: string, val: unknown) => {
          try {
            const res = await realClient!.from(table).delete().eq(col, val);
            if (res.error) {
              console.warn(`[AI Studio] Supabase error on ${table}.delete, using local fallback:`, res.error);
              return localMock.from(table).delete().eq(col, val);
            }
            return res;
          } catch (e) {
            console.warn(`[AI Studio] Failed to delete in Supabase table ${table}, using local fallback:`, e);
            return localMock.from(table).delete().eq(col, val);
          }
        },
      }),
    };
  },
};

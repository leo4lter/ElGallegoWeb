import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase, type Project, type Client, type Equipment, type TeamMember } from '@/lib/supabase';

type DataContextType = {
  projects: Project[];
  clients: Client[];
  equipment: Equipment[];
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  refreshClients: () => Promise<void>;
  refreshEquipment: () => Promise<void>;
  refreshTeamMembers: () => Promise<void>;
  addProject: (p: Omit<Project, 'id' | 'created_at'>) => Promise<void>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addClient: (c: Omit<Client, 'id' | 'created_at'>) => Promise<void>;
  updateClient: (id: string, c: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addEquipment: (e: Omit<Equipment, 'id' | 'created_at'>) => Promise<void>;
  updateEquipment: (id: string, e: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  addTeamMember: (m: Omit<TeamMember, 'id' | 'created_at'>) => Promise<void>;
  updateTeamMember: (id: string, m: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      setError(null);
      setProjects(data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch projects:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      setError(null);
      setClients(data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch clients:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    }
  }, []);

  const fetchEquipment = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      setError(null);
      setEquipment(data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch equipment:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar equipamiento');
    }
  }, []);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) {
        setError(error.message);
        return;
      }
      setError(null);
      setTeamMembers(data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch team members:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar equipo');
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Promise.all([fetchProjects(), fetchClients(), fetchEquipment(), fetchTeamMembers()]);
      } catch (err) {
        console.error('Initial data load error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProjects, fetchClients, fetchEquipment, fetchTeamMembers]);

  const addProject = useCallback(async (p: Omit<Project, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('projects').insert([p]);
    if (error) throw error;
    await fetchProjects();
  }, [fetchProjects]);

  const updateProject = useCallback(async (id: string, p: Partial<Project>) => {
    const { error } = await supabase.from('projects').update(p).eq('id', id);
    if (error) throw error;
    await fetchProjects();
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    await fetchProjects();
  }, [fetchProjects]);

  const addClient = useCallback(async (c: Omit<Client, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('clients').insert([c]);
    if (error) throw error;
    await fetchClients();
  }, [fetchClients]);

  const updateClient = useCallback(async (id: string, c: Partial<Client>) => {
    const { error } = await supabase.from('clients').update(c).eq('id', id);
    if (error) throw error;
    await fetchClients();
  }, [fetchClients]);

  const deleteClient = useCallback(async (id: string) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    await fetchClients();
  }, [fetchClients]);

  const addEquipment = useCallback(async (e: Omit<Equipment, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('equipment').insert([e]);
    if (error) throw error;
    await fetchEquipment();
  }, [fetchEquipment]);

  const updateEquipment = useCallback(async (id: string, e: Partial<Equipment>) => {
    const { error } = await supabase.from('equipment').update(e).eq('id', id);
    if (error) throw error;
    await fetchEquipment();
  }, [fetchEquipment]);

  const deleteEquipment = useCallback(async (id: string) => {
    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (error) throw error;
    await fetchEquipment();
  }, [fetchEquipment]);

  const addTeamMember = useCallback(async (m: Omit<TeamMember, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('team_members').insert([m]);
    if (error) throw error;
    await fetchTeamMembers();
  }, [fetchTeamMembers]);

  const updateTeamMember = useCallback(async (id: string, m: Partial<TeamMember>) => {
    const { error } = await supabase.from('team_members').update(m).eq('id', id);
    if (error) throw error;
    await fetchTeamMembers();
  }, [fetchTeamMembers]);

  const deleteTeamMember = useCallback(async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
    await fetchTeamMembers();
  }, [fetchTeamMembers]);

  return (
    <DataContext.Provider
      value={{
        projects,
        clients,
        equipment,
        teamMembers,
        loading,
        error,
        refreshProjects: fetchProjects,
        refreshClients: fetchClients,
        refreshEquipment: fetchEquipment,
        refreshTeamMembers: fetchTeamMembers,
        addProject,
        updateProject,
        deleteProject,
        addClient,
        updateClient,
        deleteClient,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

import { useEffect, useState } from 'react';
import { getSiteSettings, type SiteSettings } from '@/lib/supabase';

export function useSiteSettings(): SiteSettings & { loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings>({
    logo_url: null,
    logo_light_url: null,
    favicon_url: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSiteSettings();
        setSettings(s);
        if (s.favicon_url) {
          const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
          if (link) link.href = `${s.favicon_url}?v=${Date.now()}`;
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { ...settings, loading };
}

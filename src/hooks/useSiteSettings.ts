import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/lib/supabase';

type Settings = {
  logoUrl: string | null;
  faviconUrl: string | null;
};

export function useSiteSettings(): Settings & { loading: boolean } {
  const [settings, setSettings] = useState<Settings>({
    logoUrl: null,
    faviconUrl: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSiteSettings();
        setSettings({ logoUrl: s.logo_url, faviconUrl: s.favicon_url });
        if (s.favicon_url) {
          const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
          if (link) link.href = s.favicon_url;
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

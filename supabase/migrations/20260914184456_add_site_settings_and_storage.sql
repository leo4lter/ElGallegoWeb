/*
# Add site_settings table and storage bucket for image uploads

1. New Tables
- `site_settings`: Stores site-wide configuration (logo URL, favicon URL).
  - `id` (int, primary key, always 1 — singleton row)
  - `logo_url` (text): URL of the site logo in the navbar/footer
  - `favicon_url` (text): URL of the favicon shown in browser tabs
  - `updated_at` (timestamptz): last modification timestamp

2. Security
- Enable RLS on `site_settings`.
- This is a single-tenant app with client-side admin (no Supabase auth session).
- All CRUD operations use the anon key, so policies allow anon + authenticated full access.

3. Storage
- Create a public storage bucket `site-images` for uploading logos, favicons, project images, and client logos.
- Public read access; writes allowed via anon key (client-side admin gate).

4. Important Notes
- The site_settings table has a single singleton row (id=1) created on migration.
- Storage bucket is public so images can be displayed without signed URLs.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  logo_url text,
  favicon_url text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_check CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_site_settings" ON site_settings;
CREATE POLICY "anon_insert_site_settings" ON site_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;
CREATE POLICY "anon_update_site_settings" ON site_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO site_settings (id, logo_url, favicon_url) VALUES (1, NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

-- Create the storage bucket for images (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow anon + authenticated to read and write objects
DROP POLICY IF EXISTS "anon_read_site_images" ON storage.objects;
CREATE POLICY "anon_read_site_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "anon_insert_site_images" ON storage.objects;
CREATE POLICY "anon_insert_site_images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "anon_update_site_images" ON storage.objects;
CREATE POLICY "anon_update_site_images" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'site-images') WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "anon_delete_site_images" ON storage.objects;
CREATE POLICY "anon_delete_site_images" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'site-images');

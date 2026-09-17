/*
# Create team_members table

1. New Tables
- `team_members`: Stores team member profiles for the "Nuestro Equipo" section.
  - `id` (uuid, primary key)
  - `name` (text, not null) — full name of the team member
  - `role` (text, not null) — job title (e.g. "Arquitecto", "Responsable Operativo")
  - `bio` (text) — short biography/description
  - `image_url` (text) — portrait photo URL
  - `display_order` (int, default 0) — controls the order members appear on the site
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `team_members`.
- Single-tenant app with client-side admin (no Supabase auth session).
- All CRUD operations use the anon key, so policies allow anon + authenticated full access.
- Same pattern as existing tables (projects, clients, equipment).

3. Storage
- Uses the existing `site-images` bucket for uploading member photos.
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_team_members" ON team_members;
CREATE POLICY "anon_select_team_members" ON team_members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_team_members" ON team_members;
CREATE POLICY "anon_insert_team_members" ON team_members FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_team_members" ON team_members;
CREATE POLICY "anon_update_team_members" ON team_members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_team_members" ON team_members;
CREATE POLICY "anon_delete_team_members" ON team_members FOR DELETE
  TO anon, authenticated USING (true);

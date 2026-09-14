/*
# Add logo_light_url column for light variant of the site logo

1. Modified Tables
- `site_settings`: Added `logo_light_url` (text) column
  - Stores the light/white variant of the logo for display on transparent (dark) headers
  - The existing `logo_url` stores the dark/original variant for white/scrolled headers

2. Security
- No changes to RLS policies. Existing anon/authenticated CRUD policies cover the new column.

3. Important Notes
- Uses IF NOT EXISTS to safely add the column without losing data.
- The new column is nullable so existing rows remain valid.
*/

DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS logo_light_url text;
END $$;

/*
# Add project details and gallery images

1. Modified Tables
- `projects`: Added columns for richer project information
  - `gallery_images` (text[]): Multiple images per project for a gallery view
  - `location` (text): Where the project was executed
  - `client` (text): Who commissioned the project
  - `year` (text): Year of completion or execution
  - `scope` (text): Scope of work / technical summary

2. Security
- No changes to RLS policies. Existing anon/authenticated CRUD policies remain in place.
- All new columns are nullable so existing rows remain valid.

3. Important Notes
- Uses IF NOT EXISTS via DO $$ blocks to safely add columns without losing data.
- Existing seed data is not modified; new columns default to NULL.
- The gallery_images column is a text array to store multiple image URLs per project.
*/

DO $$ BEGIN
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}';
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS location text;
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS client text;
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS year text;
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS scope text;
END $$;
const { Client } = require('pg');

async function run() {
  const connectionString = 'postgresql://postgres:VYFsH9weDK7T6!e@db.pxutpkhvkoiqfswypiki.supabase.co:5432/postgres';
  const client = new Client({ connectionString });

  try {
    await client.connect();
    
    // Add column
    await client.query(`
      ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS profile_avatar TEXT;
    `);
    
    // Create bucket and policies
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('avatars', 'avatars', true)
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      CREATE POLICY "Avatar images are publicly accessible." 
      ON storage.objects FOR SELECT 
      USING (bucket_id = 'avatars');
    `).catch(() => {}); // ignore if exists

    await client.query(`
      CREATE POLICY "Anyone can upload an avatar." 
      ON storage.objects FOR INSERT 
      WITH CHECK (bucket_id = 'avatars');
    `).catch(() => {});

    console.log('Avatar schema applied successfully!');
  } catch (err) {
    console.error('Error applying avatar schema:', err);
  } finally {
    await client.end();
  }
}

run();

const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const connectionString = 'postgresql://postgres:VYFsH9weDK7T6!e@db.pxutpkhvkoiqfswypiki.supabase.co:5432/postgres';
  
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to database.');
    
    const schemaSql = fs.readFileSync('schema.sql', 'utf8');
    
    console.log('Executing schema.sql...');
    await client.query(schemaSql);
    
    console.log('Schema executed successfully!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

run();

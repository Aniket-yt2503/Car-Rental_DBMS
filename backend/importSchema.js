/**
 * One-time script: imports schema_railway.sql into Railway MySQL
 * Run from the backend folder: node importSchema.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

async function main() {
  console.log('Connecting to Railway MySQL...');
  console.log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`  DB:   ${process.env.DB_NAME}`);

  const connection = await mysql.createConnection({
    host:               process.env.DB_HOST,
    port:               parseInt(process.env.DB_PORT) || 3306,
    user:               process.env.DB_USER,
    password:           process.env.DB_PASSWORD,
    database:           process.env.DB_NAME,
    multipleStatements: true,          // required to run the whole file at once
    ssl:                { rejectUnauthorized: false },
  });

  console.log('✅ Connected!\n');

  // Read the Railway-compatible schema file
  const schemaPath = path.join(__dirname, '..', 'schema_railway.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  // Split on semicolons, skip empty/comment-only lines
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Running ${statements.length} SQL statements...\n`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
    try {
      await connection.query(stmt);
      console.log(`  [${i + 1}/${statements.length}] ✅  ${preview}...`);
    } catch (err) {
      // Ignore "already exists" errors so re-running is safe
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_ENTRY') {
        console.log(`  [${i + 1}/${statements.length}] ⚠️  Already exists (skipped): ${preview}...`);
      } else {
        console.error(`  [${i + 1}/${statements.length}] ❌  FAILED: ${preview}`);
        console.error(`     Error: ${err.message}\n`);
      }
    }
  }

  await connection.end();
  console.log('\n🎉 Schema import complete! Run: SHOW TABLES; to verify.');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

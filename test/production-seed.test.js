const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const databaseFile = path.join(os.tmpdir(), `horacerta-production-${process.pid}.sqlite`);
process.env.DATABASE_FILE = databaseFile;
process.env.NODE_ENV = 'production';
process.env.SEED_DEMO_USERS = 'false';
process.env.BOOTSTRAP_ADMIN_EMAIL = 'admin@example.test';
process.env.BOOTSTRAP_ADMIN_PASSWORD = 'Production-password-123!';

const database = require('../database');

test('production seeds the bootstrap admin without demo calendar data', async () => {
  await database.initializeDatabase();

  const admin = await database.get('SELECT email, papel FROM perfis');
  assert.deepEqual(admin, { email: 'admin@example.test', papel: 'admin' });
  assert.equal(await database.get('SELECT id FROM eventos LIMIT 1'), undefined);
  assert.equal(await database.get('SELECT id FROM avisos LIMIT 1'), undefined);
});

after(async () => {
  await database.close();
  for (const suffix of ['', '-shm', '-wal']) {
    const file = `${databaseFile}${suffix}`;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
});

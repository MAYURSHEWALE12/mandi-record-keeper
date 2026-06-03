const createApp = require('./app');
const supabase = require('./db');
const bcrypt = require('bcryptjs');

let seeded = false;

async function seedAdmin() {
  if (seeded) return;
  seeded = true;

  const { data: existing } = await supabase
    .from('admins')
    .select('*')
    .eq('email', process.env.ADMIN_EMAIL || 'admin@example.com')
    .single();

  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    await supabase.from('admins').insert({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashed,
      name: 'Admin',
    });
  }
}

const app = createApp();

module.exports = async (req, res) => {
  await seedAdmin();
  return app(req, res);
};

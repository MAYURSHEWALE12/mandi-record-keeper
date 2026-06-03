const createApp = require('./app');
const supabase = require('./db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', process.env.ADMIN_EMAIL || 'admin@example.com')
      .limit(1);

    if (error) { console.error('Seed check error:', error); return; }

    if (!data || data.length === 0) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      await supabase.from('admins').insert({
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: hashed,
        name: 'Admin',
      });
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seedAdmin();

const app = createApp();

module.exports = app;

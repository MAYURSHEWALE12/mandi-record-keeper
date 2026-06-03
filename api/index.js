const createApp = require('./app');
const supabase = require('./db');
const bcrypt = require('bcryptjs');

let seeded = false;

const app = createApp();

app.use(async (req, res, next) => {
  if (!seeded && req.path.startsWith('/api')) {
    seeded = true;
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', process.env.ADMIN_EMAIL || 'admin@example.com')
        .limit(1);

      if (error) { console.error('Seed check error:', error); return next(); }

      if (!data || data.length === 0) {
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
        const { error: insertError } = await supabase.from('admins').insert({
          email: process.env.ADMIN_EMAIL || 'admin@example.com',
          password: hashed,
          name: 'Admin',
        });
        if (insertError) console.error('Seed insert error:', insertError);
      }
    } catch (err) {
      console.error('Seed error:', err);
    }
  }
  next();
});

module.exports = app;

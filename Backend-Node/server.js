require('dotenv').config({ path: __dirname + '/.env' });
const createApp = require('../api/app');
const supabase = require('../api/db');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 8000;

const app = createApp();

(async () => {
  try {
    const { data: existing } = await supabase
      .from('admins')
      .select('*')
      .eq('email', process.env.ADMIN_EMAIL)
      .single();

    if (!existing) {
      if (!process.env.ADMIN_PASSWORD) {
        console.error('ADMIN_PASSWORD environment variable is required');
        process.exit(1);
      }
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await supabase.from('admins').insert({
        email: process.env.ADMIN_EMAIL,
        password: hashed,
        name: 'Admin',
      });
      console.log('Default admin seeded');
    }

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
})();

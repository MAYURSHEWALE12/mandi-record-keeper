require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const createApp = require('../api/app');
const Admin = require('../api/models/Admin');

const PORT = process.env.PORT || 8000;

const app = createApp();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@example.com' });
    if (!exists) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        name: 'Admin',
      });
      console.log('Default admin seeded');
    }
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

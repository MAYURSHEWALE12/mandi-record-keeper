const mongoose = require('mongoose');
const createApp = require('./app');
const Admin = require('./models/Admin');

let connected = false;

async function connectDB() {
  if (connected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  connected = true;

  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@example.com' });
  if (!exists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin',
    });
  }
}

const app = createApp();

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};

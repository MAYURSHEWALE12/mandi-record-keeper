const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const authCtrl = require('./controllers/authController');
const recordCtrl = require('./controllers/recordController');
const orderCtrl = require('./controllers/dealerOrderController');

module.exports = function createApp() {
  const app = express();

  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://mandi-record-keeper.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }));
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Trambkaraj Traders API', version: '1.0.0' }));

  // Auth (no middleware)
  app.post('/api/admin/login', authCtrl.login);
  app.post('/api/admin/forgot-password', authCtrl.forgotPassword);
  app.post('/api/admin/reset-password/:token', authCtrl.resetPassword);

  // Protected routes
  app.get('/api/records', auth, recordCtrl.index);
  app.post('/api/add-record', auth, recordCtrl.store);
  app.put('/api/update-record/:id', auth, recordCtrl.update);

  app.get('/api/dealer-orders', auth, orderCtrl.index);
  app.post('/api/dealer-orders', auth, orderCtrl.store);
  app.get('/api/dealer-orders/:id', auth, orderCtrl.show);
  app.post('/api/dealer-orders/:id/dispatch', auth, orderCtrl.storeDispatch);
  app.delete('/api/dealer-dispatches/:id', auth, orderCtrl.destroyDispatch);

  return app;
};

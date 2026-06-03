const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  dispatchDate: { type: Date, default: Date.now },
  note: { type: String, default: '' },
}, { _id: true });

const dealerOrderSchema = new mongoose.Schema({
  dealerName: { type: String, required: true },
  dealerPhone: { type: String, default: '' },
  orderDate: { type: Date, default: Date.now },
  expectedDelivery: { type: Date },
  status: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
  dispatches: [dispatchSchema],
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

dealerOrderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('DealerOrder', dealerOrderSchema);

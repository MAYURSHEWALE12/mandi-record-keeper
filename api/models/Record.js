const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  note: { type: String, default: '' },
}, { _id: true });

const recordSchema = new mongoose.Schema({
  billNo: { type: Number, required: true, unique: true },
  farmerName: { type: String, required: true },
  farmerNumber: { type: String, default: '' },
  commodity: [{ type: String }],
  weight: { type: Number, default: 0 },
  weightDetails: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  payments: [paymentSchema],
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

recordSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Record', recordSchema);

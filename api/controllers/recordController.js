const Record = require('../models/Record');
const Counter = require('../models/Counter');

exports.index = async (req, res) => {
  try {
    const records = await Record.find().sort({ billNo: -1 });
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.store = async (req, res) => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'billNo' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const data = { ...req.body, billNo: counter.seq };
    if (!data.farmerName || !data.totalAmount)
      return res.status(400).json({ error: 'farmerName and totalAmount are required' });

    const paid = Number(data.paidAmount) || 0;
    const total = Number(data.totalAmount);
    data.paidAmount = paid;
    data.dueAmount = total - paid;
    data.paymentStatus = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';

    if (paid > 0) {
      data.payments = [{ paymentDate: new Date(), amount: paid, note: 'Initial payment' }];
    }

    const record = await Record.create(data);
    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await Record.findById(id);
    if (!existing) return res.status(404).json({ error: 'Record not found' });

    const total = Number(data.totalAmount) || existing.totalAmount;
    let paid = Number(data.paidAmount);
    if (isNaN(paid)) paid = existing.paidAmount;

    if (data.newPayment && Number(data.newPayment) > 0) {
      existing.payments.push({
        paymentDate: new Date(),
        amount: Number(data.newPayment),
        note: data.paymentNote || '',
      });
      paid = existing.payments.reduce((s, p) => s + p.amount, 0);
      data.payments = existing.payments;
    }

    data.paidAmount = paid;
    data.dueAmount = total - paid;
    data.paymentStatus = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';

    delete data.newPayment;
    delete data.paymentNote;

    const record = await Record.findByIdAndUpdate(id, data, { new: true });
    res.json(record);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

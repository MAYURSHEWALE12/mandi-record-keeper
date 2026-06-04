const supabase = require('../db');

const toCamel = (r) => {
  if (!r) return null;

  let cropVal = "";
  if (r.commodity) {
    if (typeof r.commodity === "string") {
      try {
        const parsed = JSON.parse(r.commodity);
        cropVal = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch (e) {
        cropVal = r.commodity;
      }
    } else if (Array.isArray(r.commodity)) {
      cropVal = r.commodity[0];
    } else {
      cropVal = String(r.commodity);
    }
  }

  let rateVal = 0;
  if (r.weight_details) {
    const num = Number(r.weight_details);
    if (!isNaN(num)) {
      rateVal = num;
    }
  }

  return {
    id: r.id,
    billNo: r.bill_no,
    farmerName: r.farmer_name,
    farmerNumber: r.farmer_number,
    mobile: r.farmer_number || "",
    commodity: r.commodity,
    crop: cropVal || "",
    weight: r.weight,
    quantity: r.weight || 0,
    weightDetails: r.weight_details,
    rate: rateVal || 0,
    totalAmount: r.total_amount,
    paidAmount: r.paid_amount,
    dueAmount: r.due_amount,
    paymentStatus: r.payment_status,
    payments: r.payments,
    date: r.date,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

const toSnake = (d) => ({
  bill_no: d.billNo,
  farmer_name: d.farmerName,
  farmer_number: d.farmerNumber || d.mobile || '',
  commodity: d.commodity || (d.crop ? JSON.stringify([d.crop]) : '[]'),
  weight: d.weight || d.quantity || 0,
  weight_details: d.weightDetails || (d.rate !== undefined ? String(d.rate) : ''),
  total_amount: Number(d.totalAmount),
  paid_amount: Number(d.paidAmount) || 0,
  due_amount: Number(d.dueAmount) || 0,
  payment_status: d.paymentStatus || 'unpaid',
  payments: d.payments || [],
  date: d.date || new Date().toISOString().split('T')[0],
});

exports.index = async (req, res) => {
  try {
    const { data, error } = await supabase.from('records').select('*').order('bill_no', { ascending: false });
    if (error) throw error;
    res.json(data.map(toCamel));
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.store = async (req, res) => {
  try {
    const { data: c } = await supabase.from('bill_counters').select('seq').single();
    const billNo = (c?.seq || 1000) + 1;
    await supabase.from('bill_counters').update({ seq: billNo }).eq('id', 1);

    if (!req.body.farmerName || !req.body.totalAmount)
      return res.status(400).json({ error: 'farmerName and totalAmount are required' });

    const paid = Number(req.body.paidAmount) || 0;
    const total = Number(req.body.totalAmount);
    const payments = paid > 0 ? [{ paymentDate: new Date().toISOString(), amount: paid, note: 'Initial payment' }] : [];
    const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';

    const recordData = {
      bill_no: billNo,
      farmer_name: req.body.farmerName,
      farmer_number: req.body.farmerNumber || req.body.mobile || '',
      commodity: req.body.commodity || (req.body.crop ? JSON.stringify([req.body.crop]) : '[]'),
      weight: req.body.weight || req.body.quantity || 0,
      weight_details: req.body.weightDetails || (req.body.rate !== undefined ? String(req.body.rate) : ''),
      total_amount: total,
      paid_amount: paid,
      due_amount: total - paid,
      payment_status: status,
      payments: payments,
      date: req.body.date || new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase.from('records').insert(recordData).select().single();
    if (error) throw error;

    res.status(201).json(toCamel(data));
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: findError } = await supabase.from('records').select('*').eq('id', id).single();
    if (findError || !existing) return res.status(404).json({ error: 'Record not found' });

    const total = Number(req.body.totalAmount) || existing.total_amount;
    let paid = Number(req.body.paidAmount);
    if (isNaN(paid)) paid = existing.paid_amount;

    let payments = existing.payments || [];
    if (req.body.newPayment && Number(req.body.newPayment) > 0) {
      payments = [...payments, { paymentDate: new Date().toISOString(), amount: Number(req.body.newPayment), note: req.body.paymentNote || '' }];
      paid = payments.reduce((s, p) => s + p.amount, 0);
    }

    const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';

    const updateData = {
      farmer_name: req.body.farmerName || existing.farmer_name,
      farmer_number: req.body.farmerNumber || req.body.mobile || existing.farmer_number,
      commodity: req.body.commodity || (req.body.crop ? JSON.stringify([req.body.crop]) : existing.commodity),
      weight: req.body.weight !== undefined ? req.body.weight : (req.body.quantity !== undefined ? req.body.quantity : existing.weight),
      weight_details: req.body.weightDetails !== undefined ? req.body.weightDetails : (req.body.rate !== undefined ? String(req.body.rate) : existing.weight_details),
      total_amount: total,
      paid_amount: paid,
      due_amount: total - paid,
      payment_status: status,
      payments: payments,
      updated_at: new Date().toISOString(),
    };

    delete req.body.newPayment;
    delete req.body.paymentNote;

    const { data, error } = await supabase.from('records').update(updateData).eq('id', id).select().single();
    if (error) throw error;

    res.json(toCamel(data));
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

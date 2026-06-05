const supabase = require('../db');

const toCamel = (r) => {
  if (!r) return null;
  const dispatches = r.dispatches || [];
  const fulfilledWeight = dispatches.reduce((sum, d) => sum + Number(d.weight || d.quantity || 0), 0);
  return {
    id: r.id,
    poNo: r.po_no,
    dealerName: r.dealer_name,
    dealerPhone: r.dealer_phone,
    place: r.place,
    village: r.village,
    totalOrderedWeight: r.total_ordered_weight || 0,
    fulfilledWeight,
    remainingWeight: Math.max(0, (r.total_ordered_weight || 0) - fulfilledWeight),
    orderDate: r.order_date,
    expectedDelivery: r.expected_delivery,
    status: r.status,
    dispatches,
    payments: r.payments || [],
    note: r.note,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

exports.index = async (req, res) => {
  try {
    const { data, error } = await supabase.from('dealer_orders').select('*').order('order_date', { ascending: false });
    if (error) throw error;

    const crypto = require('crypto');
    let maxBill = 1000;
    for (const r of data) {
      const dispatches = r.dispatches || [];
      for (const d of dispatches) {
        const num = Number(d.billNo || d.bill_no || 0);
        if (num > maxBill) maxBill = num;
      }
    }

    const updatedData = [];
    for (const r of data) {
      let modified = false;
      const dispatches = (r.dispatches || []).map(d => {
        let changed = false;
        if (!d.id && !d._id) {
          d.id = crypto.randomUUID();
          changed = true;
        }
        if (!d.billNo && !d.bill_no) {
          maxBill = maxBill + 1;
          d.billNo = maxBill;
          d.bill_no = maxBill;
          changed = true;
        }
        if (changed) modified = true;
        return d;
      });
      if (modified) {
        await supabase.from('dealer_orders').update({ dispatches }).eq('id', r.id);
        r.dispatches = dispatches;
      }
      updatedData.push(toCamel(r));
    }

    res.json(updatedData);
  } catch (error) {
    console.error('Error fetching dealer orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.show = async (req, res) => {
  try {
    const { data, error } = await supabase.from('dealer_orders').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Order not found' });

    let r = data;
    let modified = false;
    const crypto = require('crypto');

    let maxBill = 1000;
    const { data: allOrders } = await supabase.from('dealer_orders').select('dispatches');
    if (allOrders) {
      for (const o of allOrders) {
        const dispatches = o.dispatches || [];
        for (const d of dispatches) {
          const num = Number(d.billNo || d.bill_no || 0);
          if (num > maxBill) maxBill = num;
        }
      }
    }

    const dispatches = (r.dispatches || []).map(d => {
      let changed = false;
      if (!d.id && !d._id) {
        d.id = crypto.randomUUID();
        changed = true;
      }
      if (!d.billNo && !d.bill_no) {
        maxBill = maxBill + 1;
        d.billNo = maxBill;
        d.bill_no = maxBill;
        changed = true;
      }
      if (changed) modified = true;
      return d;
    });
    if (modified) {
      await supabase.from('dealer_orders').update({ dispatches }).eq('id', r.id);
      r.dispatches = dispatches;
    }

    res.json(toCamel(r));
  } catch (error) {
    console.error('Error fetching dealer order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body.dealerName) return res.status(400).json({ error: 'dealerName is required' });

    const { data, error } = await supabase.from('dealer_orders').insert({
      po_no: req.body.poNo || '',
      dealer_name: req.body.dealerName,
      dealer_phone: req.body.dealerPhone || '',
      place: req.body.place || '',
      village: req.body.village || '',
      total_ordered_weight: Number(req.body.totalOrderedWeight) || 0,
      order_date: req.body.orderDate || new Date().toISOString().split('T')[0],
      expected_delivery: req.body.expectedDelivery || null,
      status: req.body.status || 'pending',
      dispatches: req.body.dispatches || [],
      note: req.body.note || '',
    }).select().single();

    if (error) throw error;
    res.status(201).json(toCamel(data));
  } catch (error) {
    console.error('Error creating dealer order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.storeDispatch = async (req, res) => {
  try {
    const { data: order, error: findError } = await supabase.from('dealer_orders').select('*').eq('id', req.params.id).single();
    if (findError || !order) return res.status(404).json({ error: 'Order not found' });
    
    const inputWeight = Number(req.body.weight || 0);

    // Fetch all farmer records for inward stock
    const { data: records, error: recError } = await supabase.from('records').select('*');
    if (recError) throw recError;
    const totalInward = records.reduce((sum, r) => {
      const isMakka = r.crop === "मका" || (r.commodity && r.commodity.includes("मका"));
      return sum + (isMakka ? Number(r.weight || r.quantity || 0) / 10 : 0);
    }, 0);

    // Fetch all dealer orders for outward dispatched stock
    const { data: allOrders, error: ordersError } = await supabase.from('dealer_orders').select('*');
    if (ordersError) throw ordersError;
    const totalAlreadyDispatched = allOrders.reduce((sum, o) => {
      return sum + (o.dispatches || []).reduce((s, d) => s + Number(d.weight || d.quantity || 0), 0);
    }, 0);

    const physicalStock = Math.max(0, totalInward - totalAlreadyDispatched);
    const existingDispatches = order.dispatches || [];
    const fulfilledWeight = existingDispatches.reduce((sum, d) => sum + Number(d.weight || d.quantity || 0), 0);
    const remaining = Math.max(0, (order.total_ordered_weight || 0) - fulfilledWeight);
    const maxAllowed = Math.min(remaining, physicalStock);

    if (inputWeight > maxAllowed + 0.0001) {
      return res.status(400).json({ error: `Cannot dispatch more than the allowed limit (remaining order weight or available stock) of ${maxAllowed.toFixed(2)} Tons` });
    }

    let finalBillNo = req.body.billNo;
    if (!finalBillNo) {
      let maxBill = 1000;
      const { data: allOrders } = await supabase.from('dealer_orders').select('dispatches');
      if (allOrders) {
        for (const o of allOrders) {
          const dispatches = o.dispatches || [];
          for (const d of dispatches) {
            const num = Number(d.billNo || d.bill_no || 0);
            if (num > maxBill) maxBill = num;
          }
        }
      }
      finalBillNo = maxBill + 1;
    }

    const crypto = require('crypto');
    const newDispatch = {
      id: req.body.id || crypto.randomUUID(),
      ...req.body,
      billNo: finalBillNo,
      bill_no: finalBillNo
    };
    const dispatches = [...existingDispatches, newDispatch];
    const totalFulfilled = dispatches.reduce((s, d) => s + Number(d.weight || d.quantity || 0), 0);
    const newStatus = totalFulfilled >= (order.total_ordered_weight || 0) ? 'fulfilled' : 'partially_fulfilled';

    const { data, error } = await supabase
      .from('dealer_orders')
      .update({ dispatches, status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select().single();

    if (error) throw error;
    res.json(toCamel(data));
  } catch (error) {
    console.error('Error adding dispatch:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.destroyDispatch = async (req, res) => {
  try {
    const dispatchId = req.params.id;

    const { data: orders, error } = await supabase.from('dealer_orders').select('*');
    if (error) throw error;

    let targetOrder = null;
    for (const o of orders) {
      if ((o.dispatches || []).some(d => d.id === dispatchId || d._id === dispatchId)) {
        targetOrder = o;
        break;
      }
    }

    if (!targetOrder) return res.status(404).json({ error: 'Dispatch not found' });

    const updatedDispatches = (targetOrder.dispatches || []).filter(d => d.id !== dispatchId && d._id !== dispatchId);
    const totalFulfilled = updatedDispatches.reduce((s, d) => s + Number(d.weight || d.quantity || 0), 0);
    const newStatus = totalFulfilled >= (targetOrder.total_ordered_weight || 0) ? 'fulfilled' : (totalFulfilled > 0 ? 'partially_fulfilled' : 'pending');

    const { data, error: updateError } = await supabase
      .from('dealer_orders')
      .update({ dispatches: updatedDispatches, status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', targetOrder.id)
      .select().single();

    if (updateError) throw updateError;
    res.json(toCamel(data));
  } catch (error) {
    console.error('Error deleting dispatch:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.destroy = async (req, res) => {
  try {
    const { error } = await supabase.from('dealer_orders').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting dealer order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateDispatch = async (req, res) => {
  try {
    const { orderId, dispatchId } = req.params;
    const { data: order, error: findError } = await supabase.from('dealer_orders').select('*').eq('id', orderId).single();
    if (findError || !order) return res.status(404).json({ error: 'Order not found' });

    const dispatches = (order.dispatches || []).map(d => {
      if (d.id === dispatchId || d._id === dispatchId) {
        return { ...d, ...req.body };
      }
      return d;
    });

    const { data, error } = await supabase
      .from('dealer_orders')
      .update({ dispatches, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select().single();

    if (error) throw error;
    res.json(toCamel(data));
  } catch (error) {
    console.error('Error updating dispatch:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.storePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: order, error: findError } = await supabase.from('dealer_orders').select('*').eq('id', id).single();
    if (findError || !order) return res.status(404).json({ error: 'Order not found' });

    const crypto = require('crypto');
    const newPayment = {
      id: crypto.randomUUID(),
      date: req.body.date || new Date().toISOString().split('T')[0],
      amount: Number(req.body.amount) || 0,
      mode: req.body.mode || 'Bank Transfer',
      refNo: req.body.refNo || '',
      note: req.body.note || ''
    };

    const payments = [...(order.payments || []), newPayment];

    const { data, error } = await supabase
      .from('dealer_orders')
      .update({ payments, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select().single();

    if (error) throw error;
    res.json(toCamel(data));
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.destroyPayment = async (req, res) => {
  try {
    const { orderId, paymentId } = req.params;
    const { data: order, error: findError } = await supabase.from('dealer_orders').select('*').eq('id', orderId).single();
    if (findError || !order) return res.status(404).json({ error: 'Order not found' });

    const payments = (order.payments || []).filter(p => p.id !== paymentId);

    const { data, error } = await supabase
      .from('dealer_orders')
      .update({ payments, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select().single();

    if (error) throw error;
    res.json(toCamel(data));
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

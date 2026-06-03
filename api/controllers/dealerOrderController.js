const supabase = require('../db');

const toCamel = (r) => r ? {
  id: r.id,
  dealerName: r.dealer_name,
  dealerPhone: r.dealer_phone,
  orderDate: r.order_date,
  expectedDelivery: r.expected_delivery,
  status: r.status,
  dispatches: r.dispatches,
  note: r.note,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
} : null;

exports.index = async (req, res) => {
  try {
    const { data, error } = await supabase.from('dealer_orders').select('*').order('order_date', { ascending: false });
    if (error) throw error;
    res.json(data.map(toCamel));
  } catch (error) {
    console.error('Error fetching dealer orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.show = async (req, res) => {
  try {
    const { data, error } = await supabase.from('dealer_orders').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Order not found' });
    res.json(toCamel(data));
  } catch (error) {
    console.error('Error fetching dealer order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body.dealerName) return res.status(400).json({ error: 'dealerName is required' });

    const { data, error } = await supabase.from('dealer_orders').insert({
      dealer_name: req.body.dealerName,
      dealer_phone: req.body.dealerPhone || '',
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
    if (!req.body.itemName || !req.body.quantity)
      return res.status(400).json({ error: 'itemName and quantity are required' });

    const dispatches = [...(order.dispatches || []), req.body];

    const { data, error } = await supabase
      .from('dealer_orders')
      .update({ dispatches, status: 'partial', updated_at: new Date().toISOString() })
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

    const { data, error: updateError } = await supabase
      .from('dealer_orders')
      .update({ dispatches: updatedDispatches, updated_at: new Date().toISOString() })
      .eq('id', targetOrder.id)
      .select().single();

    if (updateError) throw updateError;
    res.json(toCamel(data));
  } catch (error) {
    console.error('Error deleting dispatch:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

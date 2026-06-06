const supabase = require('../api/db');

(async () => {
  try {
    const { data: records, error: err1 } = await supabase.from('records').select('*');
    if (err1) throw err1;
    console.log('FARMER RECORDS COUNT:', records.length);
    records.slice(0, 10).forEach(r => {
      console.log(`- ID: ${r.id}, Weight: ${r.weight}, Commodity: ${JSON.stringify(r.commodity)}`);
    });

    const { data: orders, error: err2 } = await supabase.from('dealer_orders').select('*');
    if (err2) throw err2;
    console.log('\nDEALER ORDERS COUNT:', orders.length);
    orders.forEach(o => {
      console.log(`- Order: ${o.dealer_name}, Status: ${o.status}, Dispatches: ${(o.dispatches || []).length}`);
      (o.dispatches || []).forEach(d => {
        console.log(`  * Dispatch Truck: ${d.truckNo}, Weight: ${d.weight}`);
      });
    });

  } catch (e) {
    console.error(e);
  }
})();

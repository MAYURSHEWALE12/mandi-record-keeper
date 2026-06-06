

(async () => {
  try {
    const loginRes = await fetch('https://mandi-record-keeper.vercel.app/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin' }) // wait, default password might be admin or admin123
    });
    
    let loginData = await loginRes.json();
    if (!loginData.token) {
      console.log('Login with admin/admin failed. Trying admin@example.com/admin123...');
      const loginRes2 = await fetch('https://mandi-record-keeper.vercel.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
      });
      loginData = await loginRes2.json();
    }

    if (!loginData.token) {
      console.error('Login failed completely:', loginData);
      return;
    }

    const token = loginData.token;
    console.log('Login successful! Token retrieved.');

    const stockRes = await fetch('https://mandi-record-keeper.vercel.app/api/dealer-orders/available-stock', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stockData = await stockRes.json();
    console.log('\nLIVE STOCK DATA:', stockData);

    const ordersRes = await fetch('https://mandi-record-keeper.vercel.app/api/dealer-orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const ordersData = await ordersRes.json();
    console.log('\nLIVE DEALER ORDERS:', JSON.stringify(ordersData, null, 2));

  } catch (e) {
    console.error(e);
  }
})();

// Mock API — routes all calls to localStorage via localDb
// Maintains the same interface as the original Axios-based API
// so all page components work unchanged.

import * as db from './localDb';

// Ensure seed data is loaded
db.ensureSeeded();

// --- Cookie helpers for auth ---
function setCookie(name: string, value: string, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// --- Simulate async delay ---
const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

// --- Response helper ---
function ok(data: any) {
  return { data };
}

// --- Route matcher ---
function matchRoute(method: string, url: string): any {
  // Remove leading slash for consistency
  const path = url.startsWith('/') ? url.slice(1) : url;
  
  // Static routes first
  if (method === 'POST' && path === 'auth/login') return handleLogin;
  if (method === 'GET' && path === 'auth/me') return handleMe;
  if (method === 'GET' && path === 'dashboard') return handleDashboard;
  if (method === 'GET' && path === 'clients') return handleGetClients;
  if (method === 'POST' && path === 'clients') return handleCreateClient;
  if (method === 'GET' && path === 'orders') return handleGetOrders;
  if (method === 'POST' && path === 'orders') return handleCreateOrder;
  if (method === 'GET' && path === 'suppliers') return handleGetSuppliers;
  if (method === 'POST' && path === 'suppliers') return handleCreateSupplier;
  if (method === 'GET' && path === 'supplier-orders') return handleGetSupplierOrders;
  if (method === 'POST' && path === 'supplier-orders') return handleCreateSupplierOrder;
  if (method === 'GET' && path === 'materials') return handleGetMaterials;
  if (method === 'POST' && path === 'materials') return handleCreateMaterial;
  if (method === 'GET' && path === 'inventory') return handleGetInventory;
  if (method === 'GET' && path === 'products') return handleGetProducts;
  if (method === 'POST' && path === 'products') return handleCreateProduct;
  if (method === 'GET' && path === 'reports/sales') return handleReportSales;
  if (method === 'GET' && path === 'reports/production') return handleReportProduction;
  if (method === 'GET' && path === 'reports/customers') return handleReportCustomers;
  if (method === 'GET' && path === 'reports/financial') return handleReportFinancial;

  // Dynamic routes with params
  let m: RegExpMatchArray | null;

  m = path.match(/^clients\/(\d+)\/account-statement$/);
  if (m) return (method === 'GET') ? (_: any) => handleClientAccountStatement(parseInt(m![1])) : null;

  m = path.match(/^clients\/(\d+)\/payments$/);
  if (m && method === 'POST') return (body: any) => handleClientPayment(parseInt(m![1]), body);

  m = path.match(/^clients\/(\d+)$/);
  if (m && method === 'GET') return (_: any) => handleGetClient(parseInt(m![1]));
  if (m && method === 'PATCH') return (body: any) => handleUpdateClient(parseInt(m![1]), body);

  m = path.match(/^orders\/(\d+)\/stages$/);
  if (m && method === 'POST') return (body: any) => handleAdvanceStage(parseInt(m![1]), body);

  m = path.match(/^orders\/(\d+)\/printing-steps$/);
  if (m && method === 'PATCH') return (body: any) => handlePrintingSteps(parseInt(m![1]), body);

  m = path.match(/^orders\/(\d+)$/);
  if (m && method === 'GET') return (_: any) => handleGetOrder(parseInt(m![1]));

  m = path.match(/^suppliers\/(\d+)\/account-statement$/);
  if (m && method === 'GET') return (_: any) => handleSupplierAccountStatement(parseInt(m![1]));

  m = path.match(/^suppliers\/(\d+)\/payments$/);
  if (m && method === 'POST') return (body: any) => handleSupplierPayment(parseInt(m![1]), body);

  m = path.match(/^suppliers\/(\d+)$/);
  if (m && method === 'GET') return (_: any) => handleGetSupplier(parseInt(m![1]));

  m = path.match(/^supplier-orders\/(\d+)\/deliver$/);
  if (m && method === 'POST') return (body: any) => handleSupplierOrderDeliver(parseInt(m![1]), body);

  return null;
}

// ============================
// ROUTE HANDLERS
// ============================

function handleLogin(body: any) {
  const { phone, password } = body;
  if (!phone || !password) throw { response: { data: { message: 'يرجى إدخال البيانات' }, status: 400 } };
  const users = db.getAll('users');
  const user = users[0]; // Accept any credentials for demo
  const token = 'demo_token_' + Date.now();
  setCookie('auth_token', token);
  localStorage.setItem('token', token);
  return ok({ access_token: token, user });
}

function handleMe() {
  const token = getCookie('auth_token') || localStorage.getItem('token');
  if (!token) throw { response: { status: 401 } };
  const users = db.getAll('users');
  return ok(users[0]);
}

function handleDashboard() {
  const clients = db.getAll('clients');
  const orders = db.getAll('orders');
  const supplierOrders = db.getAll('supplierOrders');
  const products = db.getAll('products');
  const materials = db.getAll('materials');

  const ordersByStage: Record<string, number> = {};
  for (const o of orders) {
    ordersByStage[o.currentStage] = (ordersByStage[o.currentStage] || 0) + 1;
  }

  const inventoryValue = materials.reduce((sum: number, m: any) => sum + m.currentAmount * m.buyPrice, 0);
  const ordersInProgress = orders.filter((o: any) => o.currentStage !== 'DELIVERY').length;

  const recentOrders = orders
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(db.resolveOrder);

  const recentSupplierOrders = supplierOrders
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(db.resolveSupplierOrder);

  return ok({
    totalClients: clients.length,
    ordersInProgress,
    supplierOrders: supplierOrders.length,
    totalOrders: orders.length,
    inventoryValue,
    products: products.length,
    materials: materials.length,
    ordersByStage,
    recentOrders,
    recentSupplierOrders,
  });
}

// --- Clients ---
function handleGetClients() {
  const clients = db.getAll('clients');
  return ok(clients.map((c: any) => {
    const orderCount = db.getOrdersForClient(c.id).length;
    return { ...c, _count: { orders: orderCount } };
  }));
}

function handleCreateClient(body: any) {
  const newClient = db.create('clients', body);
  return ok(newClient);
}

function handleGetClient(id: number) {
  const client = db.getById('clients', id);
  if (!client) throw { response: { data: { message: 'العميل غير موجود' }, status: 404 } };
  return ok(db.resolveClient(client));
}

function handleUpdateClient(id: number, body: any) {
  const updated = db.update('clients', id, body);
  if (!updated) throw { response: { data: { message: 'العميل غير موجود' }, status: 404 } };
  return ok(updated);
}

function handleClientAccountStatement(clientId: number) {
  const client = db.getById('clients', clientId);
  if (!client) throw { response: { data: { message: 'العميل غير موجود' }, status: 404 } };
  
  const orders = db.getOrdersForClient(clientId).map(db.resolveOrder);
  const entries: any[] = [];
  let balance = 0;

  // Sort all events chronologically
  const events: any[] = [];
  for (const order of orders) {
    const total = (order.items || []).reduce((s: number, i: any) => s + i.quantity * i.price, 0);
    events.push({ type: 'order', id: order.id, date: order.createdAt, debit: total, credit: 0, description: `أمر تشغيل #${order.id}`, items: order.items?.map((i: any) => ({ productName: i.product?.name || '—', quantity: i.quantity, total: i.quantity * i.price })), notes: order.notes });
    for (const p of (order.payments || [])) {
      events.push({ type: 'payment', id: p.id, date: p.createdAt, debit: 0, credit: p.amount, description: `دفعة — ${p.method || 'نقدي'}`, notes: p.notes });
    }
  }
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const e of events) {
    balance += e.debit - e.credit;
    entries.push({ ...e, balance });
  }

  const totalOrders = entries.filter(e => e.type === 'order').reduce((s, e) => s + e.debit, 0);
  const totalPayments = entries.filter(e => e.type === 'payment').reduce((s, e) => s + e.credit, 0);

  return ok({
    client,
    summary: { ordersCount: orders.length, totalOrders, totalPayments, balance: totalOrders - totalPayments },
    entries,
  });
}

function handleClientPayment(clientId: number, body: any) {
  const { amount, method, notes, orderId } = body;
  if (orderId) {
    const order = db.getById('orders', orderId);
    if (order) {
      const payments = order.payments || [];
      payments.push({ id: payments.length + 1, amount, method: method || 'نقدي', notes, createdAt: new Date().toISOString() });
      db.update('orders', orderId, { payments });
    }
  } else {
    // General payment — attach to first unpaid order
    const orders = db.getOrdersForClient(clientId);
    for (const order of orders) {
      const total = (order.items || []).reduce((s: number, i: any) => s + i.quantity * i.price, 0);
      const paid = (order.payments || []).reduce((s: number, p: any) => s + p.amount, 0);
      if (total > paid) {
        const payments = order.payments || [];
        payments.push({ id: payments.length + 1, amount, method: method || 'نقدي', notes, createdAt: new Date().toISOString() });
        db.update('orders', order.id, { payments });
        break;
      }
    }
  }
  return ok({ success: true });
}

// --- Orders ---
function handleGetOrders() {
  return ok(db.getAll('orders').map(db.resolveOrder));
}

function handleCreateOrder(body: any) {
  const newOrder = db.create('orders', {
    clientId: body.clientId,
    notes: body.notes || '',
    currentStage: 'SUPPLY_ORDER',
    printInternalDone: false,
    printExternalDone: false,
    printStickerDone: false,
    items: (body.items || []).map((item: any, idx: number) => ({ id: idx + 1, ...item, deliveredQty: 0 })),
    stageHistory: [{ id: 1, stage: 'SUPPLY_ORDER', notes: 'تم إنشاء الطلب', responsibleId: 1, createdAt: new Date().toISOString() }],
    payments: [],
  });
  return ok(db.resolveOrder(newOrder));
}

function handleGetOrder(id: number) {
  const order = db.getById('orders', id);
  if (!order) throw { response: { data: { message: 'الطلب غير موجود' }, status: 404 } };
  return ok(db.resolveOrder(order));
}

function handleAdvanceStage(id: number, body: any) {
  const order = db.getById('orders', id);
  if (!order) throw { response: { data: { message: 'الطلب غير موجود' }, status: 404 } };

  const { stage, notes, amountReceived, paymentMethod, itemsDelivered } = body;
  const history = order.stageHistory || [];
  history.push({ id: history.length + 1, stage, notes: notes || '', responsibleId: 1, createdAt: new Date().toISOString() });

  const updates: any = { currentStage: stage, stageHistory: history };

  if (stage === 'DELIVERY') {
    if (amountReceived && amountReceived > 0) {
      const payments = order.payments || [];
      payments.push({ id: payments.length + 1, amount: amountReceived, method: paymentMethod || 'نقدي', notes: notes || 'دفعة تسليم', createdAt: new Date().toISOString() });
      updates.payments = payments;
    }
    if (itemsDelivered) {
      const items = order.items || [];
      for (const del of itemsDelivered) {
        const item = items.find((i: any) => i.productId === del.productId);
        if (item) item.deliveredQty = del.deliveredQty;
      }
      updates.items = items;
    }
  }

  db.update('orders', id, updates);
  return ok(db.resolveOrder(db.getById('orders', id)));
}

function handlePrintingSteps(id: number, body: any) {
  const order = db.getById('orders', id);
  if (!order) throw { response: { data: { message: 'الطلب غير موجود' }, status: 404 } };
  db.update('orders', id, body);
  return ok(db.resolveOrder(db.getById('orders', id)));
}

// --- Suppliers ---
function handleGetSuppliers() {
  return ok(db.getAll('suppliers').map((s: any) => {
    const matCount = db.getMaterialsForSupplier(s.id).length;
    const ordCount = db.getSupplierOrdersForSupplier(s.id).length;
    return { ...s, _count: { materials: matCount, orders: ordCount } };
  }));
}

function handleCreateSupplier(body: any) {
  return ok(db.create('suppliers', body));
}

function handleGetSupplier(id: number) {
  const supplier = db.getById('suppliers', id);
  if (!supplier) throw { response: { data: { message: 'المورد غير موجود' }, status: 404 } };
  return ok(db.resolveSupplier(supplier));
}

function handleSupplierAccountStatement(supplierId: number) {
  const supplier = db.getById('suppliers', supplierId);
  if (!supplier) throw { response: { data: { message: 'المورد غير موجود' }, status: 404 } };
  const orders = db.getSupplierOrdersForSupplier(supplierId);
  let totalValue = 0, totalPayments = 0;
  for (const o of orders) {
    totalValue += (o.items || []).reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    totalPayments += (o.payments || []).reduce((s: number, p: any) => s + p.amount, 0);
  }
  return ok({ summary: { totalValue, totalPayments, balance: totalValue - totalPayments } });
}

function handleSupplierPayment(supplierId: number, body: any) {
  const orders = db.getSupplierOrdersForSupplier(supplierId);
  for (const order of orders) {
    const total = (order.items || []).reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const paid = (order.payments || []).reduce((s: number, p: any) => s + p.amount, 0);
    if (total > paid) {
      const payments = order.payments || [];
      payments.push({ id: payments.length + 1, amount: parseInt(body.amount), method: body.method || 'نقدي', notes: body.notes, createdAt: new Date().toISOString() });
      db.update('supplierOrders', order.id, { payments });
      break;
    }
  }
  return ok({ success: true });
}

// --- Supplier Orders ---
function handleGetSupplierOrders() {
  return ok(db.getAll('supplierOrders').map(db.resolveSupplierOrder));
}

function handleCreateSupplierOrder(body: any) {
  const newSO = db.create('supplierOrders', {
    supplierId: body.supplierId,
    notes: body.notes || '',
    items: (body.items || []).map((item: any, idx: number) => ({ id: idx + 1, ...item, deliveredQty: 0 })),
    payments: [],
  });
  return ok(db.resolveSupplierOrder(newSO));
}

function handleSupplierOrderDeliver(id: number, body: any) {
  const order = db.getById('supplierOrders', id);
  if (!order) throw { response: { data: { message: 'أمر التوريد غير موجود' }, status: 404 } };

  if (body.items) {
    const items = order.items || [];
    for (const del of body.items) {
      const item = items.find((i: any) => i.materialId === del.materialId);
      if (item) item.deliveredQty = del.deliveredQty;
    }
    db.update('supplierOrders', id, { items });
  }

  if (body.amountPaid && body.amountPaid > 0) {
    const payments = order.payments || [];
    payments.push({ id: payments.length + 1, amount: body.amountPaid, method: body.method || 'نقدي', notes: body.notes, createdAt: new Date().toISOString() });
    db.update('supplierOrders', id, { payments });
  }

  return ok(db.resolveSupplierOrder(db.getById('supplierOrders', id)));
}

// --- Materials & Inventory ---
function handleGetMaterials() {
  return ok(db.getAll('materials').map(db.resolveMaterial));
}

function handleCreateMaterial(body: any) {
  return ok(db.create('materials', body));
}

function handleGetInventory() {
  return ok(db.getAll('materials').map(db.resolveMaterial));
}

// --- Products ---
function handleGetProducts() {
  const products = db.getAll('products');
  const materials = db.getAll('materials');
  return ok(products.map((p: any) => ({
    ...p,
    materials: (p.materials || []).map((pm: any) => {
      const mat = materials.find((m: any) => m.id === pm.materialId);
      return { ...pm, material: mat || { name: '—' } };
    }),
  })));
}

function handleCreateProduct(body: any) {
  return ok(db.create('products', { name: body.name, sellPrice: body.sellPrice, sizes: body.sizes, materials: body.materials || [] }));
}

// --- Reports ---
function handleReportSales() {
  const orders = db.getAll('orders');
  const totalRevenue = orders.reduce((sum: number, o: any) =>
    sum + (o.items || []).reduce((s: number, i: any) => s + i.quantity * i.price, 0), 0);
  return ok({
    totalRevenue,
    totalOrders: orders.length,
    averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
  });
}

function handleReportProduction() {
  const orders = db.getAll('orders');
  const completed = orders.filter((o: any) => o.currentStage === 'DELIVERY').length;
  const ordersByStage: Record<string, number> = {};
  for (const o of orders) ordersByStage[o.currentStage] = (ordersByStage[o.currentStage] || 0) + 1;
  return ok({
    totalOrders: orders.length,
    completedOrders: completed,
    completionRate: orders.length > 0 ? `${Math.round((completed / orders.length) * 100)}%` : '0%',
    ordersByStage,
  });
}

function handleReportCustomers() {
  const clients = db.getAll('clients');
  const orders = db.getAll('orders');
  return ok(clients.map((c: any) => {
    const clientOrders = orders.filter((o: any) => o.clientId === c.id);
    const revenue = clientOrders.reduce((sum: number, o: any) =>
      sum + (o.items || []).reduce((s: number, i: any) => s + i.quantity * i.price, 0), 0);
    return { ...c, revenue, ordersCount: clientOrders.length };
  }).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 10));
}

function handleReportFinancial() {
  const orders = db.getAll('orders');
  const totalRevenue = orders.reduce((sum: number, o: any) =>
    sum + (o.items || []).reduce((s: number, i: any) => s + i.quantity * i.price, 0), 0);
  const materials = db.getAll('materials');
  const totalCost = materials.reduce((sum: number, m: any) => sum + m.currentAmount * m.buyPrice, 0);
  const netProfit = totalRevenue - totalCost;
  return ok({
    totalRevenue,
    totalCost,
    netProfit,
    profitMargin: totalRevenue > 0 ? `${Math.round((netProfit / totalRevenue) * 100)}%` : '0%',
  });
}

// ============================
// MOCK API OBJECT (same interface as Axios)
// ============================

const api = {
  async get(url: string) {
    await delay();
    const handler = matchRoute('GET', url);
    if (!handler) {
      console.warn(`[Mock API] Unhandled GET ${url}`);
      return ok([]);
    }
    return handler();
  },

  async post(url: string, body?: any) {
    await delay();
    const handler = matchRoute('POST', url);
    if (!handler) {
      console.warn(`[Mock API] Unhandled POST ${url}`);
      return ok({});
    }
    return handler(body);
  },

  async patch(url: string, body?: any) {
    await delay();
    const handler = matchRoute('PATCH', url);
    if (!handler) {
      console.warn(`[Mock API] Unhandled PATCH ${url}`);
      return ok({});
    }
    return handler(body);
  },

  async put(url: string, body?: any) {
    await delay();
    const handler = matchRoute('PUT', url);
    if (!handler) {
      console.warn(`[Mock API] Unhandled PUT ${url}`);
      return ok({});
    }
    return handler(body);
  },

  async delete(url: string) {
    await delay();
    const handler = matchRoute('DELETE', url);
    if (!handler) {
      console.warn(`[Mock API] Unhandled DELETE ${url}`);
      return ok({});
    }
    return handler();
  },
};

export default api;

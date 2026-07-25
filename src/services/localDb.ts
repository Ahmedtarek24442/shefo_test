// Local Storage Database — CRUD layer over localStorage
import {
  seedUsers, seedClients, seedSuppliers, seedMaterials,
  seedProducts, seedOrders, seedSupplierOrders,
} from '../data/seedData';

const SEED_KEY = 'demo_seeded';

const collections = {
  users: 'db_users',
  clients: 'db_clients',
  suppliers: 'db_suppliers',
  materials: 'db_materials',
  products: 'db_products',
  orders: 'db_orders',
  supplierOrders: 'db_supplierOrders',
} as const;

type CollectionName = keyof typeof collections;

function read(col: CollectionName): any[] {
  try {
    const raw = localStorage.getItem(collections[col]);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(col: CollectionName, data: any[]) {
  localStorage.setItem(collections[col], JSON.stringify(data));
}

function nextId(col: CollectionName): number {
  const items = read(col);
  if (items.length === 0) return 1;
  return Math.max(...items.map((i: any) => i.id)) + 1;
}

// Seed the database on first load
export function ensureSeeded() {
  if (localStorage.getItem(SEED_KEY)) return;
  write('users', seedUsers);
  write('clients', seedClients);
  write('suppliers', seedSuppliers);
  write('materials', seedMaterials);
  write('products', seedProducts);
  write('orders', seedOrders);
  write('supplierOrders', seedSupplierOrders);
  localStorage.setItem(SEED_KEY, 'true');
}

// --- CRUD operations ---

export function getAll(col: CollectionName): any[] {
  return read(col);
}

export function getById(col: CollectionName, id: number): any | null {
  return read(col).find((item: any) => item.id === id) || null;
}

export function create(col: CollectionName, item: any): any {
  const items = read(col);
  const newItem = { ...item, id: nextId(col), createdAt: item.createdAt || new Date().toISOString() };
  items.push(newItem);
  write(col, items);
  return newItem;
}

export function update(col: CollectionName, id: number, data: any): any | null {
  const items = read(col);
  const idx = items.findIndex((i: any) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  write(col, items);
  return items[idx];
}

export function remove(col: CollectionName, id: number): boolean {
  const items = read(col);
  const filtered = items.filter((i: any) => i.id !== id);
  if (filtered.length === items.length) return false;
  write(col, filtered);
  return true;
}

// --- Helpers to resolve relations ---

export function getProductsForClient(clientId: number) {
  return getAll('products');
}

export function getMaterialsForSupplier(supplierId: number) {
  return getAll('materials').filter((m: any) => m.supplierId === supplierId);
}

export function getOrdersForClient(clientId: number) {
  return getAll('orders').filter((o: any) => o.clientId === clientId);
}

export function getSupplierOrdersForSupplier(supplierId: number) {
  return getAll('supplierOrders').filter((o: any) => o.supplierId === supplierId);
}

// Resolve references in an order
export function resolveOrder(order: any): any {
  const clients = getAll('clients');
  const products = getAll('products');
  const users = getAll('users');
  
  const client = clients.find((c: any) => c.id === order.clientId);
  const items = (order.items || []).map((item: any) => ({
    ...item,
    product: products.find((p: any) => p.id === item.productId) || { name: '—', sizes: '' },
  }));
  const stageHistory = (order.stageHistory || []).map((h: any) => ({
    ...h,
    responsible: users.find((u: any) => u.id === h.responsibleId) || { name: '—' },
  }));

  return { ...order, client, items, stageHistory, payments: order.payments || [] };
}

// Resolve references in a client
export function resolveClient(client: any): any {
  const users = getAll('users');
  const orders = getOrdersForClient(client.id).map(resolveOrder);
  const responsible = users.find((u: any) => u.id === client.responsibleId);
  return { ...client, orders, responsible, _count: { orders: orders.length } };
}

// Resolve supplier with relations
export function resolveSupplier(supplier: any): any {
  const materials = getMaterialsForSupplier(supplier.id);
  const orders = getSupplierOrdersForSupplier(supplier.id).map(resolveSupplierOrder);
  return { ...supplier, materials, orders, _count: { materials: materials.length, orders: orders.length } };
}

// Resolve supplier order
export function resolveSupplierOrder(so: any): any {
  const suppliers = getAll('suppliers');
  const materials = getAll('materials');
  const suplier = suppliers.find((s: any) => s.id === so.supplierId);
  const items = (so.items || []).map((item: any) => ({
    ...item,
    material: materials.find((m: any) => m.id === item.materialId) || { name: '—' },
  }));
  return { ...so, suplier, items, payments: so.payments || [] };
}

// Resolve material with supplier
export function resolveMaterial(mat: any): any {
  const suppliers = getAll('suppliers');
  const suplier = suppliers.find((s: any) => s.id === mat.supplierId);
  return { ...mat, suplier };
}

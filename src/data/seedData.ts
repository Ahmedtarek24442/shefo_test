// Seed data for the demo version — realistic Arabic factory management data

export const seedUsers = [
  { id: 1, name: "مدير النظام", phone: "0500000000", role: "admin" },
  { id: 2, name: "أحمد محمد", phone: "0511111111", role: "manager" },
];

export const seedClients = [
  { id: 1, companyName: "شركة النيل للتجارة", phone: "0501234567", email: "info@nile-trade.com", address: "القاهرة - المعادي", taxNumber: "300-123-456", creditLimit: 150000, responsibleId: 1 },
  { id: 2, companyName: "مؤسسة الأهرام للتوزيع", phone: "0507654321", email: "sales@ahram-dist.com", address: "الجيزة - الدقي", taxNumber: "300-789-012", creditLimit: 200000, responsibleId: 1 },
  { id: 3, companyName: "شركة الدلتا للتغليف", phone: "0509876543", email: "delta@packaging.com", address: "المنصورة - شارع الجمهورية", taxNumber: "300-345-678", creditLimit: 100000, responsibleId: 2 },
  { id: 4, companyName: "مصنع الصفا للمواد الغذائية", phone: "0502345678", email: "safa@foods.com", address: "الإسكندرية - سموحة", taxNumber: "300-901-234", creditLimit: 250000, responsibleId: 1 },
  { id: 5, companyName: "شركة المروة للأدوية", phone: "0503456789", email: "marwa@pharma.com", address: "القاهرة - مدينة نصر", taxNumber: "300-567-890", creditLimit: 180000, responsibleId: 2 },
  { id: 6, companyName: "مؤسسة البركة للعطور", phone: "0504567890", email: "baraka@perfumes.com", address: "طنطا - شارع الجلاء", taxNumber: null, creditLimit: 80000, responsibleId: 1 },
  { id: 7, companyName: "شركة الفتح للإلكترونيات", phone: "0505678901", email: null, address: "أسيوط - شارع الثورة", taxNumber: "300-111-222", creditLimit: 120000, responsibleId: 2 },
  { id: 8, companyName: "مجموعة النور للأثاث", phone: "0506789012", email: "nour@furniture.com", address: "دمياط - منطقة الأثاث", taxNumber: "300-333-444", creditLimit: 300000, responsibleId: 1 },
];

export const seedSuppliers = [
  { id: 1, name: "شركة الورق المصرية", phone: "0551234567", email: "paper@egypt.com", address: "القاهرة - شبرا", taxNumber: "400-111-111" },
  { id: 2, name: "مصنع الأحبار المتحدة", phone: "0552345678", email: "inks@united.com", address: "الإسكندرية - العامرية", taxNumber: "400-222-222" },
  { id: 3, name: "مؤسسة اللاصق العربي", phone: "0553456789", email: "glue@arab.com", address: "الجيزة - أكتوبر", taxNumber: "400-333-333" },
  { id: 4, name: "شركة المستلزمات الصناعية", phone: "0554567890", email: "supplies@industrial.com", address: "بورسعيد", taxNumber: null },
  { id: 5, name: "مصنع الكيماويات الحديث", phone: "0555678901", email: "chem@modern.com", address: "السويس - المنطقة الصناعية", taxNumber: "400-555-555" },
];

export const seedMaterials = [
  { id: 1, name: "ورق كرافت 150 جرام", type: "ورق", unit: "طن", currentAmount: 25, minimumAllowedAmount: 5, buyPrice: 18000, supplierId: 1 },
  { id: 2, name: "ورق فلوت وسط", type: "ورق", unit: "طن", currentAmount: 18, minimumAllowedAmount: 4, buyPrice: 14000, supplierId: 1 },
  { id: 3, name: "ورق تست لاينر", type: "ورق", unit: "طن", currentAmount: 12, minimumAllowedAmount: 3, buyPrice: 12000, supplierId: 1 },
  { id: 4, name: "حبر طباعة أسود", type: "أحبار", unit: "كجم", currentAmount: 200, minimumAllowedAmount: 30, buyPrice: 85, supplierId: 2 },
  { id: 5, name: "حبر طباعة أحمر", type: "أحبار", unit: "كجم", currentAmount: 80, minimumAllowedAmount: 20, buyPrice: 120, supplierId: 2 },
  { id: 6, name: "حبر طباعة أزرق", type: "أحبار", unit: "كجم", currentAmount: 15, minimumAllowedAmount: 20, buyPrice: 120, supplierId: 2 },
  { id: 7, name: "مادة لاصقة صناعية", type: "مواد لاصقة", unit: "كجم", currentAmount: 500, minimumAllowedAmount: 100, buyPrice: 25, supplierId: 3 },
  { id: 8, name: "شريط لاصق تغليف", type: "مواد لاصقة", unit: "لفة", currentAmount: 300, minimumAllowedAmount: 50, buyPrice: 8, supplierId: 3 },
  { id: 9, name: "أسلاك تدبيس", type: "مستلزمات", unit: "كجم", currentAmount: 150, minimumAllowedAmount: 30, buyPrice: 35, supplierId: 4 },
  { id: 10, name: "بالتات خشبية", type: "مستلزمات", unit: "قطعة", currentAmount: 3, minimumAllowedAmount: 10, buyPrice: 120, supplierId: 4 },
];

export const seedProducts = [
  { id: 1, name: "صندوق كرتون مقوى 40×30×20", sellPrice: 25, sizes: "40×30×20", materials: [{ materialId: 1, quantity: 2 }, { materialId: 7, quantity: 1 }] },
  { id: 2, name: "صندوق كرتون كبير 60×40×40", sellPrice: 45, sizes: "60×40×40", materials: [{ materialId: 1, quantity: 4 }, { materialId: 2, quantity: 2 }] },
  { id: 3, name: "علبة تغليف صغيرة 20×15×10", sellPrice: 12, sizes: "20×15×10", materials: [{ materialId: 3, quantity: 1 }] },
  { id: 4, name: "صندوق شحن ثقيل 80×60×50", sellPrice: 75, sizes: "80×60×50", materials: [{ materialId: 1, quantity: 6 }, { materialId: 2, quantity: 3 }, { materialId: 7, quantity: 2 }] },
  { id: 5, name: "علبة منتجات غذائية مطبوعة", sellPrice: 18, sizes: "25×20×15", materials: [{ materialId: 3, quantity: 1 }, { materialId: 4, quantity: 1 }, { materialId: 5, quantity: 1 }] },
  { id: 6, name: "كرتون أثاث مبطن 100×50×50", sellPrice: 95, sizes: "100×50×50", materials: [{ materialId: 1, quantity: 8 }, { materialId: 2, quantity: 4 }, { materialId: 7, quantity: 3 }] },
];

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const seedOrders = [
  {
    id: 1, clientId: 1, notes: "طلب عاجل — تسليم خلال أسبوع", currentStage: "DELIVERY",
    printInternalDone: true, printExternalDone: true, printStickerDone: false, createdAt: d(30),
    items: [{ id: 1, productId: 1, quantity: 5000, price: 25, deliveredQty: 5000 }],
    stageHistory: [
      { id: 1, stage: "SUPPLY_ORDER", notes: "تم إنشاء أمر التوريد", responsibleId: 1, createdAt: d(30) },
      { id: 2, stage: "DESIGN", notes: "تم اعتماد التصميم", responsibleId: 2, createdAt: d(28) },
      { id: 3, stage: "PRINTING", notes: "تمت الطباعة بنجاح", responsibleId: 1, createdAt: d(25) },
      { id: 4, stage: "PACKAGING", notes: "تم التعبئة والتغليف", responsibleId: 2, createdAt: d(22) },
      { id: 5, stage: "DELIVERY", notes: "تم التسليم للعميل", responsibleId: 1, createdAt: d(20) },
    ],
    payments: [{ id: 1, amount: 50000, method: "تحويل بنكي", notes: "دفعة أولى", createdAt: d(30) }, { id: 2, amount: 75000, method: "نقدي", notes: "تسوية نهائية", createdAt: d(20) }],
  },
  {
    id: 2, clientId: 2, notes: "طلب أهرام — كراتين تغليف", currentStage: "PACKAGING",
    printInternalDone: true, printExternalDone: false, printStickerDone: true, createdAt: d(15),
    items: [{ id: 2, productId: 2, quantity: 3000, price: 45, deliveredQty: 0 }],
    stageHistory: [
      { id: 6, stage: "SUPPLY_ORDER", notes: "طلب خامات", responsibleId: 1, createdAt: d(15) },
      { id: 7, stage: "DESIGN", notes: "تصميم العبوة", responsibleId: 2, createdAt: d(13) },
      { id: 8, stage: "PRINTING", notes: "طباعة داخلية", responsibleId: 1, createdAt: d(10) },
      { id: 9, stage: "PACKAGING", notes: "جاري التعبئة", responsibleId: 2, createdAt: d(7) },
    ],
    payments: [{ id: 3, amount: 60000, method: "شيك", notes: "دفعة مقدمة", createdAt: d(15) }],
  },
  {
    id: 3, clientId: 3, notes: "طلب الدلتا — علب صغيرة", currentStage: "PRINTING",
    printInternalDone: true, printExternalDone: false, printStickerDone: false, createdAt: d(10),
    items: [{ id: 3, productId: 3, quantity: 10000, price: 12, deliveredQty: 0 }],
    stageHistory: [
      { id: 10, stage: "SUPPLY_ORDER", notes: "تم", responsibleId: 1, createdAt: d(10) },
      { id: 11, stage: "DESIGN", notes: "تصميم مبدئي", responsibleId: 2, createdAt: d(8) },
      { id: 12, stage: "PRINTING", notes: "جاري الطباعة", responsibleId: 1, createdAt: d(5) },
    ],
    payments: [{ id: 4, amount: 40000, method: "نقدي", notes: "دفعة أولى", createdAt: d(10) }],
  },
  {
    id: 4, clientId: 4, notes: "طلب الصفا — كراتين غذائية مطبوعة", currentStage: "DESIGN",
    printInternalDone: false, printExternalDone: false, printStickerDone: false, createdAt: d(5),
    items: [{ id: 4, productId: 5, quantity: 8000, price: 18, deliveredQty: 0 }],
    stageHistory: [
      { id: 13, stage: "SUPPLY_ORDER", notes: "طلب الخامات", responsibleId: 2, createdAt: d(5) },
      { id: 14, stage: "DESIGN", notes: "جاري العمل على التصميم", responsibleId: 1, createdAt: d(3) },
    ],
    payments: [{ id: 5, amount: 30000, method: "تحويل بنكي", notes: "مقدم", createdAt: d(5) }],
  },
  {
    id: 5, clientId: 5, notes: "طلب المروة — علب أدوية", currentStage: "SUPPLY_ORDER",
    printInternalDone: false, printExternalDone: false, printStickerDone: false, createdAt: d(2),
    items: [{ id: 5, productId: 3, quantity: 15000, price: 12, deliveredQty: 0 }],
    stageHistory: [
      { id: 15, stage: "SUPPLY_ORDER", notes: "جاري تجهيز الخامات", responsibleId: 1, createdAt: d(2) },
    ],
    payments: [],
  },
  {
    id: 6, clientId: 8, notes: "طلب النور — كراتين أثاث كبيرة", currentStage: "DELIVERY",
    printInternalDone: true, printExternalDone: true, printStickerDone: true, createdAt: d(45),
    items: [{ id: 6, productId: 6, quantity: 2000, price: 95, deliveredQty: 2000 }],
    stageHistory: [
      { id: 16, stage: "SUPPLY_ORDER", notes: "تم", responsibleId: 1, createdAt: d(45) },
      { id: 17, stage: "DESIGN", notes: "تم", responsibleId: 2, createdAt: d(42) },
      { id: 18, stage: "PRINTING", notes: "تم", responsibleId: 1, createdAt: d(38) },
      { id: 19, stage: "PACKAGING", notes: "تم", responsibleId: 2, createdAt: d(35) },
      { id: 20, stage: "DELIVERY", notes: "تم التسليم", responsibleId: 1, createdAt: d(32) },
    ],
    payments: [{ id: 6, amount: 100000, method: "شيك", notes: "دفعة أولى", createdAt: d(45) }, { id: 7, amount: 90000, method: "تحويل بنكي", notes: "دفعة ثانية", createdAt: d(32) }],
  },
  {
    id: 7, clientId: 1, notes: "طلب ثاني — النيل", currentStage: "PACKAGING",
    printInternalDone: true, printExternalDone: true, printStickerDone: false, createdAt: d(12),
    items: [{ id: 7, productId: 4, quantity: 1500, price: 75, deliveredQty: 0 }],
    stageHistory: [
      { id: 21, stage: "SUPPLY_ORDER", notes: "تم", responsibleId: 2, createdAt: d(12) },
      { id: 22, stage: "DESIGN", notes: "تم", responsibleId: 1, createdAt: d(10) },
      { id: 23, stage: "PRINTING", notes: "تم", responsibleId: 2, createdAt: d(8) },
      { id: 24, stage: "PACKAGING", notes: "جاري", responsibleId: 1, createdAt: d(5) },
    ],
    payments: [{ id: 8, amount: 50000, method: "نقدي", notes: "مقدم", createdAt: d(12) }],
  },
  {
    id: 8, clientId: 6, notes: "طلب البركة — علب عطور", currentStage: "PRINTING",
    printInternalDone: false, printExternalDone: false, printStickerDone: false, createdAt: d(8),
    items: [{ id: 8, productId: 3, quantity: 20000, price: 12, deliveredQty: 0 }],
    stageHistory: [
      { id: 25, stage: "SUPPLY_ORDER", notes: "تم", responsibleId: 1, createdAt: d(8) },
      { id: 26, stage: "DESIGN", notes: "تم", responsibleId: 2, createdAt: d(6) },
      { id: 27, stage: "PRINTING", notes: "جاري", responsibleId: 1, createdAt: d(4) },
    ],
    payments: [{ id: 9, amount: 80000, method: "تحويل بنكي", notes: "دفعة أولى", createdAt: d(8) }],
  },
  {
    id: 9, clientId: 7, notes: "طلب الفتح — صناديق إلكترونيات", currentStage: "DELIVERY",
    printInternalDone: true, printExternalDone: false, printStickerDone: true, createdAt: d(60),
    items: [{ id: 9, productId: 1, quantity: 4000, price: 25, deliveredQty: 4000 }],
    stageHistory: [
      { id: 28, stage: "SUPPLY_ORDER", notes: "تم", responsibleId: 2, createdAt: d(60) },
      { id: 29, stage: "DESIGN", notes: "تم", responsibleId: 1, createdAt: d(57) },
      { id: 30, stage: "PRINTING", notes: "تم", responsibleId: 2, createdAt: d(53) },
      { id: 31, stage: "PACKAGING", notes: "تم", responsibleId: 1, createdAt: d(50) },
      { id: 32, stage: "DELIVERY", notes: "تم", responsibleId: 2, createdAt: d(48) },
    ],
    payments: [{ id: 10, amount: 100000, method: "نقدي", notes: "تسوية كاملة", createdAt: d(48) }],
  },
  {
    id: 10, clientId: 2, notes: "طلب أهرام ثاني — صناديق شحن", currentStage: "DESIGN",
    printInternalDone: false, printExternalDone: false, printStickerDone: false, createdAt: d(3),
    items: [{ id: 10, productId: 4, quantity: 2500, price: 75, deliveredQty: 0 }],
    stageHistory: [
      { id: 33, stage: "SUPPLY_ORDER", notes: "تم", responsibleId: 1, createdAt: d(3) },
      { id: 34, stage: "DESIGN", notes: "جاري التصميم", responsibleId: 2, createdAt: d(1) },
    ],
    payments: [{ id: 11, amount: 50000, method: "شيك", notes: "مقدم", createdAt: d(3) }],
  },
];

export const seedSupplierOrders = [
  {
    id: 1, supplierId: 1, notes: "طلب ورق كرافت", createdAt: d(40),
    items: [{ id: 1, materialId: 1, quantity: 10, price: 18000, deliveredQty: 10 }],
    payments: [{ id: 1, amount: 180000, method: "تحويل بنكي", notes: "دفعة كاملة", createdAt: d(38) }],
  },
  {
    id: 2, supplierId: 2, notes: "طلب أحبار متنوعة", createdAt: d(25),
    items: [
      { id: 2, materialId: 4, quantity: 100, price: 85, deliveredQty: 100 },
      { id: 3, materialId: 5, quantity: 50, price: 120, deliveredQty: 50 },
    ],
    payments: [{ id: 2, amount: 10000, method: "نقدي", notes: "دفعة جزئية", createdAt: d(25) }],
  },
  {
    id: 3, supplierId: 3, notes: "طلب مواد لاصقة", createdAt: d(20),
    items: [{ id: 4, materialId: 7, quantity: 200, price: 25, deliveredQty: 150 }],
    payments: [{ id: 3, amount: 3000, method: "شيك", notes: "دفعة أولى", createdAt: d(20) }],
  },
  {
    id: 4, supplierId: 1, notes: "طلب ورق فلوت", createdAt: d(10),
    items: [{ id: 5, materialId: 2, quantity: 8, price: 14000, deliveredQty: 5 }],
    payments: [{ id: 4, amount: 50000, method: "تحويل بنكي", notes: "دفعة مقدمة", createdAt: d(10) }],
  },
  {
    id: 5, supplierId: 4, notes: "طلب مستلزمات", createdAt: d(5),
    items: [{ id: 6, materialId: 9, quantity: 100, price: 35, deliveredQty: 0 }, { id: 7, materialId: 10, quantity: 20, price: 120, deliveredQty: 0 }],
    payments: [],
  },
];

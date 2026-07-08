import { useState } from "react";
import { Package, TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";

const initialStock = [
  { id: "INV001", name: "صندوق كرتون ٤٠×٣٠×٢٠", category: "صناديق قياسية", inStock: 12500, reserved: 5000, available: 7500, unit: "قطعة", minStock: 2000 },
  { id: "INV002", name: "كرتون مموج ٣٥×٢٥×١٥", category: "صناديق قياسية", inStock: 8200, reserved: 3000, available: 5200, unit: "قطعة", minStock: 1500 },
  { id: "INV003", name: "علب هدايا فاخرة", category: "علب هدايا", inStock: 3400, reserved: 2000, available: 1400, unit: "قطعة", minStock: 500 },
  { id: "INV004", name: "صندوق شحن دولي", category: "شحن وتصدير", inStock: 6800, reserved: 4500, available: 2300, unit: "قطعة", minStock: 1000 },
  { id: "INV005", name: "كرتون مقوى خماسي", category: "صناديق ثقيلة", inStock: 920, reserved: 700, available: 220, unit: "قطعة", minStock: 500 },
  { id: "INV006", name: "علب أغذية مبردة", category: "غذاء ومشروبات", inStock: 15000, reserved: 10000, available: 5000, unit: "قطعة", minStock: 3000 },
];

const initialMovements = [
  { date: "٢٥/٠٦/٢٠٢٤", item: "صندوق كرتون ٤٠×٣٠×٢٠", type: "صادر", qty: 5000, order: "WO-2024-0086", balance: 7500 },
  { date: "٢٤/٠٦/٢٠٢٤", item: "كرتون مموج ٣٥×٢٥×١٥", type: "وارد", qty: 3000, order: "PO-2024-044", balance: 8200 },
  { date: "٢٣/٠٦/٢٠٢٤", item: "علب هدايا فاخرة", type: "صادر", qty: 2000, order: "WO-2024-0083", balance: 3400 },
  { date: "٢٢/٠٦/٢٠٢٤", item: "صندوق شحن دولي", type: "صادر", qty: 1500, order: "WO-2024-0082", balance: 6800 },
  { date: "٢١/٠٦/٢٠٢٤", item: "علب أغذية مبردة", type: "وارد", qty: 5000, order: "PO-2024-043", balance: 15000 },
  { date: "٢٠/٠٦/٢٠٢٤", item: "كرتون مقوى خماسي", type: "صادر", qty: 700, order: "WO-2024-0084", balance: 920 },
];

const monthlyData = [
  { month: "يناير", in: 45000, out: 38000 },
  { month: "فبراير", in: 52000, out: 48000 },
  { month: "مارس", in: 38000, out: 42000 },
  { month: "أبريل", in: 61000, out: 55000 },
  { month: "مايو", in: 48000, out: 51000 },
  { month: "يونيو", in: 57000, out: 49000 },
];

const emptyAdj = { item: "", type: "وارد", qty: "", reason: "", ref: "" };

export function Inventory() {
  const [tab, setTab] = useState<"stock" | "movements">("stock");
  const [stockItems, setStockItems] = useState(initialStock);
  const [movements, setMovements] = useState(initialMovements);
  const [showModal, setShowModal] = useState(false);
  const [adj, setAdj] = useState(emptyAdj);
  const [saving, setSaving] = useState(false);

  const setA = (k: string, v: string) => setAdj((p) => ({ ...p, [k]: v }));

  const lowStock = stockItems.filter((i) => i.available <= i.minStock).length;

  const handleAdjust = () => {
    if (!adj.item || !adj.qty) {
      toast.error("يرجى تحديد الصنف والكمية");
      return;
    }
    const qty = parseInt(adj.qty);
    setSaving(true);
    setTimeout(() => {
      const today = new Date().toLocaleDateString("ar-SA");
      setMovements((prev) => [
        { date: today, item: adj.item, type: adj.type, qty, order: adj.ref || "تسوية يدوية", balance: 0 },
        ...prev,
      ]);
      setStockItems((prev) =>
        prev.map((item) => {
          if (item.name !== adj.item) return item;
          const delta = adj.type === "وارد" ? qty : -qty;
          const newAvail = Math.max(0, item.available + delta);
          return { ...item, available: newAvail, inStock: Math.max(0, item.inStock + delta) };
        })
      );
      setSaving(false);
      setShowModal(false);
      setAdj(emptyAdj);
      toast.success(`تمت تسوية المخزون بنجاح — ${adj.type} ${qty.toLocaleString()} ${adj.item}`);
    }, 800);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المخزون</h1>
          <p className="text-slate-500 text-sm mt-0.5">تتبع المخزون وحركات البضاعة</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 border border-[#2563EB] bg-white text-[#2563EB] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          تسوية المخزون
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الأصناف", value: stockItems.length, icon: Package, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "وارد هذا الشهر", value: "٥٧,٠٠٠", icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-50" },
          { label: "صادر هذا الشهر", value: "٤٩,٠٠٠", icon: ArrowDownRight, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "أصناف منخفضة", value: lowStock, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${k.bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                <p className="text-xs text-slate-500">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4">حركة المخزون الشهرية (قطعة)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
            <Bar dataKey="in" fill="#2563EB" radius={[4, 4, 0, 0]} name="وارد" />
            <Bar dataKey="out" fill="#F59E0B" radius={[4, 4, 0, 0]} name="صادر" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-2">
        {[{ key: "stock", label: "المخزون الحالي" }, { key: "movements", label: "حركات المخزون" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "stock" | "movements")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-[#2563EB] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stock" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["رقم الصنف", "المنتج", "الفئة", "في المخزون", "محجوز", "متاح", "الحد الأدنى", "الحالة"].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item) => {
                const isLow = item.available <= item.minStock;
                const pct = Math.min(100, (item.available / item.inStock) * 100);
                return (
                  <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50/50 ${isLow ? "bg-red-50/20" : ""}`}>
                    <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{item.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{item.category}</td>
                    <td className="py-3 px-4 text-slate-700">{item.inStock.toLocaleString()}</td>
                    <td className="py-3 px-4 text-orange-600">{item.reserved.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLow ? "text-red-600" : "text-green-600"}`}>{item.available.toLocaleString()}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct < 30 ? "bg-red-400" : pct < 60 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{item.minStock.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        isLow ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"
                      }`}>{isLow ? "منخفض" : "متوفر"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["التاريخ", "الصنف", "النوع", "الكمية", "المرجع", "الرصيد بعد الحركة"].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movements.map((m, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 text-xs">{m.date}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{m.item}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {m.type === "وارد" ? (
                        <><TrendingUp className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600 text-xs font-medium">وارد</span></>
                      ) : (
                        <><TrendingDown className="w-3.5 h-3.5 text-orange-500" /><span className="text-orange-600 text-xs font-medium">صادر</span></>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{m.qty.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-xs text-[#2563EB]">{m.order}</td>
                  <td className="py-3 px-4 text-slate-700">{m.balance > 0 ? m.balance.toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="تسوية المخزون">
        <div className="space-y-4">
          <FormField label="الصنف" required>
            <select value={adj.item} onChange={(e) => setA("item", e.target.value)} className={selectCls}>
              <option value="">اختر الصنف...</option>
              {stockItems.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="نوع الحركة" required>
              <select value={adj.type} onChange={(e) => setA("type", e.target.value)} className={selectCls}>
                <option value="وارد">وارد (إضافة)</option>
                <option value="صادر">صادر (خصم)</option>
              </select>
            </FormField>
            <FormField label="الكمية" required>
              <input value={adj.qty} onChange={(e) => setA("qty", e.target.value)} placeholder="0" className={inputCls} type="number" min="1" />
            </FormField>
          </div>
          <FormField label="رقم المرجع / أمر التشغيل">
            <input value={adj.ref} onChange={(e) => setA("ref", e.target.value)} placeholder="مثال: WO-2024-0086" className={inputCls} />
          </FormField>
          <FormField label="سبب التسوية">
            <input value={adj.reason} onChange={(e) => setA("reason", e.target.value)} placeholder="مثال: تلف، مرتجع، تصحيح كشف..." className={inputCls} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleAdjust} confirmLabel="تأكيد التسوية" loading={saving} />
      </Modal>
    </div>
  );
}

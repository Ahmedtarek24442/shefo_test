import { useState } from "react";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";

const initialMaterials = [
  { id: "M001", name: "ورق كرافت بني", type: "ورق", unit: "طن", qty: 45.5, minQty: 10, price: 3200, supplier: "شركة الورق السعودية", lastPurchase: "١٨/٠٦/٢٠٢٤" },
  { id: "M002", name: "ورق فلوت مموج", type: "ورق", unit: "طن", qty: 32.0, minQty: 8, price: 2800, supplier: "مصنع الورق الوطني", lastPurchase: "١٥/٠٦/٢٠٢٤" },
  { id: "M003", name: "غراء الكرتون الصناعي", type: "مواد لاصقة", unit: "كجم", qty: 580, minQty: 200, price: 45, supplier: "شركة الكيماويات المتحدة", lastPurchase: "٢٠/٠٦/٢٠٢٤" },
  { id: "M004", name: "حبر طباعة أزرق", type: "أحبار", unit: "كجم", qty: 28, minQty: 50, price: 180, supplier: "شركة الطباعة الخليجية", lastPurchase: "١٢/٠٦/٢٠٢٤" },
  { id: "M005", name: "حبر طباعة أحمر", type: "أحبار", unit: "كجم", qty: 35, minQty: 50, price: 180, supplier: "شركة الطباعة الخليجية", lastPurchase: "١٢/٠٦/٢٠٢٤" },
  { id: "M006", name: "حبر طباعة أصفر", type: "أحبار", unit: "كجم", qty: 42, minQty: 50, price: 175, supplier: "شركة الطباعة الخليجية", lastPurchase: "١٢/٠٦/٢٠٢٤" },
  { id: "M007", name: "شريط تغليف شفاف", type: "مستلزمات", unit: "لفة", qty: 320, minQty: 100, price: 12, supplier: "مستودعات اللوازم", lastPurchase: "٢٢/٠٦/٢٠٢٤" },
  { id: "M008", name: "بروفيل تثبيت زوايا", type: "مستلزمات", unit: "قطعة", qty: 4200, minQty: 2000, price: 0.8, supplier: "مستودعات اللوازم", lastPurchase: "١٩/٠٦/٢٠٢٤" },
  { id: "M009", name: "ورق مقوى أبيض", type: "ورق", unit: "طن", qty: 6.5, minQty: 5, price: 4100, supplier: "مصنع الورق الوطني", lastPurchase: "١٠/٠٦/٢٠٢٤" },
  { id: "M010", name: "مادة برونز ذهبي", type: "أحبار", unit: "كجم", qty: 8, minQty: 15, price: 420, supplier: "شركة المواد الخاصة", lastPurchase: "٠٨/٠٦/٢٠٢٤" },
];

const typeColors: Record<string, string> = {
  "ورق": "bg-blue-100 text-blue-700",
  "مواد لاصقة": "bg-yellow-100 text-yellow-700",
  "أحبار": "bg-purple-100 text-purple-700",
  "مستلزمات": "bg-slate-100 text-slate-600",
};

const suppliers = ["شركة الورق السعودية", "مصنع الورق الوطني", "شركة الكيماويات المتحدة", "شركة الطباعة الخليجية", "مستودعات اللوازم", "شركة المواد الخاصة"];

const emptyForm = { name: "", type: "", unit: "", qty: "", minQty: "", price: "", supplier: "" };

export function Materials() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const types = ["الكل", ...Array.from(new Set(materials.map((m) => m.type)))];
  const filtered = materials.filter((m) => {
    const matchSearch = m.name.includes(search) || m.supplier.includes(search);
    const matchType = typeFilter === "الكل" || m.type === typeFilter;
    return matchSearch && matchType;
  });

  const lowStock = materials.filter((m) => m.qty <= m.minQty).length;

  const handleSave = () => {
    if (!form.name || !form.type || !form.unit) {
      toast.error("يرجى تعبئة الحقول المطلوبة");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newId = `M${String(materials.length + 1).padStart(3, "0")}`;
      setMaterials((prev) => [
        ...prev,
        {
          id: newId,
          name: form.name,
          type: form.type,
          unit: form.unit,
          qty: parseFloat(form.qty) || 0,
          minQty: parseFloat(form.minQty) || 0,
          price: parseFloat(form.price) || 0,
          supplier: form.supplier,
          lastPurchase: "—",
        },
      ]);
      setSaving(false);
      setShowModal(false);
      setForm(emptyForm);
      toast.success(`تمت إضافة الخامة "${form.name}" بنجاح`);
    }, 700);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الخامات</h1>
          <p className="text-slate-500 text-sm mt-0.5">إدارة المواد الخام والمستلزمات</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة خامة
        </button>
      </div>

      {lowStock > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            تحذير: {lowStock} مواد وصلت إلى الحد الأدنى للمخزون — يرجى إعادة الطلب
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الأصناف", value: materials.length, color: "text-[#2563EB]" },
          { label: "مخزون كافٍ", value: materials.filter((m) => m.qty > m.minQty).length, color: "text-green-600" },
          { label: "مخزون منخفض", value: lowStock, color: "text-red-600" },
          { label: "قيمة المخزون التقديرية", value: "٢١٨,٤٠٠ ريال", color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم الخامة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-slate-50 rounded-lg pr-9 pl-4 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
        <div className="flex items-center gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["رقم الصنف", "اسم الخامة", "النوع", "الوحدة", "الكمية المتاحة", "الحد الأدنى", "سعر الشراء", "المورد", "آخر شراء", "الحالة"].map((h) => (
                <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const isLow = m.qty <= m.minQty;
              return (
                <tr key={m.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                  <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{m.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {isLow && <AlertTriangle className="inline w-3.5 h-3.5 text-red-500 ml-1.5" />}
                    {m.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[m.type]}`}>{m.type}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{m.unit}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold text-sm ${isLow ? "text-red-600" : "text-slate-800"}`}>
                      {m.qty} {m.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{m.minQty} {m.unit}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{m.price.toLocaleString()} ريال/{m.unit}</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{m.supplier}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{m.lastPurchase}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                      isLow ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"
                    }`}>
                      {isLow ? "منخفض" : "كافٍ"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New Material Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="إضافة خامة جديدة">
        <div className="space-y-4">
          <FormField label="اسم الخامة" required>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="مثال: حبر طباعة أسود" className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="النوع" required>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
                <option value="">اختر النوع...</option>
                {["ورق", "مواد لاصقة", "أحبار", "مستلزمات"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="وحدة القياس" required>
              <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className={selectCls}>
                <option value="">اختر الوحدة...</option>
                {["طن", "كجم", "لتر", "لفة", "قطعة", "رزمة"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </FormField>
            <FormField label="الكمية الحالية">
              <input value={form.qty} onChange={(e) => set("qty", e.target.value)} placeholder="0" className={inputCls} type="number" />
            </FormField>
            <FormField label="الحد الأدنى للمخزون">
              <input value={form.minQty} onChange={(e) => set("minQty", e.target.value)} placeholder="0" className={inputCls} type="number" />
            </FormField>
            <FormField label="سعر الشراء (ريال/وحدة)">
              <input value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" className={inputCls} type="number" />
            </FormField>
            <FormField label="المورد">
              <select value={form.supplier} onChange={(e) => set("supplier", e.target.value)} className={selectCls}>
                <option value="">اختر المورد...</option>
                {suppliers.map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="إضافة الخامة" loading={saving} />
      </Modal>
    </div>
  );
}

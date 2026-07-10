import { useState, useEffect } from "react";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";
import api from "../../services/api";

const typeColors: Record<string, string> = {
  "ورق": "bg-blue-100 text-blue-700",
  "مواد لاصقة": "bg-yellow-100 text-yellow-700",
  "أحبار": "bg-purple-100 text-purple-700",
  "مستلزمات": "bg-slate-100 text-slate-600",
};

const emptyForm = { name: "", type: "", unit: "", qty: "", minQty: "", price: "", supplierId: "" };


export function Materials() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matRes, supRes] = await Promise.all([
        api.get('/materials'),
        api.get('/suppliers')
      ]);
      setMaterials(matRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const types = ["الكل", ...Array.from(new Set(materials.map((m) => m.type)))];
  const filtered = materials.filter((m) => {
    const matchSearch = m.name.includes(search) || m.suplier?.name?.includes(search);
    const matchType = typeFilter === "الكل" || m.type === typeFilter;
    return matchSearch && matchType;
  });

  const lowStock = materials.filter((m) => m.currentAmount <= m.minimumAllowedAmount).length;

  const handleSave = async () => {
    if (!form.name || !form.type || !form.unit || !form.supplierId) {
      toast.error("يرجى تعبئة الحقول المطلوبة (الاسم، النوع، الوحدة، المورد)");
      return;
    }
    setSaving(true);
    try {
      await api.post('/materials', {
        name: form.name,
        type: form.type,
        unit: form.unit,
        currentAmount: parseFloat(form.qty) || 0,
        minimumAllowedAmount: parseFloat(form.minQty) || 0,
        buyPrice: parseFloat(form.price) || 0,
        supplierId: parseInt(form.supplierId),
      });
      setShowModal(false);
      setForm(emptyForm);
      toast.success(`تمت إضافة الخامة "${form.name}" بنجاح`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ الخامة");
    } finally {
      setSaving(false);
    }
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
          { label: "مخزون كافٍ", value: materials.filter((m) => m.currentAmount > m.minimumAllowedAmount).length, color: "text-green-600" },
          { label: "مخزون منخفض", value: lowStock, color: "text-red-600" },
          { label: "قيمة المخزون التقديرية", value: `${materials.reduce((sum, m) => sum + (m.currentAmount * m.buyPrice), 0).toLocaleString()} ريال`, color: "text-purple-600" },
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
              const isLow = m.currentAmount <= m.minimumAllowedAmount;
              return (
                <tr key={m.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                  <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{m.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {isLow && <AlertTriangle className="inline w-3.5 h-3.5 text-red-500 ml-1.5" />}
                    {m.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[m.type] || "bg-slate-100 text-slate-600"}`}>{m.type}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{m.unit}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold text-sm ${isLow ? "text-red-600" : "text-slate-800"}`}>
                      {m.currentAmount} {m.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{m.minimumAllowedAmount} {m.unit}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{m.buyPrice?.toLocaleString()} ريال/{m.unit}</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{m.suplier?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">-</td>
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
            <FormField label="المورد" required>
              <select value={form.supplierId} onChange={(e) => set("supplierId", e.target.value)} className={selectCls}>
                <option value="">اختر المورد...</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </FormField>
          </div>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="إضافة الخامة" loading={saving} />
      </Modal>
    </div>
  );
}

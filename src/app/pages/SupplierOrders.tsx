import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Eye, Filter, Calendar, Package } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls, textareaCls } from "../components/Modal";
import api from "../../services/api";

const formatNum = (n: number) => n.toLocaleString("ar-SA");

export function SupplierOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplierId: "", notes: "", materialId: "", quantity: "", price: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordRes, supRes, matRes] = await Promise.all([
        api.get('/supplier-orders'),
        api.get('/suppliers'),
        api.get('/materials'),
      ]);
      setOrders(ordRes.data);
      setSuppliers(supRes.data);
      setMaterials(matRes.data);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const filtered = orders.filter((o: any) =>
    o.suplier?.name?.includes(search) || o.id.toString().includes(search)
  );

  const handleSave = async () => {
    if (!form.supplierId || !form.materialId || !form.quantity || !form.price) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    setSaving(true);
    try {
      await api.post('/supplier-orders', {
        supplierId: parseInt(form.supplierId),
        notes: form.notes || null,
        items: [{
          materialId: parseInt(form.materialId),
          quantity: parseInt(form.quantity),
          price: parseInt(form.price),
        }],
      });
      setShowModal(false);
      setForm({ supplierId: "", notes: "", materialId: "", quantity: "", price: "" });
      toast.success("تم إنشاء أمر التوريد بنجاح");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">أوامر التوريد</h1>
          <p className="text-slate-500 text-sm mt-0.5">إجمالي {orders.length} أمر توريد</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/suppliers")}
            className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            الموردين
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            أمر توريد جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "إجمالي الأوامر", value: orders.length, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "إجمالي الخامات المطلوبة", value: orders.reduce((sum, o) => sum + (o.items?.length || 0), 0), color: "text-purple-600", bg: "bg-purple-50" },
          { label: "إجمالي قيمة الأوامر", value: formatNum(orders.reduce((sum, o) => sum + (o.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0), 0)) + " ريال", color: "text-green-600", bg: "bg-green-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-100`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالرقم أو اسم المورد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-slate-50 rounded-lg pr-9 pl-4 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["رقم الأمر", "المورد", "تاريخ الأمر", "عدد الخامات", "الإجمالي", "ملاحظات", ""].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o: any) => {
                const total = o.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0;
                return (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{o.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{o.suplier?.name}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(o.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                        <Package className="w-3 h-3 inline ml-1" />
                        {o.items?.length || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-green-600 font-semibold text-xs">{formatNum(total)} ريال</td>
                    <td className="py-3 px-4 text-slate-500 text-xs max-w-[200px] truncate">{o.notes || "—"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/suppliers/${o.suplier?.id || o.supplierId}`)}
                        className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:text-[#1E40AF]"
                      >
                        <Eye className="w-3.5 h-3.5" /> عرض المورد
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">لا توجد أوامر توريد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded items for each order */}
      {filtered.map((o: any) => (
        <div key={`items-${o.id}`} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
            <h4 className="text-xs font-bold text-slate-600">تفاصيل أمر التوريد #{o.id} — {o.suplier?.name}</h4>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["الخامة", "الكمية", "سعر الوحدة", "الإجمالي"].map((h) => (
                  <th key={h} className="text-right py-2 px-4 text-xs font-semibold text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {o.items?.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-50">
                  <td className="py-2 px-4 text-slate-700 text-xs font-medium">{item.material?.name}</td>
                  <td className="py-2 px-4 text-slate-600 text-xs">{formatNum(item.quantity)}</td>
                  <td className="py-2 px-4 text-slate-600 text-xs">{formatNum(item.price)} ريال</td>
                  <td className="py-2 px-4 text-green-600 font-semibold text-xs">{formatNum(item.price * item.quantity)} ريال</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* New Supplier Order Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="أمر توريد جديد" width="max-w-xl">
        <div className="space-y-4">
          <FormField label="المورد" required>
            <select value={form.supplierId} onChange={(e) => set("supplierId", e.target.value)} className={selectCls}>
              <option value="">اختر المورد...</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="الخامة" required>
              <select value={form.materialId} onChange={(e) => {
                set("materialId", e.target.value);
                const mat = materials.find((m: any) => m.id === parseInt(e.target.value));
                if (mat) set("price", mat.buyPrice.toString());
              }} className={selectCls}>
                <option value="">اختر الخامة...</option>
                {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </FormField>
            <FormField label="الكمية" required>
              <input value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="مثال: 100" className={inputCls} type="number" />
            </FormField>
            <FormField label="سعر الوحدة" required>
              <input value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="ريال" className={inputCls} type="number" />
            </FormField>
          </div>
          <FormField label="ملاحظات">
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="ملاحظات إضافية..." className={textareaCls} rows={2} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="إنشاء أمر التوريد" loading={saving} />
      </Modal>
    </div>
  );
}

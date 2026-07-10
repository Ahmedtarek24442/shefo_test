import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Filter, Eye, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls, textareaCls } from "../components/Modal";
import api from "../../services/api";

const stageNames: Record<string, string> = {
  "DESIGN": "قيد التصميم",
  "PRINTING": "الطباعة",
  "DIE_CUTTING": "الداي كت",
  "PACKAGING": "التعبئة",
  "DELIVERY": "التسليم",
};

const stageColors: Record<string, string> = {
  "DESIGN": "bg-purple-100 text-purple-700",
  "PRINTING": "bg-yellow-100 text-yellow-700",
  "DIE_CUTTING": "bg-orange-100 text-orange-700",
  "PACKAGING": "bg-blue-100 text-blue-700",
  "DELIVERY": "bg-green-100 text-green-700",
};

const emptyForm = {
  clientId: "", productId: "", qty: "", notes: "", deadline: "",
};

export function WorkOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordRes, cliRes, prodRes] = await Promise.all([
        api.get('/orders'),
        api.get('/clients'),
        api.get('/products')
      ]);
      setOrders(ordRes.data);
      setClients(cliRes.data);
      setProducts(prodRes.data);
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

  const filtered = orders.filter((o) => {
    const matchSearch = o.client?.companyName?.includes(search) || o.id.toString().includes(search);
    const orderStatus = o.currentStage === "DELIVERY" ? "مكتمل" : "جاري";
    const matchStatus = filterStatus === "الكل" || orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    if (!form.clientId || !form.productId || !form.qty) {
      toast.error("يرجى تعبئة الحقول المطلوبة (العميل، المنتج، الكمية)");
      return;
    }
    setSaving(true);
    try {
      await api.post('/orders', {
        clientId: parseInt(form.clientId),
        notes: form.notes,
        items: [{
          productId: parseInt(form.productId),
          quantity: parseInt(form.qty),
        }],
      });
      setShowModal(false);
      setForm(emptyForm);
      toast.success(`تم إنشاء أمر التشغيل بنجاح`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ أمر التشغيل");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">أوامر التشغيل</h1>
          <p className="text-slate-500 text-sm mt-0.5">إجمالي {orders.length} أمر تشغيل</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          أمر تشغيل جديد
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم الأمر أو العميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-slate-50 rounded-lg pr-9 pl-4 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {["الكل", "جاري", "مكتمل", "متأخر"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s ? "bg-[#2563EB] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {["رقم الأمر", "العميل", "المنتج", "المقاس", "الكمية", "النوع", "المرحلة الحالية", "الحالة", "تاريخ الطلب", "الموعد النهائي", ""].map((h) => (
                <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const product = o.items?.[0]?.product;
              const statusStr = o.currentStage === "DELIVERY" ? "مكتمل" : "جاري";
              return (
                <tr
                  key={o.id}
                  className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/work-orders/${o.id}`)}
                >
                  <td className="py-3 px-4 font-mono text-xs font-bold text-[#2563EB]">{o.id}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{o.client?.companyName}</td>
                  <td className="py-3 px-4 text-slate-600">{product?.name}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs font-mono">{product?.size || "-"}</td>
                  <td className="py-3 px-4 text-slate-700">{o.items?.reduce((acc: number, cur: any) => acc + cur.quantity, 0).toLocaleString("ar-EG")}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{product?.type || "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColors[o.currentStage] || stageColors['DESIGN']}`}>{stageNames[o.currentStage] || o.currentStage}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStr === 'مكتمل' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{statusStr}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{new Date(o.createdAt || Date.now()).toLocaleDateString("ar-SA")}</td>
                  <td className="py-3 px-4 text-xs text-slate-500">-</td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/work-orders/${o.id}`)}
                      className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#1E40AF] font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      تفاصيل
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-12 text-slate-400">لا توجد أوامر تشغيل مطابقة للبحث</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stage summary */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-700 text-sm mb-4">توزيع الأوامر على مراحل الإنتاج</h3>
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.entries(stageNames).map(([stageKey, stageName]) => {
            const count = orders.filter((o) => o.currentStage === stageKey).length;
            return (
              <div key={stageKey} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1.5 text-sm font-bold ${stageColors[stageKey] || "bg-slate-100 text-slate-600"}`}>
                  {count}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">{stageName}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Order Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="أمر تشغيل جديد" width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العميل" required>
              <select value={form.clientId} onChange={(e) => set("clientId", e.target.value)} className={selectCls}>
                <option value="">اختر العميل...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
            </FormField>
            <FormField label="المنتج" required>
              <select value={form.productId} onChange={(e) => set("productId", e.target.value)} className={selectCls}>
                <option value="">اختر المنتج...</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField label="الكمية المطلوبة" required>
              <input value={form.qty} onChange={(e) => set("qty", e.target.value)} placeholder="مثال: 5000" className={inputCls} type="number" />
            </FormField>
          </div>

          <FormField label="ملاحظات إضافية">
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="أي ملاحظات أو متطلبات خاصة..." className={textareaCls} rows={3} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="إنشاء أمر التشغيل" loading={saving} />
      </Modal>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Phone, Mail, MapPin, Eye, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls } from "../components/Modal";
import api from "../../services/api";

const emptyForm = { name: "", phone: "", email: "", address: "", taxNumber: "" };

export function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل الموردين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const filtered = suppliers.filter(
    (s: any) => s.name?.includes(search) || s.phone?.includes(search) || s.address?.includes(search)
  );

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast.error("يرجى تعبئة الحقول المطلوبة (الاسم، الهاتف)");
      return;
    }
    setSaving(true);
    try {
      await api.post('/suppliers', {
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        address: form.address || null,
        taxNumber: form.taxNumber || null,
      });
      setShowModal(false);
      setForm(emptyForm);
      toast.success(`تمت إضافة المورد "${form.name}" بنجاح`);
      fetchSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ المورد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الموردين</h1>
          <p className="text-slate-500 text-sm mt-0.5">إجمالي {suppliers.length} مورد</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/supplier-orders")}
            className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            أوامر التوريد
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            مورد جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "إجمالي الموردين", value: suppliers.length, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "إجمالي الخامات", value: suppliers.reduce((sum, s) => sum + (s._count?.materials || 0), 0), color: "text-purple-600", bg: "bg-purple-50" },
          { label: "إجمالي أوامر التوريد", value: suppliers.reduce((sum, s) => sum + (s._count?.orders || 0), 0), color: "text-green-600", bg: "bg-green-50" },
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
            placeholder="بحث بالاسم أو الهاتف..."
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
                {["#", "اسم المورد", "الهاتف", "البريد", "العنوان", "عدد الخامات", "أوامر التوريد", ""].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-50 hover:bg-blue-50/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/suppliers/${s.id}`)}
                >
                  <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{s.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{s.name}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {s.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    {s.email ? (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {s.email}
                      </div>
                    ) : "—"}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {s.address || "—"}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                      <Package className="w-3 h-3 inline ml-1" />
                      {s._count?.materials || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                      {s._count?.orders || 0} أمر
                    </span>
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/suppliers/${s.id}`)}
                      className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:text-[#1E40AF]"
                    >
                      <Eye className="w-3.5 h-3.5" /> عرض
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">لا يوجد موردين</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Supplier Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="إضافة مورد جديد" width="max-w-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="اسم المورد" required>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="مثال: شركة الورق السعودية" className={inputCls} />
            </FormField>
            <FormField label="رقم الهاتف" required>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="٠٥٠-XXX-XXXX" className={inputCls} />
            </FormField>
            <FormField label="البريد الإلكتروني">
              <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@company.com" className={inputCls} type="email" />
            </FormField>
            <FormField label="الرقم الضريبي">
              <input value={form.taxNumber} onChange={(e) => set("taxNumber", e.target.value)} placeholder="٣٠٠-XXX-XXX" className={inputCls} />
            </FormField>
          </div>
          <FormField label="العنوان">
            <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="المدينة، الحي، الشارع..." className={inputCls} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="إضافة المورد" loading={saving} />
      </Modal>
    </div>
  );
}

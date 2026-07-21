import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Phone, MapPin, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";
import api from "../../services/api";
import { egyptCities } from "../../data/egyptCities";

const emptyForm = { name: "", phone: "", email: "", city: "", address: "", taxNo: "", creditLimit: "" };

export function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clients');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل العملاء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const filtered = customers.filter(
    (c: any) => c.companyName?.includes(search) || c.address?.includes(search) || c.phone?.includes(search)
  );

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast.error("يرجى تعبئة الحقول المطلوبة (الاسم، الهاتف)");
      return;
    }
    setSaving(true);
    try {
      await api.post('/clients', {
        companyName: form.name,
        phone: form.phone,
        email: form.email || null,
        address: form.address || form.city || null,
        taxNumber: form.taxNo || null,
        creditLimit: form.creditLimit ? parseFloat(form.creditLimit) : null,
        responsibleId:2, // Defaulting to the initial admin user ID
      });
      setShowModal(false);
      setForm(emptyForm);
      toast.success(`تمت إضافة العميل "${form.name}" بنجاح`);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ العميل");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">العملاء</h1>
          <p className="text-slate-500 text-sm mt-0.5">إجمالي {customers.length} عميل</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          عميل جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي العملاء", value: customers.length, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "عملاء نشطون", value: customers.filter((c: any) => c._count?.orders > 0).length, color: "text-green-600", bg: "bg-green-50" },
          { label: "إجمالي الطلبات", value: customers.reduce((sum, c) => sum + (c._count?.orders || 0), 0), color: "text-purple-600", bg: "bg-purple-50" },
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
            placeholder="بحث بالاسم أو المدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-slate-50 rounded-lg pr-9 pl-4 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["رقم العميل", "اسم الشركة", "الهاتف", "المدينة", "الطلبات", "الإيرادات", "آخر طلب", "الحالة", ""].map((h) => (
                <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any) => (
              <tr
                key={c.id}
                className="border-b border-slate-50 hover:bg-blue-50/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/customers/${c.id}`)}
              >
                <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{c.id}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{c.companyName}</td>
                <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {c.phone}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {c.address || "-"}
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-800">{c._count?.orders || 0}</td>
                <td className="py-3 px-4 text-green-600 font-semibold text-xs">-</td>
                <td className="py-3 px-4 text-slate-500 text-xs">-</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                    c._count?.orders > 0 ? "bg-green-100 text-green-700 border-green-200" :
                    "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>{c._count?.orders > 0 ? "نشط" : "جديد"}</span>
                </td>
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/customers/${c.id}`)}
                      className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:text-[#1E40AF]"
                    >
                      <Eye className="w-3.5 h-3.5" /> عرض
                    </button>
                    <button
                      onClick={() => navigate(`/customers/${c.id}/account-statement`)}
                      className="flex items-center gap-1 text-xs text-emerald-600 font-medium hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" /> كشف حساب
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Customer Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="إضافة عميل جديد" width="max-w-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="اسم الشركة" required>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="مثال: شركة النجاح التجارية" className={inputCls} />
            </FormField>
            <FormField label="رقم الهاتف" required>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="٠٥٠-XXX-XXXX" className={inputCls} />
            </FormField>
            <FormField label="البريد الإلكتروني">
              <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@company.com" className={inputCls} type="email" />
            </FormField>
            <FormField label="المدينة">
              <select value={form.city} onChange={(e) => set("city", e.target.value)} className={selectCls}>
                <option value="">اختر المدينة...</option>
                {egyptCities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </FormField>
            <FormField label="الرقم الضريبي">
              <input value={form.taxNo} onChange={(e) => set("taxNo", e.target.value)} placeholder="٣٠٠-XXX-XXX" className={inputCls} />
            </FormField>
          </div>
          <FormField label="العنوان التفصيلي">
            <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="الحي، الشارع، المبنى..." className={inputCls} />
          </FormField>
          <FormField label="حد الائتمان (ريال)">
            <input value={form.creditLimit} onChange={(e) => set("creditLimit", e.target.value)} placeholder="مثال: 100000" className={inputCls} type="number" />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="إضافة العميل" loading={saving} />
      </Modal>
    </div>
  );
}

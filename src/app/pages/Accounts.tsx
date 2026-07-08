import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";

const customers = ["شركة الفهد التجارية", "مؤسسة النور للتغليف", "شركة الأمل الصناعية", "مصنع الجودة للكرتون", "شركة التميز التجارية", "شركة الريادة للأغذية"];

const initialInvoices = [
  { id: "INV-2024-0086", customer: "شركة الفهد التجارية", order: "WO-2024-0086", amount: "٢٨,٥٠٠", date: "٢٥/٠٦/٢٠٢٤", due: "٢٥/٠٧/٢٠٢٤", paid: "—", status: "مستحقة" },
  { id: "INV-2024-0085", customer: "مؤسسة النور للتغليف", order: "WO-2024-0085", amount: "١٨,٢٠٠", date: "٢٤/٠٦/٢٠٢٤", due: "٢٤/٠٧/٢٠٢٤", paid: "٢٤/٠٦/٢٠٢٤", status: "مدفوعة" },
  { id: "INV-2024-0083", customer: "مصنع الجودة للكرتون", order: "WO-2024-0083", amount: "١٤,٤٠٠", date: "٢٣/٠٦/٢٠٢٤", due: "٢٣/٠٦/٢٠٢٤", paid: "—", status: "متأخرة" },
  { id: "INV-2024-0082", customer: "شركة التميز التجارية", order: "WO-2024-0082", amount: "٣٢,٤٠٠", date: "٢٣/٠٦/٢٠٢٤", due: "٢٣/٠٧/٢٠٢٤", paid: "—", status: "مستحقة" },
  { id: "INV-2024-0081", customer: "شركة الريادة للأغذية", order: "WO-2024-0081", amount: "٥٢,٠٠٠", date: "٢٢/٠٦/٢٠٢٤", due: "٢٢/٠٧/٢٠٢٤", paid: "٢٤/٠٦/٢٠٢٤", status: "مدفوعة" },
  { id: "INV-2024-0079", customer: "شركة الفهد التجارية", order: "WO-2024-0079", amount: "٢٢,٤٠٠", date: "٢١/٠٦/٢٠٢٤", due: "٢١/٠٧/٢٠٢٤", paid: "—", status: "مستحقة" },
];

const monthlyRevenue = [
  { month: "يناير", revenue: 185, cost: 120, profit: 65 },
  { month: "فبراير", revenue: 210, cost: 135, profit: 75 },
  { month: "مارس", revenue: 195, cost: 130, profit: 65 },
  { month: "أبريل", revenue: 230, cost: 148, profit: 82 },
  { month: "مايو", revenue: 218, cost: 140, profit: 78 },
  { month: "يونيو", revenue: 240, cost: 153, profit: 87 },
];

const statusStyle: Record<string, string> = {
  "مدفوعة": "bg-green-100 text-green-700 border-green-200",
  "مستحقة": "bg-blue-100 text-blue-700 border-blue-200",
  "متأخرة": "bg-red-100 text-red-700 border-red-200",
};

const emptyForm = { customer: "", order: "", amount: "", due: "", notes: "" };

export function Accounts() {
  const [tab, setTab] = useState<"invoices" | "chart">("invoices");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleNewInvoice = () => {
    if (!form.customer || !form.amount) {
      toast.error("يرجى تحديد العميل والمبلغ");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newId = `INV-2024-${String(invoices.length + 87).padStart(4, "0")}`;
      const today = new Date().toLocaleDateString("ar-SA");
      setInvoices((prev) => [
        { id: newId, customer: form.customer, order: form.order || "—", amount: form.amount, date: today, due: form.due || "—", paid: "—", status: "مستحقة" },
        ...prev,
      ]);
      setSaving(false);
      setShowNewModal(false);
      setForm(emptyForm);
      toast.success(`تم إنشاء الفاتورة ${newId} بنجاح`);
    }, 700);
  };

  const handleMarkPaid = (id: string) => {
    const today = new Date().toLocaleDateString("ar-SA");
    setInvoices((prev) =>
      prev.map((inv) => inv.id === id ? { ...inv, status: "مدفوعة", paid: today } : inv)
    );
    toast.success(`تم تسجيل السداد للفاتورة ${id}`);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الحسابات</h1>
          <p className="text-slate-500 text-sm mt-0.5">إدارة الفواتير والمدفوعات</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          فاتورة جديدة
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الفواتير", value: `${invoices.length} فاتورة`, icon: FileText, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "مدفوع", value: `${invoices.filter((i) => i.status === "مدفوعة").length} فواتير`, icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
          { label: "مستحق", value: `${invoices.filter((i) => i.status === "مستحقة").length} فواتير`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "متأخر السداد", value: `${invoices.filter((i) => i.status === "متأخرة").length} فواتير`, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-9 h-9 ${k.bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <div>
                <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
                <p className="text-xs text-slate-500">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ key: "invoices", label: "الفواتير" }, { key: "chart", label: "الإيرادات والأرباح" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "invoices" | "chart")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-[#2563EB] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "invoices" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["رقم الفاتورة", "العميل", "أمر التشغيل", "المبلغ", "تاريخ الفاتورة", "تاريخ الاستحقاق", "تاريخ السداد", "الحالة", ""].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{inv.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{inv.customer}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">{inv.order}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{inv.amount} ريال</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{inv.date}</td>
                  <td className="py-3 px-4 text-xs">
                    <span className={inv.status === "متأخرة" ? "text-red-600 font-semibold" : "text-slate-500"}>{inv.due}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{inv.paid}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyle[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    {inv.status !== "مدفوعة" && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="text-xs text-green-600 border border-green-200 px-2 py-0.5 rounded hover:bg-green-50 transition-colors font-medium"
                      >
                        تسجيل سداد
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">الإيرادات والتكاليف والأرباح (ألف ريال)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
              <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} name="الإيرادات" />
              <Bar dataKey="cost" fill="#F59E0B" radius={[4, 4, 0, 0]} name="التكاليف" />
              <Bar dataKey="profit" fill="#16A34A" radius={[4, 4, 0, 0]} name="الأرباح" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* New Invoice Modal */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="فاتورة جديدة">
        <div className="space-y-4">
          <FormField label="العميل" required>
            <select value={form.customer} onChange={(e) => setF("customer", e.target.value)} className={selectCls}>
              <option value="">اختر العميل...</option>
              {customers.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="رقم أمر التشغيل">
              <input value={form.order} onChange={(e) => setF("order", e.target.value)} placeholder="WO-2024-XXXX" className={inputCls} />
            </FormField>
            <FormField label="المبلغ الإجمالي (ريال)" required>
              <input value={form.amount} onChange={(e) => setF("amount", e.target.value)} placeholder="0" className={inputCls} type="number" />
            </FormField>
          </div>
          <FormField label="تاريخ الاستحقاق">
            <input value={form.due} onChange={(e) => setF("due", e.target.value)} className={inputCls} type="date" />
          </FormField>
          <FormField label="ملاحظات">
            <input value={form.notes} onChange={(e) => setF("notes", e.target.value)} placeholder="ملاحظات إضافية..." className={inputCls} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowNewModal(false)} onConfirm={handleNewInvoice} confirmLabel="إنشاء الفاتورة" loading={saving} />
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Filter, Eye, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls, textareaCls } from "../components/Modal";

const initialOrders = [
  { id: "WO-2024-0086", customer: "شركة الفهد التجارية", product: "صندوق ٤٠×٣٠×٢٠", size: "٤٠×٣٠×٢٠", qty: 5000, color: "بني", type: "مموج ثلاثي", stage: "الطباعة", stageIdx: 2, status: "جاري", date: "٢٥/٠٦/٢٠٢٤", deadline: "٣٠/٠٦/٢٠٢٤" },
  { id: "WO-2024-0085", customer: "مؤسسة النور للتغليف", product: "كرتون مطبوع بالألوان", size: "٣٥×٢٥×١٥", qty: 3000, color: "أبيض مطبوع", type: "مموج مفرد", stage: "التسليم", stageIdx: 7, status: "مكتمل", date: "٢٤/٠٦/٢٠٢٤", deadline: "٢٤/٠٦/٢٠٢٤" },
  { id: "WO-2024-0084", customer: "شركة الأمل الصناعية", product: "كرتون مقوى مزدوج", size: "٦٠×٤٠×٣٠", qty: 7000, color: "بني", type: "مموج خماسي", stage: "الداي كت", stageIdx: 3, status: "جاري", date: "٢٤/٠٦/٢٠٢٤", deadline: "٢٨/٠٦/٢٠٢٤" },
  { id: "WO-2024-0083", customer: "مصنع الجودة للكرتون", product: "علب هدايا فاخرة", size: "٣٠×٢٠×١٠", qty: 2000, color: "أسود مطبوع", type: "مقوى صلب", stage: "أمر توريد", stageIdx: 0, status: "متأخر", date: "٢٣/٠٦/٢٠٢٤", deadline: "٢٢/٠٦/٢٠٢٤" },
  { id: "WO-2024-0082", customer: "شركة التميز التجارية", product: "صندوق شحن دولي", size: "٥٠×٤٠×٤٠", qty: 4500, color: "بني", type: "مموج ثلاثي", stage: "اللصق", stageIdx: 5, status: "جاري", date: "٢٣/٠٦/٢٠٢٤", deadline: "٢٧/٠٦/٢٠٢٤" },
  { id: "WO-2024-0081", customer: "شركة الريادة للأغذية", product: "علب أغذية مبردة", size: "٢٥×٢٠×١٥", qty: 10000, color: "أبيض", type: "مموج مفرد مطقم", stage: "البرنز", stageIdx: 4, status: "جاري", date: "٢٢/٠٦/٢٠٢٤", deadline: "٢٦/٠٦/٢٠٢٤" },
  { id: "WO-2024-0080", customer: "مؤسسة الخليج للتصدير", product: "صندوق تصدير مقوى", size: "٨٠×٦٠×٦٠", qty: 1500, color: "بني", type: "مموج سباعي", stage: "التصميم", stageIdx: 1, status: "جاري", date: "٢٢/٠٦/٢٠٢٤", deadline: "٢٩/٠٦/٢٠٢٤" },
  { id: "WO-2024-0079", customer: "شركة الفهد التجارية", product: "صندوق عرض بداي كت", size: "٤٥×٣٥×٢٠", qty: 3500, color: "ملون متعدد", type: "مموج مفرد", stage: "التعبئة", stageIdx: 6, status: "جاري", date: "٢١/٠٦/٢٠٢٤", deadline: "٢٥/٠٦/٢٠٢٤" },
];

const stages = ["أمر توريد", "التصميم", "الطباعة", "الداي كت", "البرنز", "اللصق", "التعبئة", "التسليم"];

const statusStyle: Record<string, string> = {
  "جاري": "bg-blue-100 text-blue-700 border border-blue-200",
  "مكتمل": "bg-green-100 text-green-700 border border-green-200",
  "متأخر": "bg-red-100 text-red-700 border border-red-200",
};

const stageColors = [
  "bg-slate-200 text-slate-600",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-yellow-100 text-yellow-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
  "bg-indigo-100 text-indigo-700",
  "bg-green-100 text-green-700",
];

const customers = ["شركة الفهد التجارية", "مؤسسة النور للتغليف", "شركة الأمل الصناعية", "مصنع الجودة للكرتون", "شركة التميز التجارية", "شركة الريادة للأغذية", "مؤسسة الخليج للتصدير", "شركة البناء الوطنية"];

const emptyForm = {
  customer: "", product: "", width: "", height: "", depth: "",
  qty: "", color: "", type: "", source: "", notes: "", deadline: "",
};

export function WorkOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.includes(search) || o.product.includes(search) || o.id.includes(search);
    const matchStatus = filterStatus === "الكل" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    if (!form.customer || !form.product || !form.qty) {
      toast.error("يرجى تعبئة الحقول المطلوبة (العميل، المنتج، الكمية)");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newId = `WO-2024-${String(orders.length + 87).padStart(4, "0")}`;
      const today = new Date().toLocaleDateString("ar-SA");
      setOrders((prev) => [
        {
          id: newId,
          customer: form.customer,
          product: form.product,
          size: `${form.width}×${form.height}×${form.depth}`,
          qty: parseInt(form.qty) || 0,
          color: form.color,
          type: form.type,
          stage: "أمر توريد",
          stageIdx: 0,
          status: "جاري",
          date: today,
          deadline: form.deadline || "—",
        },
        ...prev,
      ]);
      setSaving(false);
      setShowModal(false);
      setForm(emptyForm);
      toast.success(`تم إنشاء أمر التشغيل ${newId} بنجاح`);
    }, 800);
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
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/work-orders/${o.id}`)}
              >
                <td className="py-3 px-4 font-mono text-xs font-bold text-[#2563EB]">{o.id}</td>
                <td className="py-3 px-4 text-slate-800 font-medium">{o.customer}</td>
                <td className="py-3 px-4 text-slate-600">{o.product}</td>
                <td className="py-3 px-4 text-slate-500 text-xs font-mono">{o.size}</td>
                <td className="py-3 px-4 text-slate-700">{o.qty.toLocaleString("ar-EG")}</td>
                <td className="py-3 px-4 text-slate-500 text-xs">{o.type}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColors[o.stageIdx]}`}>{o.stage}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[o.status]}`}>{o.status}</span>
                </td>
                <td className="py-3 px-4 text-slate-500 text-xs">{o.date}</td>
                <td className="py-3 px-4 text-xs">
                  <span className={o.status === "متأخر" ? "text-red-600 font-semibold" : "text-slate-500"}>{o.deadline}</span>
                </td>
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
            ))}
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
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {stages.map((stage, i) => {
            const count = orders.filter((o) => o.stageIdx === i).length;
            return (
              <div key={stage} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1.5 text-sm font-bold ${stageColors[i]}`}>
                  {count}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">{stage}</p>
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
              <select value={form.customer} onChange={(e) => set("customer", e.target.value)} className={selectCls}>
                <option value="">اختر العميل...</option>
                {customers.map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="البيان / اسم المنتج" required>
              <input value={form.product} onChange={(e) => set("product", e.target.value)} placeholder="مثال: صندوق كرتون مموج" className={inputCls} />
            </FormField>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-600">المقاسات (سم)</p>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="العرض">
                <input value={form.width} onChange={(e) => set("width", e.target.value)} placeholder="مثال: ٤٠" className={inputCls} type="number" />
              </FormField>
              <FormField label="الطول">
                <input value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="مثال: ٣٠" className={inputCls} type="number" />
              </FormField>
              <FormField label="الارتفاع">
                <input value={form.depth} onChange={(e) => set("depth", e.target.value)} placeholder="مثال: ٢٠" className={inputCls} type="number" />
              </FormField>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="الكمية (قطعة)" required>
              <input value={form.qty} onChange={(e) => set("qty", e.target.value)} placeholder="مثال: 5000" className={inputCls} type="number" />
            </FormField>
            <FormField label="اللون">
              <input value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="مثال: بني طبيعي" className={inputCls} />
            </FormField>
            <FormField label="نوع الكرتون">
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
                <option value="">اختر النوع...</option>
                {["مموج مفرد", "مموج ثلاثي", "مموج خماسي", "مموج سباعي", "مقوى صلب", "مموج مفرد مطقم"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="مصدر الاستلام">
              <select value={form.source} onChange={(e) => set("source", e.target.value)} className={selectCls}>
                <option value="">اختر المصدر...</option>
                {["مندوب المبيعات", "واتساب", "بريد إلكتروني", "هاتف", "زيارة مباشرة"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="الموعد النهائي للتسليم">
            <input value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className={inputCls} type="date" />
          </FormField>

          <FormField label="ملاحظات إضافية">
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="أي ملاحظات أو متطلبات خاصة..." className={textareaCls} rows={3} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="إنشاء أمر التشغيل" loading={saving} />
      </Modal>
    </div>
  );
}

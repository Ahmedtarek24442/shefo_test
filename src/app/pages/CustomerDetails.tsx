import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronRight, Phone, MapPin, Mail, Building, TrendingUp, Package, Clock } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";

const customerData: Record<string, {
  id: string; name: string; contact: string; phone: string; email: string;
  city: string; address: string; taxNo: string; creditLimit: string;
  totalOrders: number; totalRevenue: string; totalProfit: string;
  orders: { id: string; product: string; qty: string; date: string; amount: string; profit: string; status: string; stage: string }[];
}> = {
  "C001": {
    id: "C001", name: "شركة الفهد التجارية", contact: "عبدالله الفهد",
    phone: "٠٥٠-١٢٣-٤٥٦٧", email: "info@alfhd.com",
    city: "الرياض", address: "حي العليا، شارع الملك فهد",
    taxNo: "٣٠٠-١٢٣-٤٥٦", creditLimit: "٢٠٠,٠٠٠ ريال",
    totalOrders: 45, totalRevenue: "٤٥٠,٠٠٠", totalProfit: "١٣٠,٥٠٠",
    orders: [
      { id: "WO-2024-0086", product: "صندوق ٤٠×٣٠×٢٠", qty: "٥٠٠٠", date: "٢٥/٠٦/٢٠٢٤", amount: "٢٨,٥٠٠", profit: "٨,٢٠٠", status: "جاري", stage: "الطباعة" },
      { id: "WO-2024-0079", product: "صندوق عرض بداي كت", qty: "٣٥٠٠", date: "٢١/٠٦/٢٠٢٤", amount: "٢٢,٤٠٠", profit: "٦,٥٠٠", status: "جاري", stage: "التعبئة" },
      { id: "WO-2024-0067", product: "كرتون مقوى ثلاثي", qty: "٨٠٠٠", date: "١٠/٠٦/٢٠٢٤", amount: "٤٨,٠٠٠", profit: "١٣,٨٠٠", status: "مكتمل", stage: "التسليم" },
      { id: "WO-2024-0054", product: "علب هدايا مطبوعة", qty: "٢٠٠٠", date: "٠١/٠٦/٢٠٢٤", amount: "١٦,٨٠٠", profit: "٤,٩٠٠", status: "مكتمل", stage: "التسليم" },
      { id: "WO-2024-0041", product: "صندوق شحن مزدوج", qty: "٦٠٠٠", date: "٢٠/٠٥/٢٠٢٤", amount: "٣٦,٠٠٠", profit: "١٠,٤٠٠", status: "مكتمل", stage: "التسليم" },
    ],
  },
};

const defaultCustomer = customerData["C001"];

const statusStyle: Record<string, string> = {
  "جاري": "bg-blue-100 text-blue-700 border-blue-200",
  "مكتمل": "bg-green-100 text-green-700 border-green-200",
  "متأخر": "bg-red-100 text-red-700 border-red-200",
};

export function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const customer = customerData[id ?? ""] ?? defaultCustomer;
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(customer.name);
  const [editContact, setEditContact] = useState(customer.contact);
  const [editPhone, setEditPhone] = useState(customer.phone);
  const [editEmail, setEditEmail] = useState(customer.email);

  return (
    <div className="space-y-5" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => navigate("/customers")} className="text-slate-500 hover:text-slate-700">العملاء</button>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-bold text-slate-800">{customer.name}</span>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center shrink-0">
              <Building className="w-8 h-8 text-[#2563EB]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{customer.name}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{customer.contact} — مدير المشتريات</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> {customer.phone}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" /> {customer.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> {customer.city} — {customer.address}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            تعديل البيانات
          </button>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">الرقم الضريبي</p>
            <p className="font-semibold text-slate-700 text-sm mt-0.5">{customer.taxNo}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">حد الائتمان</p>
            <p className="font-semibold text-slate-700 text-sm mt-0.5">{customer.creditLimit}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">إجمالي الطلبات</p>
            <p className="font-semibold text-[#2563EB] text-sm mt-0.5">{customer.totalOrders} طلب</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">تاريخ التسجيل</p>
            <p className="font-semibold text-slate-700 text-sm mt-0.5">١٥ مارس ٢٠٢٢</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{customer.totalOrders}</p>
              <p className="text-xs text-slate-500">إجمالي الطلبات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{customer.totalRevenue}</p>
              <p className="text-xs text-slate-500">إجمالي الإيرادات (ريال)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{customer.totalProfit}</p>
              <p className="text-xs text-slate-500">إجمالي الأرباح (ريال)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders timeline */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">سجل الطلبات</h3>
          <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{customer.orders.length} طلبات</span>
        </div>
        <div className="p-5 space-y-3">
          {customer.orders.map((order, idx) => (
            <div
              key={order.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#2563EB]/30 hover:bg-blue-50/20 cursor-pointer transition-all group"
              onClick={() => navigate(`/work-orders/${order.id}`)}
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-3 h-3 rounded-full ${order.status === "مكتمل" ? "bg-green-500" : order.status === "جاري" ? "bg-[#2563EB]" : "bg-red-500"}`} />
                {idx < customer.orders.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
              </div>

              {/* Order info */}
              <div className="flex-1 flex items-center gap-6">
                <div>
                  <p className="font-mono text-xs font-bold text-[#2563EB]">{order.id}</p>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">{order.product}</p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>الكمية: <span className="font-semibold text-slate-700">{order.qty} قطعة</span></p>
                  <p className="mt-0.5">التاريخ: {order.date}</p>
                </div>
                <div className="text-xs">
                  <p className="text-slate-500">المبلغ: <span className="font-bold text-slate-800">{order.amount} ريال</span></p>
                  <p className="text-slate-500 mt-0.5">الربح: <span className="font-bold text-green-600">{order.profit} ريال</span></p>
                </div>
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyle[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">المرحلة: {order.stage}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Customer Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="تعديل بيانات العميل">
        <div className="space-y-4">
          <FormField label="اسم الشركة" required>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} />
          </FormField>
          <FormField label="جهة الاتصال" required>
            <input value={editContact} onChange={(e) => setEditContact(e.target.value)} className={inputCls} />
          </FormField>
          <FormField label="رقم الهاتف">
            <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className={inputCls} />
          </FormField>
          <FormField label="البريد الإلكتروني">
            <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className={inputCls} type="email" />
          </FormField>
          <FormField label="المدينة">
            <select className={selectCls} defaultValue={customer.city}>
              {["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </FormField>
        </div>
        <ModalFooter
          onClose={() => setShowEdit(false)}
          onConfirm={() => {
            setShowEdit(false);
            toast.success("تم تحديث بيانات العميل بنجاح");
          }}
          confirmLabel="حفظ التعديلات"
        />
      </Modal>
    </div>
  );
}

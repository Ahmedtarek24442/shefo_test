import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronRight, Phone, MapPin, Mail, Building, TrendingUp, Package, Clock } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";
import api from "../../services/api";
import { egyptCities } from "../../data/egyptCities";

const stageNames: Record<string, string> = {
  "SUPPLY_ORDER": "أمر التوريد",
  "DESIGN": "التصميم",
  "PRINTING": "الطباعة",
  "PACKAGING": "التعبئة",
  "DELIVERY": "التسليم",
};

export function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ companyName: "", phone: "", email: "", city: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientRes = await api.get(`/clients/${id}`);
        setCustomer(clientRes.data);
        const c = clientRes.data;
        // The backend might be storing city in 'address' or we might need to separate them.
        // We'll keep it simple: assume 'city' is part of the address or we just let them pick a city and append it.
        // For now, let's add a dedicated city field to our edit form state.
        setEditForm({
          companyName: c.companyName || "",
          phone: c.phone || "",
          email: c.email || "",
          city: "", // Default to empty if we don't know it. If stored in address, user can re-select.
          address: c.address || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("حدث خطأ أثناء تحميل بيانات العميل");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        address: editForm.city ? `${editForm.city} - ${editForm.address}` : editForm.address,
      };
      await api.patch(`/clients/${id}`, payload);
      const res = await api.get(`/clients/${id}`);
      setCustomer(res.data);
      setShowEdit(false);
      toast.success("تم تحديث بيانات العميل بنجاح");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !customer) return <div className="p-8 text-center" dir="rtl">جاري التحميل...</div>;

  const totalOrders = customer.orders?.length || 0;
  const totalRevenue = customer.orders?.reduce((sum: number, order: any) => {
    return sum + order.items.reduce((s: number, item: any) => s + item.quantity * item.price, 0);
  }, 0) || 0;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => navigate("/customers")} className="text-slate-500 hover:text-slate-700">العملاء</button>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-bold text-slate-800">{customer.companyName}</span>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center shrink-0">
              <Building className="w-8 h-8 text-[#2563EB]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{customer.companyName}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{customer.responsible?.name || "—"}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> {customer.phone}
                </div>
                {customer.email && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" /> {customer.email}
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" /> {customer.address}
                  </div>
                )}
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
            <p className="font-semibold text-slate-700 text-sm mt-0.5">{customer.taxNumber || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">حد الائتمان</p>
            <p className="font-semibold text-slate-700 text-sm mt-0.5">
              {customer.creditLimit && customer.creditLimit > 0 ? `${customer.creditLimit.toLocaleString()} ريال` : "غير محدد"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">إجمالي الطلبات</p>
            <p className="font-semibold text-[#2563EB] text-sm mt-0.5">{totalOrders} طلب</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">رقم العميل</p>
            <p className="font-semibold text-slate-700 text-sm mt-0.5">#{customer.id}</p>
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
              <p className="text-2xl font-bold text-slate-800">{totalOrders}</p>
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
              <p className="text-2xl font-bold text-slate-800">{totalRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-slate-800">
                {customer.orders?.filter((o: any) => o.currentStage !== "DELIVERY").length || 0}
              </p>
              <p className="text-xs text-slate-500">طلبات جارية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders timeline */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">سجل الطلبات</h3>
          <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{totalOrders} طلبات</span>
        </div>
        <div className="p-5 space-y-3">
          {customer.orders?.length > 0 ? customer.orders.map((order: any, idx: number) => {
            const orderTotal = order.items?.reduce((s: number, i: any) => s + i.quantity * i.price, 0) || 0;
            const orderQty = order.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
            const deliveredQty = order.items?.reduce((s: number, i: any) => s + (i.deliveredQty || 0), 0) || 0;
            const remainingQty = Math.max(0, orderQty - deliveredQty);
            const totalPaid = order.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
            const restMoney = orderTotal - totalPaid;

            const productName = order.items?.map((i: any) => i.product?.name).join(" و ") || "—";
            const isCompleted = order.currentStage === "DELIVERY";
            const statusLabel = isCompleted ? "مكتمل" : "جاري";
            const statusCls = isCompleted
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-blue-100 text-blue-700 border-blue-200";

            return (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#2563EB]/30 hover:bg-blue-50/20 cursor-pointer transition-all group"
                onClick={() => navigate(`/work-orders/${order.id}`)}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-3 h-3 rounded-full ${isCompleted ? "bg-green-500" : "bg-[#2563EB]"}`} />
                  {idx < customer.orders.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
                </div>

                {/* Order info */}
                <div className="flex-1 flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-[150px]">
                    <p className="font-mono text-xs font-bold text-[#2563EB]">#{order.id}</p>
                    <p className="font-semibold text-slate-800 text-sm mt-0.5">{productName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">التاريخ: {new Date(order.createdAt).toLocaleDateString("ar-SA")}</p>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-500">الكمية المطلوبة: <span className="font-semibold text-slate-700">{orderQty.toLocaleString()} قطعة</span></p>
                    <p className="text-slate-500">المسلمة: <span className="font-semibold text-green-600">{deliveredQty.toLocaleString()}</span> | المتبقية: <span className="font-semibold text-red-600">{remainingQty.toLocaleString()}</span></p>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-500">قيمة الطلب: <span className="font-bold text-slate-800">{orderTotal.toLocaleString()} ريال</span></p>
                    <p className="text-slate-500">المسدد: <span className="font-semibold text-green-600">{totalPaid.toLocaleString()}</span> | المتبقي: <span className="font-semibold text-red-600">{restMoney.toLocaleString()} ريال</span></p>
                  </div>

                  <div className="text-left">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusCls}`}>
                      {statusLabel}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">المرحلة: {stageNames[order.currentStage] || order.currentStage}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] transition-colors shrink-0" />
              </div>
            );
          }) : (
            <div className="text-center py-8 text-slate-400 text-sm">لا توجد طلبات لهذا العميل</div>
          )}
        </div>
      </div>

      {/* Edit Customer Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="تعديل بيانات العميل">
        <div className="space-y-4">
          <FormField label="اسم الشركة" required>
            <input value={editForm.companyName} onChange={(e) => setEditForm(p => ({ ...p, companyName: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="رقم الهاتف">
            <input value={editForm.phone} onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="البريد الإلكتروني">
            <input value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} className={inputCls} type="email" />
          </FormField>
          <FormField label="المدينة">
            <select value={editForm.city} onChange={(e) => setEditForm(p => ({ ...p, city: e.target.value }))} className={selectCls}>
              <option value="">اختر المدينة...</option>
              {egyptCities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </FormField>
          <FormField label="العنوان (بدون المدينة)">
            <input value={editForm.address} onChange={(e) => setEditForm(p => ({ ...p, address: e.target.value }))} className={inputCls} />
          </FormField>
        </div>
        <ModalFooter
          onClose={() => setShowEdit(false)}
          onConfirm={handleSaveEdit}
          confirmLabel="حفظ التعديلات"
          loading={saving}
        />
      </Modal>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronRight, Phone, Mail, MapPin, Building, Package, ShoppingCart, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";

const formatNum = (n: number) => n.toLocaleString("ar-SA");

export function SupplierDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [supplier, setSupplier] = useState<any>(null);
  const [statement, setStatement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: "", method: "نقدي", notes: "" });
  const [savingPayment, setSavingPayment] = useState(false);

  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deliverForm, setDeliverForm] = useState<{
    amountPaid: string;
    method: string;
    notes: string;
    items: { materialId: number; materialName: string; quantity: number; deliveredQty: string }[];
  }>({ amountPaid: "", method: "نقدي", notes: "", items: [] });
  const [savingDeliver, setSavingDeliver] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [supRes, stmtRes] = await Promise.all([
        api.get(`/suppliers/${id}`),
        api.get(`/suppliers/${id}/account-statement`),
      ]);
      setSupplier(supRes.data);
      setStatement(stmtRes.data);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل بيانات المورد");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenDeliverModal = (order: any) => {
    setSelectedOrder(order);
    const items = order.items?.map((item: any) => ({
      materialId: item.material.id,
      materialName: item.material.name,
      quantity: item.quantity,
      deliveredQty: item.deliveredQty?.toString() || item.quantity.toString(),
    })) || [];

    const totalValue = order.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0;
    const totalPaid = order.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
    const rest = totalValue - totalPaid;

    setDeliverForm({
      amountPaid: rest > 0 ? rest.toString() : "0",
      method: "نقدي",
      notes: "",
      items,
    });
    setShowDeliverModal(true);
  };

  const handleSubmitDeliver = async () => {
    if (!selectedOrder) return;
    setSavingDeliver(true);
    try {
      const payload = {
        amountPaid: parseInt(deliverForm.amountPaid) || 0,
        method: deliverForm.method,
        notes: deliverForm.notes || `دفعة وتأكيد استلام خامات (أمر #${selectedOrder.id})`,
        items: deliverForm.items.map((i) => ({
          materialId: i.materialId,
          deliveredQty: parseInt(i.deliveredQty) || 0,
        })),
      };

      await api.post(`/supplier-orders/${selectedOrder.id}/deliver`, payload);
      toast.success("تم تأكيد الاستلام وتحديث المالية بنجاح");
      setShowDeliverModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally {
      setSavingDeliver(false);
    }
  };

  const handleNewPayment = async () => {
    if (!paymentForm.amount) {
      toast.error("يرجى إدخال المبلغ");
      return;
    }
    setSavingPayment(true);
    try {
      await api.post(`/suppliers/${id}/payments`, {
        amount: parseInt(paymentForm.amount),
        method: paymentForm.method,
        notes: paymentForm.notes || null,
      });
      toast.success("تم تسجيل الدفعة للمورد بنجاح");
      setShowPaymentModal(false);
      setPaymentForm({ amount: "", method: "نقدي", notes: "" });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally {
      setSavingPayment(false);
    }
  };

  if (loading || !supplier) {
    return (
      <div className="flex items-center justify-center h-[60vh]" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (!supplier) return <div dir="rtl" className="p-10 text-center text-slate-500">المورد غير موجود</div>;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => navigate("/suppliers")} className="text-slate-500 hover:text-slate-700">الموردين</button>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-bold text-slate-800">{supplier.name}</span>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center shrink-0">
              <Building className="w-8 h-8 text-[#2563EB]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{supplier.name}</h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> {supplier.phone}
                </div>
                {supplier.email && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" /> {supplier.email}
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" /> {supplier.address}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            تسجيل دفعة جديدة
          </button>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">الرقم الضريبي</p>
            <p className="font-semibold text-slate-700 text-sm mt-0.5">{supplier.taxNumber || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">عدد الخامات</p>
            <p className="font-semibold text-purple-600 text-sm mt-0.5">{supplier.materials?.length || 0} خامة</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">عدد أوامر التوريد</p>
            <p className="font-semibold text-green-600 text-sm mt-0.5">{supplier.orders?.length || 0} أمر</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{supplier.materials?.length || 0}</p>
              <p className="text-xs text-slate-500">خامات متاحة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{supplier.orders?.length || 0}</p>
              <p className="text-xs text-slate-500">أوامر التوريد</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatNum(statement?.summary?.totalPayments || 0)} ريال
              </p>
              <p className="text-xs text-slate-500">المسدد للمورد</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {formatNum(statement?.summary?.balance || 0)} ريال
              </p>
              <p className="text-xs text-slate-500">المتبقي المطلوب</p>
            </div>
          </div>
        </div>
      </div>

      {/* Materials table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">الخامات المتاحة</h3>
          <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{supplier.materials?.length || 0} خامة</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["اسم الخامة", "النوع", "الوحدة", "سعر الشراء", "المخزون الحالي", "الحد الأدنى"].map((h) => (
                <th key={h} className="text-right py-2.5 px-4 text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {supplier.materials?.map((m: any) => (
              <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-800">{m.name}</td>
                <td className="py-3 px-4 text-xs"><span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{m.type}</span></td>
                <td className="py-3 px-4 text-slate-600 text-xs">{m.unit}</td>
                <td className="py-3 px-4 text-green-600 font-semibold text-xs">{formatNum(m.buyPrice)} ريال</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold ${m.currentAmount <= m.minimumAllowedAmount ? "text-red-600" : "text-slate-800"}`}>
                    {formatNum(m.currentAmount)} {m.unit}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 text-xs">{formatNum(m.minimumAllowedAmount)} {m.unit}</td>
              </tr>
            ))}
            {(!supplier.materials || supplier.materials.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">لا توجد خامات لهذا المورد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Supplier orders */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">أوامر التوريد</h3>
          <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{supplier.orders?.length || 0} أمر</span>
        </div>
        <div className="p-5 space-y-3">
          {supplier.orders?.map((order: any) => {
            const orderTotal = order.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0;
            const orderQty = order.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
            const deliveredQty = order.items?.reduce((s: number, i: any) => s + (i.deliveredQty || 0), 0) || 0;
            const remainingQty = Math.max(0, orderQty - deliveredQty);
            const totalPaid = order.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
            const restMoney = orderTotal - totalPaid;

            return (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#2563EB]/30 hover:bg-blue-50/20 transition-all"
              >
                <div className="flex-1 flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#2563EB]">أمر توريد #{order.id}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</p>
                    {order.notes && (
                      <p className="text-xs text-slate-400 mt-1 max-w-[200px] truncate">{order.notes}</p>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-500">الكمية المطلوبة: <span className="font-semibold text-slate-700">{orderQty.toLocaleString()}</span></p>
                    <p className="text-slate-500">المستلمة: <span className="font-semibold text-green-600">{deliveredQty.toLocaleString()}</span> | المتبقية: <span className="font-semibold text-red-600">{remainingQty.toLocaleString()}</span></p>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-500">قيمة الأمر: <span className="font-bold text-slate-800">{formatNum(orderTotal)} ريال</span></p>
                    <p className="text-slate-500">المسدد: <span className="font-semibold text-green-600">{formatNum(totalPaid)}</span> | المتبقي: <span className="font-semibold text-red-600">{formatNum(restMoney)} ريال</span></p>
                  </div>

                  <div>
                    <button
                      onClick={() => handleOpenDeliverModal(order)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors font-medium"
                    >
                      تأكيد الاستلام والمالية
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {(!supplier.orders || supplier.orders.length === 0) && (
            <div className="text-center py-12 text-slate-400 text-sm">لا توجد أوامر توريد لهذا المورد</div>
          )}
        </div>
      </div>

      {/* New Payment Modal */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="تسجيل دفعة جديدة للمورد">
        <div className="space-y-4">
          <FormField label="المبلغ (ريال)" required>
            <input
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="مثال: 5000"
              className={inputCls}
            />
          </FormField>
          <FormField label="طريقة الدفع">
            <select
              value={paymentForm.method}
              onChange={(e) => setPaymentForm(p => ({ ...p, method: e.target.value }))}
              className={selectCls}
            >
              <option value="نقدي">نقدي</option>
              <option value="تحويل بنكي">تحويل بنكي</option>
              <option value="شيك">شيك</option>
            </select>
          </FormField>
          <FormField label="ملاحظات">
            <input
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="ملاحظات الدفع..."
              className={inputCls}
            />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowPaymentModal(false)} onConfirm={handleNewPayment} confirmLabel="تسجيل الدفعة" loading={savingPayment} />
      </Modal>

      {/* Deliver/Receive Order Modal */}
      <Modal open={showDeliverModal} onClose={() => setShowDeliverModal(false)} title="تأكيد استلام خامات ودفع مالية" width="max-w-xl">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 text-slate-600">
              <p>إجمالي قيمة الأمر: <span className="font-bold text-slate-800">{formatNum(selectedOrder.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0)} ريال</span></p>
              <p>المسدد سابقاً: <span className="font-bold text-green-600">{formatNum(selectedOrder.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0)} ريال</span></p>
              <p>المتبقي حالياً: <span className="font-bold text-red-600">{(selectedOrder.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) - (selectedOrder.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0)).toLocaleString("ar-SA")} ريال</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="المبلغ المسدد الآن (ريال)" required>
                <input
                  value={deliverForm.amountPaid}
                  onChange={(e) => setDeliverForm(p => ({ ...p, amountPaid: e.target.value }))}
                  className={inputCls}
                  type="number"
                />
              </FormField>
              <FormField label="طريقة الدفع">
                <select
                  value={deliverForm.method}
                  onChange={(e) => setDeliverForm(p => ({ ...p, method: e.target.value }))}
                  className={selectCls}
                >
                  <option value="نقدي">نقدي</option>
                  <option value="تحويل بنكي">تحويل بنكي</option>
                  <option value="شيك">شيك</option>
                </select>
              </FormField>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold text-slate-700 mb-2">تحديث الكميات المستلمة:</h4>
              <div className="space-y-3">
                {deliverForm.items.map((item, idx) => (
                  <div key={item.materialId} className="flex items-center justify-between gap-4 p-2 bg-slate-50 rounded-lg">
                    <span className="text-xs font-medium text-slate-700">{item.materialName} (مطلوب: {item.quantity})</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">الكمية المستلمة:</span>
                      <input
                        type="number"
                        value={item.deliveredQty}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDeliverForm(prev => {
                            const updated = [...prev.items];
                            updated[idx] = { ...updated[idx], deliveredQty: val };
                            return { ...prev, items: updated };
                          });
                        }}
                        className="w-20 h-7 text-xs border border-slate-200 rounded px-2 outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <FormField label="ملاحظات الاستلام">
              <input
                value={deliverForm.notes}
                onChange={(e) => setDeliverForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="مثال: تم استلام الشحنة وتوريدها للمخازن..."
                className={inputCls}
              />
            </FormField>
          </div>
        )}
        <ModalFooter onClose={() => setShowDeliverModal(false)} onConfirm={handleSubmitDeliver} confirmLabel="تأكيد الاستلام والمالية" loading={savingDeliver} />
      </Modal>
    </div>
  );
}

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, FileText, Printer, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";
import api from "../../services/api";

const emptyForm = { clientId: "", amount: "", method: "", notes: "", orderId: "" };

const stageNames: Record<string, string> = {
  "SUPPLY_ORDER": "أمر التوريد",
  "DESIGN": "التصميم",
  "PRINTING": "الطباعة",
  "PACKAGING": "التعبئة",
  "DELIVERY": "التسليم",
};

export function Accounts() {
  const [clients, setClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [clientOrders, setClientOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Sync clientOrders when clientId or orders change
  useEffect(() => {
    if (!form.clientId) {
      setClientOrders([]);
      return;
    }
    const cId = parseInt(form.clientId);
    const matching = orders
      .filter((o) => o.clientId === cId)
      .map((order) => {
        const total = order.items?.reduce((s: number, i: any) => s + i.quantity * i.price, 0) || 0;
        const paid = order.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
        const rest = total - paid;
        return { ...order, total, paid, rest };
      })
      .filter((o) => o.rest > 0);
    setClientOrders(matching);
  }, [form.clientId, orders]);

  // Tabs state: 'payments' or 'reports'
  const [activeTab, setActiveTab] = useState<'payments' | 'reports'>('payments');

  // Reports filters
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12, 0 for all year

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clsRes, ordRes] = await Promise.all([
        api.get('/clients'),
        api.get('/orders'),
      ]);
      setClients(clsRes.data);
      setOrders(ordRes.data);

      const allPayments: any[] = [];
      for (const client of clsRes.data) {
        try {
          const stmtRes = await api.get(`/clients/${client.id}/account-statement`);
          const stmt = stmtRes.data;
          if (stmt.entries) {
            for (const entry of stmt.entries) {
              if (entry.type === 'payment') {
                allPayments.push({
                  ...entry,
                  clientName: client.companyName,
                  clientId: client.id,
                });
              }
            }
          }
        } catch {
          // skip
        }
      }
      allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPayments(allPayments);
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

  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleOrderChange = (orderIdVal: string) => {
    setForm((p) => {
      const next = { ...p, orderId: orderIdVal };
      if (orderIdVal) {
        const found = clientOrders.find(o => o.id === parseInt(orderIdVal));
        if (found) {
          next.amount = found.rest.toString();
        }
      }
      return next;
    });
  };

  const handleNewPayment = async () => {
    if (!form.clientId || !form.amount) {
      toast.error("يرجى تحديد العميل والمبلغ");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/clients/${form.clientId}/payments`, {
        amount: parseInt(form.amount),
        method: form.method || null,
        notes: form.notes || null,
        orderId: form.orderId ? parseInt(form.orderId) : null,
      });
      setSaving(false);
      setShowNewModal(false);
      setForm(emptyForm);
      toast.success("تم تسجيل الدفعة بنجاح");
      fetchData();
    } catch (err: any) {
      setSaving(false);
      toast.error(err.response?.data?.message || "حدث خطأ");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter orders for the selected period
  const filteredOrders = orders.filter((order) => {
    const d = new Date(order.createdAt);
    const yMatch = d.getFullYear() === selectedYear;
    const mMatch = selectedMonth === 0 || (d.getMonth() + 1) === selectedMonth;
    return yMatch && mMatch;
  });

  // Calculate report metrics
  const totalInvoiced = filteredOrders.reduce((sum, o) => {
    return sum + (o.items?.reduce((s: number, i: any) => s + i.quantity * i.price, 0) || 0);
  }, 0);

  const totalCollected = filteredOrders.reduce((sum, o) => {
    return sum + (o.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0);
  }, 0);

  const totalRest = totalInvoiced - totalCollected;

  const totalOrderedQty = filteredOrders.reduce((sum, o) => {
    return sum + (o.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0);
  }, 0);

  const totalDeliveredQty = filteredOrders.reduce((sum, o) => {
    return sum + (o.items?.reduce((s: number, i: any) => s + (i.deliveredQty || 0), 0) || 0);
  }, 0);

  const totalRemainingQty = Math.max(0, totalOrderedQty - totalDeliveredQty);

  const totalPayments = payments.reduce((sum, p) => sum + (p.credit || 0), 0);

  if (loading) return <div className="p-8 text-center" dir="rtl">جاري التحميل...</div>;

  return (
    <div className="space-y-5 print:p-0" dir="rtl">
      {/* Styles for print formatting */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 11px !important;
          }
          .no-print {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .print-cards-grid {
            display: grid !important;
            grid-template-cols: repeat(3, minmax(0, 1fr)) !important;
            gap: 12px !important;
            margin-bottom: 20px !important;
          }
          .print-card {
            border: 1px solid #e2e8f0 !important;
            padding: 10px !important;
            border-radius: 8px !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #e2e8f0 !important;
            padding: 6px 8px !important;
            text-align: right !important;
          }
          th {
            background-color: #f8fafc !important;
          }
        }
      `}} />

      {/* Print Only Header */}
      <div className="hidden print:block mb-6 border-b pb-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">تقرير فواتير المبيعات والمالية المتبقية</h2>
        <p className="text-sm text-slate-500 mt-1">
          {selectedMonth === 0 
            ? `تقرير سنوي لعام: ${selectedYear}`
            : `تقرير شهري لعام: ${selectedYear} - شهر: ${selectedMonth}`
          }
        </p>
        <p className="text-xs text-slate-400 mt-1">تاريخ الاستخراج: {new Date().toLocaleDateString("ar-SA")}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الحسابات والتقارير</h1>
          <p className="text-slate-500 text-sm mt-0.5">إدارة المدفوعات والتقارير المالية للفواتير المتبقية</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'reports' && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              طباعة التقرير
            </button>
          )}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            تسجيل دفعة جديدة
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 no-print">
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-2 px-4 font-semibold text-sm border-b-2 transition-all ${activeTab === 'payments' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          سجل المدفوعات
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2 px-4 font-semibold text-sm border-b-2 transition-all ${activeTab === 'reports' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          تقرير فواتير المبيعات المتبقية
        </button>
      </div>

      {activeTab === 'payments' ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 no-print">
            {[
              { label: "إجمالي العملاء", value: `${clients.length} عميل`, icon: FileText, color: "text-[#2563EB]", bg: "bg-blue-50" },
              { label: "إجمالي المدفوعات المستلمة", value: `${totalPayments.toLocaleString()} ريال`, icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
              { label: "عدد عمليات الدفع", value: `${payments.length} عملية`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
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

          {/* Payments Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 no-print">
              <h3 className="font-bold text-slate-800">سجل المدفوعات</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["#", "العميل", "المبلغ", "طريقة الدفع", "التاريخ", "ملاحظات"].map((h) => (
                    <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">#{p.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.clientName}</td>
                    <td className="py-3 px-4 font-bold text-green-600">{(p.credit || 0).toLocaleString()} ريال</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{p.description || "—"}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(p.date).toLocaleDateString("ar-SA")}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{p.notes || "—"}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">لا توجد مدفوعات مسجلة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Filters - hidden on print */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex gap-4 items-center no-print">
            <div className="w-44">
              <label className="block text-xs font-bold text-slate-600 mb-1">تحديد السنة</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
                className={selectCls}
              >
                {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="w-44">
              <label className="block text-xs font-bold text-slate-600 mb-1">تحديد الشهر</label>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))} 
                className={selectCls}
              >
                <option value={0}>كل الأشهر (تقرير سنوي)</option>
                {Array.from({ length: 12 }, (_, idx) => (
                  <option key={idx + 1} value={idx + 1}>{idx + 1} - {new Date(2000, idx).toLocaleString("ar-EG", { month: "long" })}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial summary for print and screen */}
          <div className="print-cards-grid grid grid-cols-3 gap-4">
            <div className="print-card bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-1">
              <p className="text-xs text-slate-400 font-medium">إجمالي قيمة الفواتير</p>
              <p className="text-2xl font-bold text-slate-800">{totalInvoiced.toLocaleString()} ريال</p>
              <div className="pt-2 border-t border-slate-50 text-[11px] text-slate-400 flex justify-between">
                <span>الكمية المطلوبة:</span>
                <span className="font-bold text-slate-700">{totalOrderedQty.toLocaleString()} قطعة</span>
              </div>
            </div>

            <div className="print-card bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-1">
              <p className="text-xs text-slate-400 font-medium">المبالغ المستلمة (المحصلة)</p>
              <p className="text-2xl font-bold text-green-600">{totalCollected.toLocaleString()} ريال</p>
              <div className="pt-2 border-t border-slate-50 text-[11px] text-slate-400 flex justify-between">
                <span>الكمية المسلمة:</span>
                <span className="font-bold text-green-600">{totalDeliveredQty.toLocaleString()} قطعة</span>
              </div>
            </div>

            <div className="print-card bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-1">
              <p className="text-xs text-slate-400 font-medium">المتبقي المتأخر (الديون المتبقية)</p>
              <p className="text-2xl font-bold text-red-600">{totalRest.toLocaleString()} ريال</p>
              <div className="pt-2 border-t border-slate-50 text-[11px] text-slate-400 flex justify-between">
                <span>المتبقي للتسليم:</span>
                <span className="font-bold text-red-600">{totalRemainingQty.toLocaleString()} قطعة</span>
              </div>
            </div>
          </div>

          {/* Invoices Details Table */}
          <div className="print-full-width bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between no-print">
              <h3 className="font-bold text-slate-800">تفاصيل الفواتير والكميات للرصيد المتبقي</h3>
              <span className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded-full">{filteredOrders.length} فواتير</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["رقم الفاتورة", "العميل", "التاريخ", "قيمة الفاتورة", "المسدد", "المتبقي مالياً", "الكمية (مطلوب/مسلم/متبقي)", "حالة الإنتاج"].map((h) => (
                    <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const val = order.items?.reduce((s: number, i: any) => s + i.quantity * i.price, 0) || 0;
                  const paid = order.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
                  const rest = val - paid;

                  const qty = order.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
                  const dQty = order.items?.reduce((s: number, i: any) => s + (i.deliveredQty || 0), 0) || 0;
                  const rQty = Math.max(0, qty - dQty);

                  return (
                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-[#2563EB]">#{order.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{order.client?.companyName}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{val.toLocaleString()} ريال</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{paid.toLocaleString()} ريال</td>
                      <td className="py-3 px-4 text-red-600 font-bold">{rest.toLocaleString()} ريال</td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <span>{qty.toLocaleString()} مطلوب</span> / <span className="text-green-600 font-medium">{dQty.toLocaleString()} مسلم</span> / <span className="text-red-600 font-medium">{rQty.toLocaleString()} متبقي</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] ${order.currentStage === 'DELIVERY' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {stageNames[order.currentStage] || order.currentStage}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">لا توجد فواتير مطابقة للفترة المحددة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* New Payment Modal */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="تسجيل دفعة جديدة للعميل">
        <div className="space-y-4">
          <FormField label="العميل" required>
            <select value={form.clientId} onChange={(e) => setF("clientId", e.target.value)} className={selectCls}>
              <option value="">اختر العميل...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
            </select>
          </FormField>
          {form.clientId && (
            <FormField label="ربط بدفع فاتورة / طلب محدد">
              <select
                value={form.orderId}
                onChange={(e) => handleOrderChange(e.target.value)}
                className={selectCls}
              >
                <option value="">دفعة عامة على الحساب (غير مرتبطة بطلب)</option>
                {clientOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    طلب رقم #{o.id} — المتبقي: {o.rest.toLocaleString()} ريال (من أصل {o.total.toLocaleString()} ريال)
                  </option>
                ))}
              </select>
            </FormField>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="المبلغ (ريال)" required>
              <input value={form.amount} onChange={(e) => setF("amount", e.target.value)} placeholder="0" className={inputCls} type="number" />
            </FormField>
            <FormField label="طريقة الدفع">
              <select value={form.method} onChange={(e) => setF("method", e.target.value)} className={selectCls}>
                <option value="">اختر...</option>
                <option value="نقدي">نقدي</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="شيك">شيك</option>
              </select>
            </FormField>
          </div>
          <FormField label="ملاحظات">
            <input value={form.notes} onChange={(e) => setF("notes", e.target.value)} placeholder="ملاحظات إضافية..." className={inputCls} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowNewModal(false)} onConfirm={handleNewPayment} confirmLabel="تسجيل الدفعة" loading={saving} />
      </Modal>
    </div>
  );
}

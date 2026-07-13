import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronRight, Printer, Download, Building, Phone, Mail, MapPin,
  FileText, CreditCard, TrendingDown, TrendingUp, Calendar,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

const formatNum = (n: number) => n.toLocaleString("ar-SA");
const formatDate = (d: string) => new Date(d).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

export function AccountStatement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/clients/${id}/account-statement`);
        setData(res.data);
      } catch (err) {
        toast.error("حدث خطأ أثناء تحميل كشف الحساب");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">جاري تحميل كشف الحساب...</span>
        </div>
      </div>
    );
  }

  if (!data) return <div dir="rtl" className="p-10 text-center text-slate-500">لا توجد بيانات</div>;

  const { client, summary, entries } = data;

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; top: 0; right: 0; left: 0; padding: 20px; }
          .no-print { display: none !important; }
          table { font-size: 11px; }
          .print-header { display: flex !important; }
        }
      `}</style>

      <div className="space-y-5" dir="rtl">
        {/* Breadcrumb & actions */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate("/customers")} className="text-slate-500 hover:text-slate-700 transition-colors">العملاء</button>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <button onClick={() => navigate(`/customers/${id}`)} className="text-slate-500 hover:text-slate-700 transition-colors">{client.companyName}</button>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-800">كشف حساب</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            طباعة كشف الحساب
          </button>
        </div>

        {/* Printable area */}
        <div id="print-area" ref={printRef}>
          {/* Company header */}
          <div className="bg-gradient-to-l from-[#1E293B] to-[#334155] rounded-2xl p-6 text-white mb-5 shadow-lg print:rounded-none print:shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">كشف حساب العميل</h1>
                  <p className="text-slate-300 text-sm mt-1">مصنع الكرتون — نظام إدارة الإنتاج</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400">تاريخ الإصدار</p>
                <p className="text-sm font-semibold">{new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>
          </div>

          {/* Client info card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-5">
            <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#2563EB]" />
              بيانات العميل
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">اسم الشركة</p>
                <p className="text-sm font-semibold text-slate-800">{client.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">رقم الهاتف</p>
                <p className="text-sm text-slate-700 flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">البريد الإلكتروني</p>
                <p className="text-sm text-slate-700 flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">العنوان</p>
                <p className="text-sm text-slate-700 flex items-center gap-1"><MapPin className="w-3 h-3" /> {client.address || "—"}</p>
              </div>
              {client.taxNumber && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">الرقم الضريبي</p>
                  <p className="text-sm font-mono text-slate-700">{client.taxNumber}</p>
                </div>
              )}
              {client.creditLimit && client.creditLimit > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">حد الائتمان</p>
                  <p className="text-sm font-semibold text-slate-700">{formatNum(client.creditLimit)} ريال</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">{summary.ordersCount}</p>
                  <p className="text-[11px] text-slate-500">عدد الطلبات</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{formatNum(summary.totalOrders)}</p>
                  <p className="text-[11px] text-slate-500">إجمالي المديونية (ريال)</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{formatNum(summary.totalPayments)}</p>
                  <p className="text-[11px] text-slate-500">إجمالي المدفوعات (ريال)</p>
                </div>
              </div>
            </div>
            <div className={`bg-white rounded-xl border shadow-sm p-4 ${summary.balance > 0 ? "border-red-200" : "border-green-200"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${summary.balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
                  <TrendingDown className={`w-4 h-4 ${summary.balance > 0 ? "text-red-600" : "text-green-600"}`} />
                </div>
                <div>
                  <p className={`text-lg font-bold ${summary.balance > 0 ? "text-red-600" : "text-green-600"}`}>{formatNum(Math.abs(summary.balance))}</p>
                  <p className="text-[11px] text-slate-500">{summary.balance > 0 ? "الرصيد المستحق (ريال)" : "رصيد لصالح العميل (ريال)"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statement table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                تفاصيل الحركات
              </h3>
              <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{entries.length} حركة</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["#", "التاريخ", "البيان", "مدين (ريال)", "دائن (ريال)", "الرصيد (ريال)", "ملاحظات"].map((h) => (
                      <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry: any, idx: number) => (
                    <tr
                      key={`${entry.type}-${entry.id}`}
                      className={`border-b border-slate-50 transition-colors ${entry.type === "payment" ? "bg-green-50/30" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="py-3 px-4 text-xs text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">{formatDate(entry.date)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${entry.type === "order" ? "bg-[#2563EB]" : "bg-green-500"}`} />
                          <div>
                            <p className="text-xs font-medium text-slate-800">{entry.description}</p>
                            {entry.items && (
                              <div className="mt-1 space-y-0.5">
                                {entry.items.map((item: any, i: number) => (
                                  <p key={i} className="text-[10px] text-slate-400">
                                    {item.productName} × {formatNum(item.quantity)} = {formatNum(item.total)} ريال
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-red-600 font-mono">
                        {entry.debit > 0 ? formatNum(entry.debit) : "—"}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-green-600 font-mono">
                        {entry.credit > 0 ? formatNum(entry.credit) : "—"}
                      </td>
                      <td className={`py-3 px-4 text-xs font-bold font-mono ${entry.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                        {formatNum(Math.abs(entry.balance))} {entry.balance > 0 ? "مدين" : "دائن"}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 max-w-[150px] truncate">{entry.notes || "—"}</td>
                    </tr>
                  ))}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">لا توجد حركات مسجلة لهذا العميل</td>
                    </tr>
                  )}
                </tbody>
                {/* Footer totals */}
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td colSpan={3} className="py-3 px-4 text-xs font-bold text-slate-700">الإجمالي</td>
                    <td className="py-3 px-4 text-xs font-bold text-red-600 font-mono">{formatNum(summary.totalOrders)}</td>
                    <td className="py-3 px-4 text-xs font-bold text-green-600 font-mono">{formatNum(summary.totalPayments)}</td>
                    <td className={`py-3 px-4 text-xs font-bold font-mono ${summary.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatNum(Math.abs(summary.balance))} {summary.balance > 0 ? "مدين" : "دائن"}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Print footer */}
          <div className="mt-6 pt-4 border-t border-dashed border-slate-200 hidden print:block">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>تم إصدار هذا الكشف بواسطة نظام إدارة مصنع الكرتون</span>
              <span>صفحة 1 من 1</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

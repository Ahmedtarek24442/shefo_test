import { useNavigate } from "react-router";
import {
  Users, ClipboardList, AlertCircle, TrendingUp, DollarSign, Clock,
  ArrowUpRight, ArrowDownRight, Package, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const kpis = [
  { label: "عدد العملاء", value: "٢٤٨", sub: "+١٢ هذا الشهر", icon: Users, color: "#2563EB", bg: "#EFF6FF", trend: "up" },
  { label: "الطلبات الجارية", value: "٨٦", sub: "في مراحل الإنتاج", icon: ClipboardList, color: "#F59E0B", bg: "#FFFBEB", trend: "up" },
  { label: "طلبات اليوم", value: "١٤", sub: "+٣ من أمس", icon: Clock, color: "#8B5CF6", bg: "#F5F3FF", trend: "up" },
  { label: "طلبات متأخرة", value: "١٢", sub: "تحتاج متابعة عاجلة", icon: AlertCircle, color: "#DC2626", bg: "#FEF2F2", trend: "down" },
  { label: "الإيرادات (يونيو)", value: "٢٤٠ ألف", sub: "+١٨٪ من الشهر السابق", icon: TrendingUp, color: "#16A34A", bg: "#F0FDF4", trend: "up" },
  { label: "الأرباح (يونيو)", value: "٦٨ ألف", sub: "+١٥٪ من الشهر السابق", icon: DollarSign, color: "#0891B2", bg: "#ECFEFF", trend: "up" },
];

const monthlySales = [
  { month: "يناير", sales: 185, profit: 42 },
  { month: "فبراير", sales: 210, profit: 55 },
  { month: "مارس", sales: 195, profit: 48 },
  { month: "أبريل", sales: 230, profit: 61 },
  { month: "مايو", sales: 218, profit: 57 },
  { month: "يونيو", sales: 240, profit: 68 },
];

const ordersByStatus = [
  { name: "قيد التصميم", value: 14, color: "#8B5CF6" },
  { name: "قيد الطباعة", value: 18, color: "#F59E0B" },
  { name: "الداي كت", value: 11, color: "#F97316" },
  { name: "اللصق والتعبئة", value: 22, color: "#2563EB" },
  { name: "مكتمل", value: 120, color: "#16A34A" },
  { name: "متأخر", value: 12, color: "#DC2626" },
];

const topProducts = [
  { name: "صندوق ٤٠×٣٠×٢٠", orders: 312 },
  { name: "كرتون مزدوج مطبوع", orders: 248 },
  { name: "علب هدايا فاخرة", orders: 189 },
  { name: "صندوق شحن دولي", orders: 156 },
  { name: "كرتون مقوى بداي كت", orders: 134 },
];

const latestOrders = [
  { id: "WO-2024-0086", customer: "شركة الفهد التجارية", product: "صندوق ٤٠×٣٠×٢٠", qty: "٥٠٠٠", stage: "الطباعة", status: "جاري", date: "٢٥ يونيو" },
  { id: "WO-2024-0085", customer: "مؤسسة النور للتغليف", product: "كرتون مطبوع بالألوان", qty: "٣٠٠٠", stage: "التسليم", status: "مكتمل", date: "٢٤ يونيو" },
  { id: "WO-2024-0084", customer: "شركة الأمل الصناعية", product: "كرتون مقوى مزدوج", qty: "٧٠٠٠", stage: "الداي كت", status: "جاري", date: "٢٤ يونيو" },
  { id: "WO-2024-0083", customer: "مصنع الجودة", product: "علب هدايا فاخرة", qty: "٢٠٠٠", stage: "أمر توريد", status: "متأخر", date: "٢٣ يونيو" },
  { id: "WO-2024-0082", customer: "شركة التميز", product: "صندوق شحن دولي", qty: "٤٥٠٠", stage: "اللصق", status: "جاري", date: "٢٣ يونيو" },
];

const statusStyle: Record<string, string> = {
  "جاري": "bg-blue-100 text-blue-700",
  "مكتمل": "bg-green-100 text-green-700",
  "متأخر": "bg-red-100 text-red-700",
};

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
          <p className="text-slate-500 text-sm mt-0.5">الأربعاء، ٢٥ يونيو ٢٠٢٤</p>
        </div>
        <button
          onClick={() => navigate("/work-orders")}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm shadow-blue-300"
        >
          <ClipboardList className="w-4 h-4" />
          أمر تشغيل جديد
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.bg }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                {k.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-800">{k.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{k.label}</p>
              <p className="text-[10px] mt-1" style={{ color: k.trend === "up" ? "#16A34A" : "#DC2626" }}>{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">المبيعات والأرباح الشهرية</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">ألف ريال</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
              <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} fill="url(#salesGrad)" name="المبيعات" />
              <Area type="monotone" dataKey="profit" stroke="#16A34A" strokeWidth={2} fill="url(#profitGrad)" name="الأرباح" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">الطلبات حسب المرحلة</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {ordersByStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {ordersByStatus.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600">{s.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Latest orders table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">آخر أوامر التشغيل</h3>
            <button onClick={() => navigate("/work-orders")} className="text-xs text-[#2563EB] hover:underline font-medium">
              عرض الكل
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["رقم الأمر", "العميل", "المنتج", "الكمية", "المرحلة", "الحالة", "التاريخ"].map((h) => (
                    <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/work-orders/${o.id}`)}
                  >
                    <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-semibold">{o.id}</td>
                    <td className="py-3 px-4 text-slate-700">{o.customer}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{o.product}</td>
                    <td className="py-3 px-4 text-slate-700">{o.qty}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{o.stage}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">الأكثر طلباً</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-semibold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full"
                        style={{ width: `${(p.orders / 312) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{p.orders}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-slate-600">إجمالي المنتجات في المخزون</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-1">١٢٤ صنف</p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-600">١١٢ بمخزون كافٍ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

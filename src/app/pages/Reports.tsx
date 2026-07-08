import { useState } from "react";
import { Download, TrendingUp, Users, Package, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";
import { toast } from "sonner";

const monthlySales = [
  { month: "يناير", sales: 185, orders: 42 },
  { month: "فبراير", sales: 210, orders: 51 },
  { month: "مارس", sales: 195, orders: 46 },
  { month: "أبريل", sales: 230, orders: 58 },
  { month: "مايو", sales: 218, orders: 54 },
  { month: "يونيو", sales: 240, orders: 62 },
];

const ordersByType = [
  { name: "صناديق قياسية", value: 42, color: "#2563EB" },
  { name: "كرتون مطبوع", value: 28, color: "#F59E0B" },
  { name: "علب هدايا", value: 15, color: "#8B5CF6" },
  { name: "صناديق شحن", value: 10, color: "#16A34A" },
  { name: "أخرى", value: 5, color: "#94A3B8" },
];

const customerRevenue = [
  { name: "شركة الفهد", revenue: 450 },
  { name: "مؤسسة النور", revenue: 380 },
  { name: "شركة الأمل", revenue: 320 },
  { name: "مصنع الجودة", revenue: 280 },
  { name: "شركة التميز", revenue: 250 },
];

const productionEfficiency = [
  { week: "أ١", efficiency: 88 },
  { week: "أ٢", efficiency: 91 },
  { week: "أ٣", efficiency: 85 },
  { week: "م١", efficiency: 93 },
  { week: "م٢", efficiency: 89 },
  { week: "م٣", efficiency: 95 },
  { week: "م٤", efficiency: 92 },
  { week: "ي١", efficiency: 96 },
];

const tabs = [
  { key: "sales", label: "تقرير المبيعات", icon: TrendingUp },
  { key: "production", label: "تقرير الإنتاج", icon: Package },
  { key: "customers", label: "تقرير العملاء", icon: Users },
  { key: "financial", label: "التقرير المالي", icon: DollarSign },
];

export function Reports() {
  const [tab, setTab] = useState("sales");

  const handleExport = () => {
    toast.loading("جاري تصدير التقرير...", { id: "export" });
    setTimeout(() => {
      toast.success("تم تصدير التقرير بنجاح — تحقق من مجلد التنزيلات", { id: "export" });
    }, 1500);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">التقارير</h1>
          <p className="text-slate-500 text-sm mt-0.5">تقارير وتحليلات شاملة</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          تصدير التقرير
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 bg-white border border-slate-100 shadow-sm rounded-xl p-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                tab === t.key ? "bg-[#2563EB] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "sales" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "إجمالي المبيعات (٦ أشهر)", value: "١,٢٧٨,٠٠٠ ريال", trend: "+٨٪" },
              { label: "عدد الطلبات", value: "٣١٣ طلب", trend: "+١٢٪" },
              { label: "متوسط قيمة الطلب", value: "٤,٠٨٣ ريال", trend: "+٣٪" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                <span className="text-xs text-green-600 font-medium">{s.trend} مقارنة بنفس الفترة</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">المبيعات الشهرية (ألف ريال)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} fill="url(#salesFill)" name="المبيعات" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">توزيع المبيعات حسب النوع</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={ordersByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {ordersByType.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ordersByType.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600">{s.name}</span>
                    <span className="font-bold text-slate-800 mr-auto">{s.value}٪</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "production" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "كفاءة الإنتاج (يونيو)", value: "٩٦٪", trend: "+٢٪" },
              { label: "متوسط وقت الإنتاج", value: "٤.٢ يوم", trend: "-٠.٣ يوم" },
              { label: "طلبات مكتملة في الموعد", value: "٨٩٪", trend: "+٤٪" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                <span className="text-xs text-green-600 font-medium">{s.trend}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">كفاءة الإنتاج الأسبوعية (٪)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={productionEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="efficiency" stroke="#16A34A" strokeWidth={2.5} dot={{ fill: "#16A34A", r: 4 }} name="الكفاءة" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "customers" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">إيرادات العملاء الأعلى (ألف ريال)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={customerRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748B" }} width={120} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#2563EB" radius={[0, 4, 4, 0]} name="الإيرادات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "financial" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "صافي الإيرادات (يونيو)", value: "٢٤٠,٠٠٠ ريال", color: "text-[#2563EB]" },
              { label: "إجمالي التكاليف", value: "١٥٣,٠٠٠ ريال", color: "text-orange-600" },
              { label: "صافي الأرباح", value: "٨٧,٠٠٠ ريال", color: "text-green-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">المقارنة المالية الشهرية (ألف ريال)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySales.map((m) => ({ ...m, cost: Math.round(m.sales * 0.63), profit: Math.round(m.sales * 0.37) }))} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="sales" fill="#2563EB" radius={[4, 4, 0, 0]} name="الإيرادات" />
                <Bar dataKey="cost" fill="#F59E0B" radius={[4, 4, 0, 0]} name="التكاليف" />
                <Bar dataKey="profit" fill="#16A34A" radius={[4, 4, 0, 0]} name="الأرباح" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

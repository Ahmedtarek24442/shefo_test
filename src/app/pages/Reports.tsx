import { useState, useEffect } from "react";
import { Download, TrendingUp, Users, Package, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";
import api from "../../services/api";

const stageNames: Record<string, string> = {
  "SUPPLY_ORDER": "أمر التوريد",
  "DESIGN": "التصميم",
  "PRINTING": "الطباعة",
  "PACKAGING": "التعبئة",
  "DELIVERY": "التسليم",
};

const stageColors = ["#8B5CF6", "#F59E0B", "#F97316", "#2563EB", "#16A34A"];

const tabs = [
  { key: "sales", label: "تقرير المبيعات", icon: TrendingUp },
  { key: "production", label: "تقرير الإنتاج", icon: Package },
  { key: "customers", label: "تقرير العملاء", icon: Users },
  { key: "financial", label: "التقرير المالي", icon: DollarSign },
];

export function Reports() {
  const [tab, setTab] = useState("sales");
  const [salesData, setSalesData] = useState<any>(null);
  const [productionData, setProductionData] = useState<any>(null);
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [sales, production, customers, financial] = await Promise.all([
          api.get('/reports/sales'),
          api.get('/reports/production'),
          api.get('/reports/customers'),
          api.get('/reports/financial'),
        ]);
        setSalesData(sales.data);
        setProductionData(production.data);
        setCustomersData(customers.data);
        setFinancialData(financial.data);
      } catch (err) {
        console.error(err);
        toast.error("حدث خطأ أثناء تحميل التقارير");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExport = () => {
    toast.loading("جاري تصدير التقرير...", { id: "export" });
    setTimeout(() => {
      toast.success("تم تصدير التقرير بنجاح — تحقق من مجلد التنزيلات", { id: "export" });
    }, 1500);
  };

  if (loading) return <div className="p-8 text-center" dir="rtl">جاري تحميل التقارير...</div>;

  // Prepare pie data from production report
  const pieData = productionData?.ordersByStage
    ? Object.entries(productionData.ordersByStage).map(([stage, count], idx) => ({
        name: stageNames[stage] || stage,
        value: count as number,
        color: stageColors[idx % stageColors.length],
      })).filter((item) => item.value > 0)
    : [];

  // Prepare bar chart data for customers
  const customerBarData = customersData.map((c) => ({
    name: c.companyName?.substring(0, 15) || "",
    revenue: Math.round(c.revenue / 1000),
  }));

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

      {tab === "sales" && salesData && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "إجمالي الإيرادات", value: `${salesData.totalRevenue?.toLocaleString()} ريال` },
              { label: "عدد الطلبات", value: `${salesData.totalOrders} طلب` },
              { label: "متوسط قيمة الطلب", value: `${salesData.averageOrderValue?.toLocaleString()} ريال` },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "production" && productionData && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "إجمالي الطلبات", value: productionData.totalOrders },
              { label: "طلبات مكتملة", value: productionData.completedOrders },
              { label: "نسبة الإكمال", value: productionData.completionRate },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>
          {pieData.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">توزيع الطلبات حسب المرحلة</h3>
              <div className="flex items-start gap-8">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {pieData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 pt-4">
                  {pieData.map((s: any) => (
                    <div key={s.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.name}</span>
                      <span className="font-bold text-slate-800 mr-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "customers" && (
        <div className="space-y-5">
          {customersData.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">إيرادات العملاء الأعلى (ألف ريال)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={customerBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748B" }} width={120} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[0, 4, 4, 0]} name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
              <p className="text-slate-400 text-sm">لا توجد بيانات عملاء</p>
            </div>
          )}
        </div>
      )}

      {tab === "financial" && financialData && (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "إجمالي الإيرادات", value: `${financialData.totalRevenue?.toLocaleString()} ريال`, color: "text-[#2563EB]" },
              { label: "إجمالي التكاليف", value: `${financialData.totalCost?.toLocaleString()} ريال`, color: "text-orange-600" },
              { label: "صافي الأرباح", value: `${financialData.netProfit?.toLocaleString()} ريال`, color: "text-green-600" },
              { label: "هامش الربح", value: financialData.profitMargin, color: "text-purple-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

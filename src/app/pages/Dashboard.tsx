import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users, ClipboardList, AlertCircle, TrendingUp, DollarSign, Clock,
  ArrowUpRight, ArrowDownRight, Package, CheckCircle2, Factory,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import api from "../../services/api";

const statusStyle: Record<string, string> = {
  "DESIGN": "bg-purple-100 text-purple-700",
  "PRINTING": "bg-yellow-100 text-yellow-700",
  "DIE_CUTTING": "bg-orange-100 text-orange-700",
  "PACKAGING": "bg-blue-100 text-blue-700",
  "DELIVERY": "bg-green-100 text-green-700",
};

const stageNames: Record<string, string> = {
  "DESIGN": "قيد التصميم",
  "PRINTING": "قيد الطباعة",
  "DIE_CUTTING": "الداي كت",
  "PACKAGING": "اللصق والتعبئة",
  "DELIVERY": "مكتمل",
};



export function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) return <div className="p-8 text-center" dir="rtl">جاري التحميل...</div>;

  const kpis = [
    { label: "عدد العملاء", value: data.totalClients, sub: "إجمالي العملاء", icon: Users, color: "#2563EB", bg: "#EFF6FF", trend: "up" },
    { label: "الطلبات الجارية", value: data.ordersInProgress, sub: "في مراحل الإنتاج", icon: ClipboardList, color: "#F59E0B", bg: "#FFFBEB", trend: "up" },
    { label: "أوامر التوريد", value: data.supplierOrders, sub: "إجمالي الأوامر للموردين", icon: Clock, color: "#8B5CF6", bg: "#F5F3FF", trend: "up" },
    { label: "إجمالي الطلبات", value: data.totalOrders, sub: "كل الطلبات", icon: Factory, color: "#DC2626", bg: "#FEF2F2", trend: "up" },
    { label: "قيمة المخزون", value: `${data.inventoryValue} ر.س`, sub: "إجمالي قيمة الخامات", icon: TrendingUp, color: "#16A34A", bg: "#F0FDF4", trend: "up" },
    { label: "المنتجات / الخامات", value: `${data.products} / ${data.materials}`, sub: "أنواع المنتجات والخامات", icon: Package, color: "#0891B2", bg: "#ECFEFF", trend: "up" },
  ];

  const pieData = Object.entries(data.ordersByStage || {}).map(([stage, count]) => {
    const colors = ["#8B5CF6", "#F59E0B", "#F97316", "#2563EB", "#16A34A"];
    const idx = Object.keys(data.ordersByStage).indexOf(stage);
    return { name: stageNames[stage] || stage, value: count, color: colors[idx % colors.length] };
  }).filter((item: any) => item.value > 0);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
          <p className="text-slate-500 text-sm mt-0.5">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
          <div className="flex items-center justify-center h-[220px] text-slate-400 text-sm">
            لا تتوفر بيانات مبيعات شهرية حالياً
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">الطلبات حسب المرحلة</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {pieData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {pieData.map((s: any) => (
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
                {data.recentOrders?.map((o: any) => (
                  <tr
                    key={o.id}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/work-orders/${o.id}`)}
                  >
                    <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-semibold">{o.id}</td>
                    <td className="py-3 px-4 text-slate-700">{o.client?.companyName}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {o.items?.map((item: any) => item.product?.name).join(" و ")}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {o.items?.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {stageNames[o.currentStage] || o.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[o.currentStage] || ''}`}>
                        {stageNames[o.currentStage] || o.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(o.stageHistory?.[0]?.createdAt || Date.now()).toLocaleDateString('ar-SA')}</td>
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
            {data.recentSupplierOrders?.map((so: any, i: number) => (
              <div key={so.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-semibold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">أمر توريد #{so.id} - {so.suplier?.name}</p>
                  <p className="text-xs text-slate-500">{new Date(so.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-slate-600">إجمالي المنتجات</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-1">{data.products} صنف</p>
          </div>
        </div>
      </div>
    </div>
  );
}

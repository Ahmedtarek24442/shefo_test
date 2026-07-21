import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

const stageNames: Record<string, string> = {
  "SUPPLY_ORDER": "أمر التوريد",
  "DESIGN": "التصميم",
  "PRINTING": "الطباعة",
  "PACKAGING": "التعبئة",
  "DELIVERY": "التسليم",
};

const stageColors: Record<string, string> = {
  "SUPPLY_ORDER": "bg-sky-100 text-sky-700",
  "DESIGN": "bg-purple-100 text-purple-700",
  "PRINTING": "bg-yellow-100 text-yellow-700",
  "PACKAGING": "bg-blue-100 text-blue-700",
  "DELIVERY": "bg-green-100 text-green-700",
};

export function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error("حدث خطأ أثناء تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.client?.companyName?.includes(searchTerm) ||
      order.items?.some((item: any) => item.product?.name?.includes(searchTerm));
    const orderStatus = order.currentStage === "DELIVERY" ? "مكتمل" : "جاري";
    const matchesStatus = statusFilter === "الكل" || orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = orders.reduce((sum, o) => sum + o.items?.reduce((s: number, i: any) => s + i.quantity * i.price, 0) || 0, 0);
  const completedCount = orders.filter((o) => o.currentStage === "DELIVERY").length;
  const inProgressCount = orders.filter((o) => o.currentStage !== "DELIVERY").length;

  if (loading) return <div className="p-8 text-center" dir="rtl">جاري التحميل...</div>;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الطلبات</h1>
          <p className="text-slate-500 text-sm mt-0.5">إجمالي {orders.length} طلب</p>
        </div>
        <button
          onClick={() => navigate("/work-orders")}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة طلب جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الطلبات", value: orders.length, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "جاري التنفيذ", value: inProgressCount, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "مكتمل", value: completedCount, color: "text-green-600", bg: "bg-green-50" },
          { label: "قيمة الطلبات", value: `${totalValue.toLocaleString()} ريال`, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-100`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-xs min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="البحث عن طلب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 bg-slate-50 rounded-lg pr-9 pl-4 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {["الكل", "جاري", "مكتمل"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s ? "bg-[#2563EB] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["رقم الطلب", "العميل", "المنتج", "الكمية", "السعر", "المرحلة", "تاريخ الطلب", ""].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const totalQty = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                const totalPrice = order.items?.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0) || 0;
                const productName = order.items?.map((item: any) => item.product?.name).join(" و ") || "—";
                return (
                  <tr
                    key={order.id}
                    className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/work-orders/${order.id}`)}
                  >
                    <td className="py-3 px-4 font-mono text-xs font-bold text-[#2563EB]">{order.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{order.client?.companyName}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{productName}</td>
                    <td className="py-3 px-4 text-slate-700">{totalQty.toLocaleString()}</td>
                    <td className="py-3 px-4 font-medium text-green-600">{totalPrice.toLocaleString()} ريال</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColors[order.currentStage] || "bg-slate-100 text-slate-600"}`}>
                        {stageNames[order.currentStage] || order.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/work-orders/${order.id}`)}
                        className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:text-[#1E40AF]"
                      >
                        <Eye className="w-3.5 h-3.5" /> تفاصيل
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">لا توجد طلبات مطابقة للبحث</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronRight, Phone, Mail, MapPin, Building, Package, ShoppingCart, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

const formatNum = (n: number) => n.toLocaleString("ar-SA");

export function SupplierDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/suppliers/${id}`);
        setSupplier(res.data);
      } catch (err) {
        toast.error("حدث خطأ أثناء تحميل بيانات المورد");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
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
      <div className="grid grid-cols-3 gap-4">
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
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{supplier.orders?.length || 0}</p>
              <p className="text-xs text-slate-500">أوامر توريد</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatNum(supplier.orders?.reduce((sum: number, o: any) => sum + o.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0), 0) || 0)}
              </p>
              <p className="text-xs text-slate-500">إجمالي المشتريات (ريال)</p>
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
          {supplier.orders?.map((order: any) => (
            <div
              key={order.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#2563EB]/30 hover:bg-blue-50/20 transition-all"
            >
              <div className="flex-1 flex items-center gap-6 flex-wrap">
                <div>
                  <p className="font-mono text-xs font-bold text-[#2563EB]">أمر توريد #{order.id}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>عدد الخامات: <span className="font-semibold text-slate-700">{order.items?.length || 0}</span></p>
                  <p className="mt-0.5">الإجمالي: <span className="font-bold text-green-600">{formatNum(order.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0)} ريال</span></p>
                </div>
                {order.notes && (
                  <p className="text-xs text-slate-400">{order.notes}</p>
                )}
              </div>
            </div>
          ))}
          {(!supplier.orders || supplier.orders.length === 0) && (
            <div className="text-center py-12 text-slate-400 text-sm">لا توجد أوامر توريد لهذا المورد</div>
          )}
        </div>
      </div>
    </div>
  );
}

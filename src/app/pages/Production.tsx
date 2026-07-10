import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Factory, Clock, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

const machines = [
  { name: "هايدلبرج SM-٧٤", type: "طباعة", status: "شغال", order: "WO-2024-0086", load: 85 },
  { name: "ماكينة كسر-٠٣", type: "داي كت", status: "شغال", order: "WO-2024-0084", load: 70 },
  { name: "ماكينة لصق-٠٢", type: "لصق", status: "شغال", order: "WO-2024-0082", load: 60 },
  { name: "خط التعبئة-٠١", type: "تعبئة", status: "شغال", order: "WO-2024-0079", load: 90 },
  { name: "ماكينة برونز-٠١", type: "برونز", status: "شغال", order: "WO-2024-0081", load: 55 },
  { name: "هايدلبرج SM-٥٢", type: "طباعة", status: "صيانة", order: "—", load: 0 },
  { name: "ماكينة كسر-٠١", type: "داي كت", status: "متوقف", order: "—", load: 0 },
];

const stageNames: Record<string, string> = {
  "DESIGN": "قيد التصميم",
  "PRINTING": "الطباعة",
  "DIE_CUTTING": "الداي كت",
  "PACKAGING": "التعبئة",
  "DELIVERY": "التسليم",
};

const stageColors: Record<string, string> = {
  "DESIGN": "bg-purple-100 text-purple-700",
  "PRINTING": "bg-yellow-100 text-yellow-700",
  "DIE_CUTTING": "bg-orange-100 text-orange-700",
  "PACKAGING": "bg-blue-100 text-blue-700",
  "DELIVERY": "bg-green-100 text-green-700",
};

export function Production() {
  const navigate = useNavigate();
  const [productionQueue, setProductionQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const res = await api.get('/orders?stage=in_progress');
        setProductionQueue(res.data);
      } catch (err) {
        toast.error("حدث خطأ أثناء تحميل بيانات الإنتاج");
      } finally {
        setLoading(false);
      }
    };
    fetchProduction();
  }, []);

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الإنتاج</h1>
          <p className="text-slate-500 text-sm mt-0.5">متابعة خط الإنتاج في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-700 font-medium">المصنع يعمل</span>
        </div>
      </div>

      {/* Production stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "أوامر في الإنتاج", value: productionQueue.length, icon: Factory, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "ماكينات تعمل", value: machines.filter(m => m.status === "شغال").length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "ماكينات في صيانة", value: machines.filter(m => m.status === "صيانة").length, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "ماكينات متوقفة", value: machines.filter(m => m.status === "متوقف").length, icon: AlertCircle, color: "text-slate-500", bg: "bg-slate-50" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${k.bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                <p className="text-xs text-slate-500">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Production queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">قائمة الإنتاج الجارية</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["رقم الأمر", "المنتج", "العميل", "المرحلة", "المسؤول", "الماكينة", "منذ", "الأولوية", ""].map((h) => (
                  <th key={h} className="text-right py-2.5 px-4 text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productionQueue.map((item) => {
                const product = item.items?.[0]?.product;
                const employee = item.stageHistory?.[0]?.responsible?.name || "—";
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-blue-50/20 cursor-pointer transition-colors"
                    onClick={() => navigate(`/work-orders/${item.id}`)}>
                    <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{item.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 text-xs">{product?.name || "—"}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{item.client?.companyName}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColors[item.currentStage] || 'bg-slate-100'}`}>{stageNames[item.currentStage] || item.currentStage}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{employee}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">—</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(item.createdAt || Date.now()).toLocaleDateString("ar-SA")}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium bg-yellow-100 text-yellow-700 border-yellow-200`}>متوسطة</span>
                    </td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/work-orders/${item.id}`)}
                        className="text-xs text-[#2563EB] flex items-center gap-1 hover:text-[#1E40AF]"
                      >
                        <Eye className="w-3 h-3" /> عرض
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Machine status */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">حالة الماكينات</h3>
          <div className="space-y-2.5">
            {machines.map((m) => {
              const style = machineStatus[m.status];
              return (
                <div key={m.name} className={`rounded-lg border p-3 ${style.bg}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${style.dot} ${m.status === "شغال" ? "animate-pulse" : ""}`} />
                      <span className="text-xs font-bold text-slate-800">{m.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{m.type}</span>
                  </div>
                  {m.load > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.load > 80 ? "bg-red-400" : m.load > 60 ? "bg-yellow-400" : "bg-green-400"}`}
                          style={{ width: `${m.load}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{m.load}٪</span>
                    </div>
                  )}
                  {m.order !== "—" && (
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">{m.order}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

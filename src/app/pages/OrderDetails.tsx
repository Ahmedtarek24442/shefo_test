import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronRight, Edit2, CheckCircle2, Clock,
  User, Calendar, FileText, X, Save, ClipboardList,
  Palette, Printer, Package, Truck,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

type StageStatus = "completed" | "active" | "pending";

interface StageConfig {
  key: string;
  name: string;
  icon: React.ElementType;
}

const stageFlow: StageConfig[] = [
  { key: "SUPPLY_ORDER", name: "أمر التوريد", icon: ClipboardList },
  { key: "DESIGN", name: "التصميم", icon: Palette },
  { key: "PRINTING", name: "الطباعة", icon: Printer },
  { key: "PACKAGING", name: "التعبئة", icon: Package },
  { key: "DELIVERY", name: "التسليم", icon: Truck },
];

const printingSteps = [
  { key: "printInternalDone", label: "طباعة داخلية", color: "indigo" },
  { key: "printExternalDone", label: "طباعة خارجية", color: "orange" },
  { key: "printStickerDone", label: "طباعة استيكر", color: "pink" },
] as const;

const cardStyle: Record<StageStatus, string> = {
  completed: "border-green-200 bg-green-50",
  active: "border-blue-300 bg-blue-50 shadow-md shadow-blue-100",
  pending: "border-slate-200 bg-white",
};

const badgeStyle: Record<StageStatus, string> = {
  completed: "bg-green-100 text-green-700 border-green-200",
  active: "bg-blue-100 text-blue-700 border-blue-200",
  pending: "bg-slate-100 text-slate-500 border-slate-200",
};

const badgeLabel: Record<StageStatus, string> = {
  completed: "مكتمل",
  active: "جاري",
  pending: "قيد الانتظار",
};

export function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [savingStage, setSavingStage] = useState(false);
  const [savingPrintType, setSavingPrintType] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل بيانات الطلب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const getStageStatus = (stageKey: string): StageStatus => {
    if (!order) return "pending";
    const stageOrder = stageFlow.findIndex((s) => s.key === stageKey);
    const currentOrder = stageFlow.findIndex((s) => s.key === order.currentStage);
    if (stageOrder < currentOrder) return "completed";
    if (stageOrder === currentOrder) return "active";
    return "pending";
  };

  const getStageHistoryEntry = (stageKey: string) => {
    if (!order?.stageHistory) return null;
    return order.stageHistory.find((h: any) => h.stage === stageKey);
  };

  const handleAdvanceStage = async (stageKey: string) => {
    const currentIdx = stageFlow.findIndex((s) => s.key === order.currentStage);
    const nextStage = stageFlow[currentIdx + 1];
    if (!nextStage) return;

    setSavingStage(true);
    try {
      await api.post(`/orders/${id}/stages`, {
        stage: nextStage.key,
        notes: editNotes || `تم الانتقال إلى مرحلة ${nextStage.name}`,
      });
      setEditingStage(null);
      setEditNotes("");
      toast.success(`تم الانتقال إلى مرحلة "${nextStage.name}"`);
      fetchOrder();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally {
      setSavingStage(false);
    }
  };

  const handleTogglePrintingStep = async (stepKey: "printInternalDone" | "printExternalDone" | "printStickerDone", currentValue: boolean) => {
    setSavingPrintType(true);
    try {
      await api.patch(`/orders/${id}/printing-steps`, { [stepKey]: !currentValue });
      toast.success("تم تحديث خطوة الطباعة");
      fetchOrder();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally {
      setSavingPrintType(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">جاري تحميل بيانات الطلب...</span>
        </div>
      </div>
    );
  }

  if (!order) return <div dir="rtl" className="p-10 text-center text-slate-500">الطلب غير موجود</div>;

  const activeStage = stageFlow.find((s) => s.key === order.currentStage);
  const completedCount = stageFlow.filter((s) => getStageStatus(s.key) === "completed").length;
  const progress = Math.round(((completedCount + (activeStage ? 0.5 : 0)) / stageFlow.length) * 100);

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate("/work-orders")} className="text-slate-500 hover:text-slate-700 transition-colors">
            أوامر التشغيل
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <h1 className="font-bold text-slate-800">أمر تشغيل #{order.id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm">
            <span className="text-slate-500">التقدم الكلي</span>
            <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-bold text-[#2563EB]">{progress}٪</span>
          </div>
          <span className={`text-sm px-3 py-1.5 rounded-lg font-medium border ${activeStage ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}`}>
            {activeStage ? `المرحلة: ${activeStage.name}` : "مكتمل ✓"}
          </span>
        </div>
      </div>

      {/* Order summary bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4 flex flex-wrap gap-6">
        {[
          { label: "العميل", value: order.client?.companyName || "—" },
          { label: "المنتج", value: order.items?.[0]?.product?.name || "—" },
          { label: "الكمية", value: `${order.items?.reduce((s: number, i: any) => s + i.quantity, 0).toLocaleString("ar-SA")} قطعة` },
          { label: "تاريخ الطلب", value: new Date(order.createdAt || Date.now()).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) },
          { label: "إجمالي الطلب", value: `${order.items?.reduce((s: number, i: any) => s + i.quantity * i.price, 0).toLocaleString("ar-SA")} ريال` },
          { label: "خطوات الطباعة", value: [order.printInternalDone && "داخلي", order.printExternalDone && "خارجي", order.printStickerDone && "استيكر"].filter(Boolean).join("، ") || "لم تطبع بعد" },
        ].map((f) => (
          <div key={f.label}>
            <p className="text-[11px] text-slate-400 mb-0.5">{f.label}</p>
            <p className="text-sm font-semibold text-slate-800">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Production timeline - 5 stages */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">خط سير الإنتاج</h3>
          <span className="text-xs text-slate-400">{completedCount} من {stageFlow.length} مراحل مكتملة</span>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start min-w-max gap-0">
            {stageFlow.map((stage, idx) => {
              const status = getStageStatus(stage.key);
              const historyEntry = getStageHistoryEntry(stage.key);
              const Icon = stage.icon;
              const isActive = status === "active";
              const isPrinting = stage.key === "PRINTING";

              return (
                <div key={stage.key} className="flex items-start">
                  {/* Card */}
                  <div className="w-52 shrink-0 flex flex-col items-center">
                    <div className={`w-full rounded-xl border-2 transition-all duration-300 ${cardStyle[status]}`}>
                      {/* Header */}
                      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-black/5">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-slate-600" />
                          <span className="text-[11px] font-bold text-slate-700 leading-tight">{stage.name}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${badgeStyle[status]}`}>
                          {badgeLabel[status]}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="px-3 py-2.5 space-y-1.5">
                        {historyEntry ? (
                          <>
                            <div className="flex items-center gap-1 text-[11px] text-slate-600">
                              <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span className="truncate">{historyEntry.responsible?.name || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-600">
                              <Calendar className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{new Date(historyEntry.createdAt).toLocaleDateString("ar-SA")}</span>
                            </div>
                            {historyEntry.notes && (
                              <div className="flex items-start gap-1 text-[10px] text-slate-500">
                                <FileText className="w-2.5 h-2.5 text-slate-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{historyEntry.notes}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-[11px] text-slate-400 py-2 text-center">لم تبدأ بعد</div>
                        )}

                        {/* Printing checklist steps */}
                        {isPrinting && (isActive || status === "completed") && (
                          <div className="pt-2 border-t border-black/5 space-y-1.5">
                            <p className="text-[10px] text-slate-500 font-semibold">خطوات الطباعة:</p>
                            <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {printingSteps.map((step) => {
                                const isDone = !!order[step.key];
                                return (
                                  <label
                                    key={step.key}
                                    className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-700 hover:text-slate-900"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isDone}
                                      disabled={savingPrintType}
                                      onChange={() => handleTogglePrintingStep(step.key, isDone)}
                                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                                    />
                                    <span className={isDone ? "line-through text-slate-400 font-medium" : "font-medium"}>
                                      {step.label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer actions */}
                      {isActive && (
                        <div className="px-3 pb-3">
                          {editingStage === stage.key ? (
                            <div className="space-y-1.5">
                              <textarea
                                className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#2563EB] resize-none bg-white"
                                placeholder="ملاحظات (اختياري)"
                                rows={2}
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleAdvanceStage(stage.key)}
                                  disabled={savingStage}
                                  className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white text-[10px] py-1 rounded font-medium hover:bg-green-600 disabled:opacity-60"
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  {savingStage ? "جاري..." : "تأكيد"}
                                </button>
                                <button
                                  onClick={() => { setEditingStage(null); setEditNotes(""); }}
                                  className="flex-1 flex items-center justify-center gap-1 bg-slate-100 text-slate-600 text-[10px] py-1 rounded font-medium"
                                >
                                  <X className="w-2.5 h-2.5" /> إلغاء
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingStage(stage.key)}
                              className="w-full flex items-center justify-center gap-1 text-[10px] bg-green-500 text-white rounded-lg py-1.5 hover:bg-green-600 transition-all font-medium"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              إتمام والانتقال للتالي
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step indicator */}
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                        status === "completed" ? "bg-green-500" : status === "active" ? "bg-[#2563EB]" : "bg-slate-300"
                      }`}>
                        {status === "completed" ? "✓" : idx + 1}
                      </div>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {idx < stageFlow.length - 1 && (
                    <div className="flex items-center mx-1 mt-14 shrink-0">
                      <div className={`h-0.5 w-6 ${status === "completed" ? "bg-green-300" : "bg-slate-200"}`} />
                      <div
                        className="w-0 h-0"
                        style={{
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderLeft: `7px solid ${status === "completed" ? "#86efac" : "#CBD5E1"}`,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage history table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-700 text-sm">سجل مراحل الإنتاج</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["المرحلة", "المسؤول", "التاريخ", "الوقت", "الحالة", "ملاحظات"].map((h) => (
                <th key={h} className="text-right py-2.5 px-4 text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stageFlow.map((stage) => {
              const status = getStageStatus(stage.key);
              const entry = getStageHistoryEntry(stage.key);
              const Icon = stage.icon;
              return (
                <tr key={stage.key} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      {stage.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{entry?.responsible?.name || "—"}</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{entry ? new Date(entry.createdAt).toLocaleDateString("ar-SA") : "—"}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{entry ? new Date(entry.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${badgeStyle[status]}`}>
                      {badgeLabel[status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs max-w-xs truncate">{entry?.notes || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-700 text-sm">تفاصيل المنتجات</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["المنتج", "المقاس", "الكمية", "سعر الوحدة", "الإجمالي"].map((h) => (
                <th key={h} className="text-right py-2.5 px-4 text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any) => (
              <tr key={item.id} className="border-b border-slate-50">
                <td className="py-3 px-4 font-medium text-slate-800">{item.product?.name}</td>
                <td className="py-3 px-4 text-slate-500 text-xs font-mono">{item.product?.sizes || "—"}</td>
                <td className="py-3 px-4 text-slate-700">{item.quantity.toLocaleString("ar-SA")}</td>
                <td className="py-3 px-4 text-slate-600">{item.price.toLocaleString("ar-SA")} ريال</td>
                <td className="py-3 px-4 font-bold text-green-600">{(item.quantity * item.price).toLocaleString("ar-SA")} ريال</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td colSpan={4} className="py-3 px-4 text-xs font-bold text-slate-700">الإجمالي</td>
              <td className="py-3 px-4 font-bold text-green-600">
                {order.items?.reduce((s: number, i: any) => s + i.quantity * i.price, 0).toLocaleString("ar-SA")} ريال
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

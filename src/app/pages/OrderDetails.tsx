import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronRight, Edit2, CheckCircle2, Clock,
  User, Calendar, FileText, X, Save,
} from "lucide-react";

type StageStatus = "completed" | "active" | "pending";

interface Stage {
  id: number;
  name: string;
  icon: string;
  status: StageStatus;
  employee: string;
  date: string;
  time: string;
  notes: string;
  fields: { label: string; value: string }[];
}

const initialStages: Stage[] = [
  {
    id: 0, name: "أمر توريد", icon: "📋", status: "completed",
    employee: "محمد السيد", date: "٢٠/٠٦/٢٠٢٤", time: "٠٩:٣٠",
    notes: "تم استلام الطلب من العميل وتأكيد المواصفات",
    fields: [
      { label: "العميل", value: "شركة الفهد التجارية" },
      { label: "المقاس", value: "٤٠×٣٠×٢٠ سم" },
      { label: "الكمية", value: "٥٠٠٠ قطعة" },
      { label: "اللون", value: "بني طبيعي" },
      { label: "نوع الكرتون", value: "مموج ثلاثي" },
      { label: "مصدر الاستلام", value: "مندوب المبيعات" },
    ],
  },
  {
    id: 1, name: "التصميم", icon: "✏️", status: "completed",
    employee: "سارة أحمد", date: "٢١/٠٦/٢٠٢٤", time: "١٠:٠٠",
    notes: "تم إعداد التصميم واعتماده من العميل",
    fields: [
      { label: "المصمم", value: "سارة أحمد" },
      { label: "تاريخ البداية", value: "٢١/٠٦/٢٠٢٤" },
      { label: "تاريخ الانتهاء", value: "٢٢/٠٦/٢٠٢٤" },
      { label: "اعتماد التصميم", value: "معتمد ✓" },
    ],
  },
  {
    id: 2, name: "الطباعة", icon: "🖨️", status: "active",
    employee: "خالد إبراهيم", date: "٢٣/٠٦/٢٠٢٤", time: "٠٨:١٥",
    notes: "قيد التنفيذ — طباعة الوجهين",
    fields: [
      { label: "نوع الطباعة", value: "أوفست رباعي الألوان" },
      { label: "الماكينة", value: "هايدلبرج SM-٧٤" },
      { label: "حالة الطباعة", value: "جاري التنفيذ" },
    ],
  },
  {
    id: 3, name: "الداي كت", icon: "✂️", status: "pending",
    employee: "—", date: "—", time: "—",
    notes: "",
    fields: [
      { label: "نوع الاسطمبة", value: "—" },
      { label: "تاريخ التنفيذ", value: "—" },
      { label: "العامل", value: "—" },
    ],
  },
  {
    id: 4, name: "البرنز", icon: "✨", status: "pending",
    employee: "—", date: "—", time: "—",
    notes: "",
    fields: [],
  },
  {
    id: 5, name: "اللصق", icon: "🔧", status: "pending",
    employee: "—", date: "—", time: "—",
    notes: "",
    fields: [],
  },
  {
    id: 6, name: "التعبئة", icon: "📦", status: "pending",
    employee: "—", date: "—", time: "—",
    notes: "",
    fields: [],
  },
  {
    id: 7, name: "التسليم", icon: "🚚", status: "pending",
    employee: "—", date: "—", time: "—",
    notes: "",
    fields: [
      { label: "تاريخ التسليم", value: "٣٠/٠٦/٢٠٢٤" },
      { label: "حالة الطلب", value: "قيد الانتظار" },
    ],
  },
];

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
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Stage>>({});

  const openEdit = (stage: Stage) => {
    setEditingId(stage.id);
    setEditData({ employee: stage.employee, date: stage.date, time: stage.time, notes: stage.notes });
  };

  const saveEdit = (stageId: number) => {
    setStages((prev) => prev.map((s) => (s.id === stageId ? { ...s, ...editData } : s)));
    setEditingId(null);
  };

  const markComplete = (stageId: number) => {
    setStages((prev) =>
      prev.map((s) => {
        if (s.id === stageId) return { ...s, status: "completed" as StageStatus };
        if (s.id === stageId + 1 && s.status === "pending") return { ...s, status: "active" as StageStatus };
        return s;
      })
    );
  };

  const activeStage = stages.find((s) => s.status === "active");
  const completedCount = stages.filter((s) => s.status === "completed").length;
  const progress = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate("/work-orders")} className="text-slate-500 hover:text-slate-700 transition-colors">
            أوامر التشغيل
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <h1 className="font-bold text-slate-800">{id}</h1>
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
          { label: "العميل", value: "شركة الفهد التجارية" },
          { label: "المنتج", value: "صندوق كرتون ٤٠×٣٠×٢٠" },
          { label: "الكمية", value: "٥٠٠٠ قطعة" },
          { label: "تاريخ الطلب", value: "٢٠ يونيو ٢٠٢٤" },
          { label: "الموعد النهائي", value: "٣٠ يونيو ٢٠٢٤" },
          { label: "إجمالي الطلب", value: "٢٨٥٠٠ ريال" },
        ].map((f) => (
          <div key={f.label}>
            <p className="text-[11px] text-slate-400 mb-0.5">{f.label}</p>
            <p className="text-sm font-semibold text-slate-800">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Horizontal production timeline */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">خط سير الإنتاج</h3>
          <span className="text-xs text-slate-400">{completedCount} من {stages.length} مراحل مكتملة</span>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start min-w-max gap-0">
            {stages.map((stage, idx) => {
              const isEditing = editingId === stage.id;
              return (
                <div key={stage.id} className="flex items-start">
                  {/* Card */}
                  <div className="w-48 shrink-0 flex flex-col items-center">
                    <div className={`w-full rounded-xl border-2 transition-all duration-300 ${cardStyle[stage.status]}`}>
                      {/* Header */}
                      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-black/5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{stage.icon}</span>
                          <span className="text-[11px] font-bold text-slate-700 leading-tight">{stage.name}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${badgeStyle[stage.status]}`}>
                          {badgeLabel[stage.status]}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="px-3 py-2.5 space-y-1.5">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <input
                              className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#2563EB] bg-white"
                              placeholder="المسؤول"
                              value={editData.employee ?? ""}
                              onChange={(e) => setEditData((p) => ({ ...p, employee: e.target.value }))}
                            />
                            <input
                              className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#2563EB] bg-white"
                              placeholder="التاريخ"
                              value={editData.date ?? ""}
                              onChange={(e) => setEditData((p) => ({ ...p, date: e.target.value }))}
                            />
                            <textarea
                              className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#2563EB] resize-none bg-white"
                              placeholder="ملاحظات"
                              rows={2}
                              value={editData.notes ?? ""}
                              onChange={(e) => setEditData((p) => ({ ...p, notes: e.target.value }))}
                            />
                            <div className="flex gap-1">
                              <button onClick={() => saveEdit(stage.id)} className="flex-1 flex items-center justify-center gap-1 bg-[#2563EB] text-white text-[10px] py-1 rounded font-medium">
                                <Save className="w-2.5 h-2.5" /> حفظ
                              </button>
                              <button onClick={() => setEditingId(null)} className="flex-1 flex items-center justify-center gap-1 bg-slate-100 text-slate-600 text-[10px] py-1 rounded font-medium">
                                <X className="w-2.5 h-2.5" /> إلغاء
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 text-[11px] text-slate-600">
                              <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span className="truncate">{stage.employee}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-600">
                              <Calendar className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{stage.date}</span>
                              {stage.time !== "—" && <span className="text-slate-400 text-[10px]">{stage.time}</span>}
                            </div>
                            {stage.notes && (
                              <div className="flex items-start gap-1 text-[10px] text-slate-500">
                                <FileText className="w-2.5 h-2.5 text-slate-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{stage.notes}</span>
                              </div>
                            )}
                            {stage.fields.slice(0, 2).map((f) => (
                              <div key={f.label} className="text-[10px] text-slate-500">
                                <span className="text-slate-400">{f.label}: </span>
                                <span className="font-medium text-slate-600">{f.value}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Footer actions */}
                      {!isEditing && (
                        <div className="px-3 pb-3 flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(stage)}
                            className="flex-1 flex items-center justify-center gap-1 text-[10px] border border-slate-200 rounded-lg py-1 text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> تعديل
                          </button>
                          {stage.status === "active" && (
                            <button
                              onClick={() => markComplete(stage.id)}
                              className="flex-1 flex items-center justify-center gap-1 text-[10px] bg-green-500 text-white rounded-lg py-1 hover:bg-green-600"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" /> اكتمل
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step indicator */}
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                        stage.status === "completed" ? "bg-green-500" : stage.status === "active" ? "bg-[#2563EB]" : "bg-slate-300"
                      }`}>
                        {stage.status === "completed" ? "✓" : idx + 1}
                      </div>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {idx < stages.length - 1 && (
                    <div className="flex items-center mx-1 mt-14 shrink-0">
                      <div className={`h-0.5 w-6 ${stage.status === "completed" ? "bg-green-300" : "bg-slate-200"}`} />
                      <div
                        className="w-0 h-0"
                        style={{
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderLeft: `7px solid ${stage.status === "completed" ? "#86efac" : "#CBD5E1"}`,
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

      {/* Summary table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-700 text-sm">ملخص مراحل الإنتاج</h3>
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
            {stages.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-700">
                  <span className="ml-2 text-sm">{s.icon}</span>{s.name}
                </td>
                <td className="py-3 px-4 text-slate-600 text-xs">{s.employee}</td>
                <td className="py-3 px-4 text-slate-600 text-xs">{s.date}</td>
                <td className="py-3 px-4 text-slate-500 text-xs">{s.time}</td>
                <td className="py-3 px-4">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${badgeStyle[s.status]}`}>
                    {badgeLabel[s.status]}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 text-xs max-w-xs truncate">{s.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

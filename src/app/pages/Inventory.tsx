import { useState, useEffect } from "react";
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";
import api from "../../services/api";

const emptyAdj = { item: "", type: "وارد", qty: "", reason: "", ref: "" };

export function Inventory() {
  const [tab, setTab] = useState<"stock" | "movements">("stock");
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [adj, setAdj] = useState(emptyAdj);
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory');
      setStockItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل المخزون");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const setA = (k: string, v: string) => setAdj((p) => ({ ...p, [k]: v }));

  const lowStock = stockItems.filter((i: any) => i.currentAmount <= i.minimumAllowedAmount).length;
  const totalValue = stockItems.reduce((sum, i) => sum + (i.currentAmount * (i.buyPrice || 0)), 0);

  const handleAdjust = () => {
    if (!adj.item || !adj.qty) {
      toast.error("يرجى تحديد الصنف والكمية");
      return;
    }
    const qty = parseInt(adj.qty);
    setSaving(true);
    setTimeout(() => {
      setStockItems((prev) =>
        prev.map((item) => {
          if (item.name !== adj.item) return item;
          const delta = adj.type === "وارد" ? qty : -qty;
          const newAvail = Math.max(0, item.currentAmount + delta);
          return { ...item, currentAmount: newAvail };
        })
      );
      setSaving(false);
      setShowModal(false);
      setAdj(emptyAdj);
      toast.success(`تمت تسوية المخزون بنجاح — ${adj.type} ${qty.toLocaleString()} ${adj.item}`);
    }, 800);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المخزون</h1>
          <p className="text-slate-500 text-sm mt-0.5">تتبع المخزون وحركات البضاعة</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 border border-[#2563EB] bg-white text-[#2563EB] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          تسوية المخزون
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي الأصناف", value: stockItems.length, icon: Package, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "قيمة المخزون", value: `${totalValue.toLocaleString()} ريال`, icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-50" },
          { label: "مخزون كافٍ", value: stockItems.filter((i) => i.currentAmount > i.minimumAllowedAmount).length, icon: ArrowDownRight, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "أصناف منخفضة", value: lowStock, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
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

      <div className="flex gap-2">
        {[{ key: "stock", label: "المخزون الحالي" }, { key: "movements", label: "حركات المخزون" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "stock" | "movements")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-[#2563EB] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stock" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["رقم الصنف", "المنتج", "الفئة", "في المخزون", "الحد الأدنى", "الحالة"].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item: any) => {
                const isLow = item.currentAmount <= item.minimumAllowedAmount;
                const pct = item.minimumAllowedAmount > 0 ? Math.min(100, (item.currentAmount / (item.minimumAllowedAmount * 3)) * 100) : 100;
                return (
                  <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50/50 ${isLow ? "bg-red-50/20" : ""}`}>
                    <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{item.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{item.type}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLow ? "text-red-600" : "text-green-600"}`}>{item.currentAmount.toLocaleString()} {item.unit}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct < 30 ? "bg-red-400" : pct < 60 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{item.minimumAllowedAmount.toLocaleString()} {item.unit}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        isLow ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"
                      }`}>{isLow ? "منخفض" : "متوفر"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-slate-400 text-sm">لا توجد حركات مخزون مسجلة حالياً</p>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="تسوية المخزون">
        <div className="space-y-4">
          <FormField label="الصنف" required>
            <select value={adj.item} onChange={(e) => setA("item", e.target.value)} className={selectCls}>
              <option value="">اختر الصنف...</option>
              {stockItems.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="نوع الحركة" required>
              <select value={adj.type} onChange={(e) => setA("type", e.target.value)} className={selectCls}>
                <option value="وارد">وارد (إضافة)</option>
                <option value="صادر">صادر (خصم)</option>
              </select>
            </FormField>
            <FormField label="الكمية" required>
              <input value={adj.qty} onChange={(e) => setA("qty", e.target.value)} placeholder="0" className={inputCls} type="number" min="1" />
            </FormField>
          </div>
          <FormField label="رقم المرجع / أمر التشغيل">
            <input value={adj.ref} onChange={(e) => setA("ref", e.target.value)} placeholder="مثال: WO-2024-0086" className={inputCls} />
          </FormField>
          <FormField label="سبب التسوية">
            <input value={adj.reason} onChange={(e) => setA("reason", e.target.value)} placeholder="مثال: تلف، مرتجع، تصحيح كشف..." className={inputCls} />
          </FormField>
        </div>
        <ModalFooter onClose={() => setShowModal(false)} onConfirm={handleAdjust} confirmLabel="تأكيد التسوية" loading={saving} />
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { Settings as SettingsIcon, Bell, Printer, Users, Lock } from "lucide-react";
import { toast } from "sonner";
import { inputCls, selectCls } from "../components/Modal";

const sections = [
  { key: "general", label: "الإعدادات العامة", icon: SettingsIcon },
  { key: "users", label: "إدارة المستخدمين", icon: Users },
  { key: "notifications", label: "الإشعارات", icon: Bell },
  { key: "printing", label: "إعدادات الطباعة", icon: Printer },
  { key: "security", label: "الأمان", icon: Lock },
];



export function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [factoryName, setFactoryName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [currency, setCurrency] = useState("ريال سعودي (SAR)");
  const [timezone, setTimezone] = useState("Asia/Riyadh (UTC+3)");
  const [notifications, setNotifications] = useState({
    lowStock: true, lateOrders: true, newOrders: false, dailyReport: true,
  });

  const handleSaveGeneral = () => {
    toast.success("تم حفظ الإعدادات العامة بنجاح");
  };

  const handleSavePrinting = () => {
    toast.success("تم حفظ إعدادات الطباعة بنجاح");
  };

  const handleSaveSecurity = () => {
    toast.success("تم تحديث إعدادات الأمان بنجاح");
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">الإعدادات</h1>
        <p className="text-slate-500 text-sm mt-0.5">إدارة إعدادات النظام</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-52 shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-all border-b border-slate-50 last:border-0 ${
                    activeSection === s.key ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeSection === s.key ? "text-[#2563EB]" : "text-slate-400"}`} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === "general" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-800">الإعدادات العامة</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">اسم المصنع</label>
                  <input value={factoryName} onChange={(e) => setFactoryName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">الرقم الضريبي</label>
                  <input value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">العملة</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectCls}>
                    <option>ريال سعودي (SAR)</option>
                    <option>درهم إماراتي (AED)</option>
                    <option>دولار أمريكي (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">المنطقة الزمنية</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectCls}>
                    <option>Asia/Riyadh (UTC+3)</option>
                    <option>Asia/Dubai (UTC+4)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button onClick={handleSaveGeneral} className="bg-[#2563EB] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm">
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">إدارة المستخدمين</h3>
              <p className="text-slate-400 text-sm">سيتم إضافة إدارة المستخدمين قريباً</p>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800">إعدادات الإشعارات</h3>
              {[
                { key: "lowStock", label: "تنبيه انخفاض المخزون", sub: "إشعار عند وصول المخزون للحد الأدنى" },
                { key: "lateOrders", label: "تنبيه الطلبات المتأخرة", sub: "إشعار عند تأخر أمر التشغيل عن الموعد" },
                { key: "newOrders", label: "أوامر تشغيل جديدة", sub: "إشعار عند إنشاء أمر تشغيل جديد" },
                { key: "dailyReport", label: "التقرير اليومي", sub: "إرسال تقرير يومي للأداء صباحاً" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/40">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{n.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.sub}</p>
                  </div>
                  <button
                    onClick={() => {
                      const key = n.key as keyof typeof notifications;
                      const next = !notifications[key];
                      setNotifications((prev) => ({ ...prev, [key]: next }));
                      toast.success(`${n.label}: ${next ? "تم التفعيل" : "تم الإيقاف"}`);
                    }}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      notifications[n.key as keyof typeof notifications] ? "bg-[#2563EB]" : "bg-slate-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                      notifications[n.key as keyof typeof notifications] ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === "printing" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800">إعدادات الطباعة</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "طابعة الفواتير الافتراضية", type: "select", opts: ["HP LaserJet Pro", "Canon imageCLASS", "Epson EcoTank"] },
                  { label: "حجم الورق", type: "select", opts: ["A4", "A5", "Letter"] },
                  { label: "عدد نسخ الفاتورة", type: "input", placeholder: "2" },
                  { label: "ترويسة الفاتورة", type: "input", placeholder: "مصنع الكرتون المتطور" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                    {f.type === "select" ? (
                      <select className={selectCls}>{f.opts?.map((o) => <option key={o}>{o}</option>)}</select>
                    ) : (
                      <input placeholder={f.placeholder} className={inputCls} />
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button onClick={handleSavePrinting} className="bg-[#2563EB] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm">
                  حفظ إعدادات الطباعة
                </button>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800">إعدادات الأمان</h3>
              <div className="space-y-3">
                {[
                  { label: "كلمة المرور الحالية", placeholder: "أدخل كلمة المرور الحالية" },
                  { label: "كلمة المرور الجديدة", placeholder: "أدخل كلمة مرور جديدة" },
                  { label: "تأكيد كلمة المرور الجديدة", placeholder: "أعد إدخال كلمة المرور الجديدة" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                    <input type="password" placeholder={f.placeholder} className={inputCls} />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button onClick={handleSaveSecurity} className="bg-[#2563EB] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm">
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

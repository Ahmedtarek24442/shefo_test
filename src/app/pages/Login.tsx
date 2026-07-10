import { useState } from "react";
import { useNavigate } from "react-router";
import { Factory, Lock, User } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', { phone: username, password });
      login(res.data.access_token, res.data.user);
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E293B] to-[#2563EB] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 border border-white rounded-full" />
          <div className="absolute top-32 right-32 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-20 left-20 w-80 h-80 border border-white rounded-full" />
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Factory className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">مصنع الكرتون المتطور</h1>
          <p className="text-blue-200 text-lg mb-8">نظام إدارة الإنتاج والموارد</p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { n: "٢٤٨", l: "عميل" },
              { n: "١٢٠٠+", l: "أمر تشغيل" },
              { n: "٩٨٪", l: "كفاءة الإنتاج" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold">{s.n}</p>
                <p className="text-blue-200 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center bg-[#F1F5F9] p-8">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">تسجيل الدخول</h2>
              <p className="text-slate-500 text-sm mt-1">أدخل بياناتك للوصول إلى النظام</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">اسم المستخدم</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg pr-10 pl-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg pr-10 pl-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-[#2563EB]" />
                  تذكرني
                </label>
                <button type="button" onClick={() => toast.info("يرجى التواصل مع مدير النظام لإعادة تعيين كلمة المرور")} className="text-sm text-[#2563EB] hover:underline">نسيت كلمة المرور؟</button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1E40AF] disabled:bg-blue-300 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-blue-500/20"
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">نظام إدارة مصنع الكرتون © {new Date().getFullYear()}</p>
        <Toaster position="top-left" richColors />
        </div>
      </div>
    </div>
  );
}

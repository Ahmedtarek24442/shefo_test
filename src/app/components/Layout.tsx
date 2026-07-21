import { Outlet, useNavigate, useLocation, Navigate } from "react-router";
import { Toaster } from "sonner";
import {
  Home,
  Users,
  ClipboardList,
  Factory as FactoryIcon,
  Layers,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  User,
  LogOut,
  Bell,
  Search,
  Truck,
  Box,
} from "lucide-react";
import { cn } from "./ui/utils";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { icon: Home, label: "الرئيسية", path: "/" },
  { icon: Users, label: "العملاء", path: "/customers" },
  { icon: ClipboardList, label: "أوامر التشغيل", path: "/work-orders" },
  { icon: Truck, label: "الموردين", path: "/suppliers" },
  { icon: Truck, label: "اومر التوريد", path: "/supplier-orders" },
  { icon: Layers, label: "الخامات", path: "/materials" },
  { icon: Box, label: "المنتجات", path: "/products" },
  { icon: Package, label: "المخزون", path: "/inventory" },
  { icon: DollarSign, label: "الحسابات", path: "/accounts" },
  { icon: BarChart3, label: "التقارير", path: "/reports" },
  { icon: Settings, label: "الإعدادات", path: "/settings" },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">جاري التحميل...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]" dir="rtl">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1E293B] text-white flex flex-col fixed right-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <FactoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">مصنع الكرتون</p>
              <p className="text-[11px] text-slate-400">نظام إدارة الإنتاج</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                  active
                    ? "bg-[#2563EB] text-white font-semibold shadow-lg shadow-blue-900/30"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-slate-400")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400">مدير النظام</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="flex-1 mr-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full h-8 bg-slate-100 rounded-lg pr-9 pl-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Toaster position="top-left" richColors />
      </div>
    </div>
  );
}

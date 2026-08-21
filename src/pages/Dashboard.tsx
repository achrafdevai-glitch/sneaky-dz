import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Layers,
  Truck,
  Star,
} from "lucide-react";

const Dashboard = () => {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const menuItems = [
    { path: "/dashboard/orders", icon: ShoppingCart, label: "الطلبات" },
    { path: "/dashboard/products", icon: Package, label: "المنتجات" },
    { path: "/dashboard/categories", icon: Layers, label: "الأصناف" },
    { path: "/dashboard/delivery", icon: Truck, label: "التوصيل" },
    { path: "/dashboard/reviews", icon: Star, label: "التقييمات" },
    { path: "/dashboard/stats", icon: BarChart3, label: "الإحصائيات" },
    { path: "/dashboard/settings", icon: Settings, label: "الإعدادات" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="w-64 min-h-[calc(100vh-57px)] bg-card border-l border-border/50 hidden md:block">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? "bg-white text-black"
                    : "hover:bg-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 md:hidden z-50 safe-area-bottom">
          <div className="flex justify-around py-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? "text-white bg-white/10"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.jpeg";

const HeroSection = () => {
  const { data: settings } = useSettings();
  const { login } = useAdmin();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [clickCount, setClickCount] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const heroVideo = settings?.hero_video || "/videos/hero-video.mp4";

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 2) {
      setShowLoginDialog(true);
      setClickCount(0);
    }
    
    setTimeout(() => setClickCount(0), 500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setShowLoginDialog(false);
      navigate("/dashboard");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      
      {/* Animated Gold Particles Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-gold animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-gold-light animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-gold animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-gold-light animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-6 left-6 z-20 glass rounded-full w-12 h-12 hover:scale-110 transition-all duration-300 border border-gold/30"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-gold" />
        ) : (
          <Moon className="h-5 w-5 text-gold" />
        )}
      </Button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Floating Logo with Glow */}
        <div 
          className="animate-float cursor-pointer group"
          onClick={handleLogoClick}
        >
          <div className="relative">
            {/* Glow Ring */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-gold/20 via-gold-light/30 to-gold/20 blur-xl animate-glow" />
            
            {/* Logo Container */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-gold/50 shadow-2xl group-hover:border-gold transition-all duration-500">
              <img
                src={logo}
                alt="Fashion Store Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            {/* Decorative Ring */}
            <div className="absolute -inset-2 rounded-full border border-gold/30 animate-pulse" />
          </div>
        </div>

        {/* Store Name with Luxury Typography */}
        <div className="mt-10 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-wide">
            <span className="gradient-text drop-shadow-lg">Fashion Store</span>
          </h1>
          
          {/* Decorative Line */}
          <div className="mt-6 mx-auto w-40 md:w-56">
            <div className="divider-gold" />
          </div>
          
          {/* Tagline */}
          <p className="mt-6 text-lg md:text-xl text-white/80 font-light tracking-widest uppercase">
            أناقة تليق بك
          </p>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToProducts}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-white/70 hover:text-gold transition-colors duration-300 group"
        >
          <span className="text-sm tracking-wider uppercase">اكتشف المنتجات</span>
          <div className="w-10 h-16 border-2 border-current rounded-full flex justify-center pt-2 group-hover:border-gold transition-colors">
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </button>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md glass border-gold/20" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-serif gradient-text">
              تسجيل الدخول
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground">اسم المستخدم</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="h-12 border-gold/30 focus:border-gold bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="h-12 border-gold/30 focus:border-gold bg-background/50"
              />
            </div>
            {error && (
              <p className="text-destructive text-sm text-center bg-destructive/10 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg btn-luxury rounded-xl font-medium"
            >
              دخول
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;

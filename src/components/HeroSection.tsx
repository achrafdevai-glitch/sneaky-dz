import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
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
import logo from "@/assets/logo.png";

const HeroSection = () => {
  const { data: settings } = useSettings();
  const { login } = useAdmin();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [clickCount, setClickCount] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const heroVideo = settings?.hero_video || "/videos/hero-video.mp4";

  // Smooth video transition when source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.opacity = '0';
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play();
          videoRef.current.style.opacity = '1';
        }
      }, 300);
    }
  }, [heroVideo]);

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


  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background with smooth transition */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ pointerEvents: "none" }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      
      {/* Animated Particles Effect */}
      <div className="absolute inset-0 opacity-40">
        <motion.div 
          animate={{ y: [-20, 20], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white"
        />
        <motion.div 
          animate={{ y: [20, -20], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-white"
        />
        <motion.div 
          animate={{ y: [-15, 15], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-white"
        />
      </div>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-6 left-6 z-20 glass rounded-full w-12 h-12 hover:scale-110 transition-all duration-300 border border-white/30"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-white" />
        ) : (
          <Moon className="h-5 w-5 text-white" />
        )}
      </Button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Floating Circular Logo */}
        <motion.div 
          className="cursor-pointer group"
          onClick={handleLogoClick}
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 rounded-full bg-white/10 blur-2xl" />
            
            {/* Circular Logo Container - Black part only */}
            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-700 shadow-2xl bg-transparent">
              <img
                src={logo}
                alt="Sneaky Shop Logo"
                className="w-full h-full object-cover drop-shadow-2xl mix-blend-multiply dark:mix-blend-screen dark:invert"
              />
            </div>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xl md:text-2xl text-white/80 font-light tracking-[0.3em] uppercase">
            Dress Than Differently
          </p>
          
          {/* Decorative Line */}
          <div className="mt-6 mx-auto w-40 md:w-56">
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md glass border-white/20" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-serif text-white">
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
                className="h-12 border-white/30 focus:border-white bg-background/50"
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
                className="h-12 border-white/30 focus:border-white bg-background/50"
              />
            </div>
            {error && (
              <p className="text-destructive text-sm text-center bg-destructive/10 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-white text-black hover:bg-white/90 rounded-xl font-medium"
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

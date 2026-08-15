import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import StoreFaqSection from "@/components/StoreFaqSection";
import PageTransition from "@/components/PageTransition";
import { Instagram, Facebook } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Index = () => {
  const socialLinks = {
    facebook: "https://www.facebook.com/profile.php?id=61587324234197",
    tiktok: "https://www.tiktok.com/@sneaky_.shop",
    instagram: "https://www.instagram.com/sneaky_.shop/",
  };

  return (
    <PageTransition>
      <main className="min-h-screen transition-theme overflow-hidden bg-background">
        <HeroSection />
        <CategoriesSection />
        
        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-12 px-4 bg-gradient-to-t from-secondary/50 to-background border-t border-border/20" 
          dir="rtl"
        >
          <div className="container mx-auto">
            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors duration-300 border border-white/20"
              >
                <Facebook className="w-6 h-6 text-white" />
              </motion.a>
              
              <motion.a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] transition-colors duration-300 border border-white/20"
              >
                <Instagram className="w-6 h-6 text-white" />
              </motion.a>
              
              <motion.a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-black transition-colors duration-300 border border-white/20"
              >
                <TikTokIcon />
              </motion.a>
            </div>

            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-white/30" />
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white tracking-wider">
                SNEAKY SHOP
              </h3>
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Sneaky Shop. جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </motion.footer>
      </main>
    </PageTransition>
  );
};

export default Index;

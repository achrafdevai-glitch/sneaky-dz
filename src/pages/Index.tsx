import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import PageTransition from "@/components/PageTransition";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <PageTransition>
      <main className="min-h-screen transition-theme overflow-hidden">
        <HeroSection />
        <ProductsSection />
        
        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 px-4 bg-gradient-to-t from-secondary/50 to-background border-t border-gold/10" 
          dir="rtl"
        >
          <div className="container mx-auto">
            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-6 mb-10">
              <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-gold/40" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-gold" />
              </motion.div>
              <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-gold/40" />
            </div>
            
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-serif">
                <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                  Fashion Store
                </span>
              </h3>
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} Fashion Store. جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </motion.footer>
      </main>
    </PageTransition>
  );
};

export default Index;

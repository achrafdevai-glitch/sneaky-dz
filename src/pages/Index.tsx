import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen transition-theme">
      <HeroSection />
      <ProductsSection />
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t border-gold/10" dir="rtl">
        <div className="container mx-auto">
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-gold/30" />
            <Sparkles className="w-5 h-5 text-gold" />
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-gold/30" />
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-serif gradient-text">Fashion Store</h3>
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Fashion Store. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;

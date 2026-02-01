import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";

const Index = () => {
  return (
    <main className="min-h-screen transition-theme">
      <HeroSection />
      <ProductsSection />
      
      {/* Footer */}
      <footer className="py-8 px-4 bg-card border-t" dir="rtl">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Fashion Store. جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;

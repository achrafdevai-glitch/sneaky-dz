import { useState } from "react";
import { motion } from "framer-motion";
import { useProducts, Product } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import AnimatedSection from "./AnimatedSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ShoppingBag } from "lucide-react";

const ProductsSection = () => {
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading) {
    return (
      <section id="products-section" className="py-24 px-4 bg-background" dir="rtl">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-40 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id="products-section" className="py-24 px-4 bg-background" dir="rtl">
        <div className="container mx-auto text-center">
          <SectionHeader />
          <AnimatedSection delay={0.3}>
            <div className="mt-16 p-16 rounded-3xl bg-gradient-to-br from-secondary/50 to-muted/30 border border-gold/10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShoppingBag className="w-20 h-20 mx-auto text-gold/50 mb-6" />
              </motion.div>
              <p className="text-2xl font-serif text-foreground mb-2">
                لا توجد منتجات متاحة حالياً
              </p>
              <p className="text-muted-foreground">
                سيتم إضافة المنتجات قريباً!
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section id="products-section" className="py-24 px-4 bg-gradient-to-b from-background via-secondary/20 to-background transition-theme overflow-hidden" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto relative">
        <SectionHeader />

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              index={index}
            />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mt-12">
          <Carousel
            opts={{
              align: "start",
              direction: "rtl",
            }}
            className="w-full"
          >
            <CarouselContent className="-mr-4">
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="basis-[85%] sm:basis-[48%] pr-4">
                  <ProductCard
                    product={product}
                    onSelect={setSelectedProduct}
                    index={index}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/90 dark:bg-card/90 border-gold/30 hover:bg-gold hover:text-primary-foreground hover:border-gold transition-all shadow-lg" />
            <CarouselNext className="right-2 bg-white/90 dark:bg-card/90 border-gold/30 hover:bg-gold hover:text-primary-foreground hover:border-gold transition-all shadow-lg" />
          </Carousel>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

const SectionHeader = () => (
  <AnimatedSection className="text-center">
    {/* Premium decorative element */}
    <motion.div 
      className="flex items-center justify-center gap-6 mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-gold/50" />
      <div className="relative">
        <Sparkles className="w-6 h-6 text-gold" />
        <motion.div 
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border border-gold/30 rounded-full" />
        </motion.div>
      </div>
      <div className="h-[2px] w-16 bg-gradient-to-l from-transparent via-gold to-gold/50" />
    </motion.div>
    
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
      <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
        Our Collection
      </span>
    </h2>
    
    {/* Elegant underline */}
    <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-gold/50 via-gold to-gold/50" />
  </AnimatedSection>
);

export default ProductsSection;

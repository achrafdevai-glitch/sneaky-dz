import { useState } from "react";
import { useProducts, Product } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

const ProductsSection = () => {
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading) {
    return (
      <section id="products-section" className="py-20 px-4 bg-background section-pattern" dir="rtl">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-40 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
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
      <section id="products-section" className="py-20 px-4 bg-background section-pattern" dir="rtl">
        <div className="container mx-auto text-center">
          <SectionHeader />
          <div className="mt-16 p-12 rounded-2xl glass border border-gold/20">
            <Sparkles className="w-16 h-16 mx-auto text-gold mb-6" />
            <p className="text-xl text-muted-foreground">
              لا توجد منتجات متاحة حالياً
            </p>
            <p className="text-muted-foreground mt-2">
              سيتم إضافة المنتجات قريباً!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products-section" className="py-20 px-4 bg-background section-pattern transition-theme" dir="rtl">
      <div className="container mx-auto">
        <SectionHeader />

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16">
          {products.map((product, index) => (
            <div key={product.id} className="group">
              <ProductCard
                product={product}
                onSelect={setSelectedProduct}
                index={index}
              />
            </div>
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
            <CarouselContent className="-mr-3">
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="basis-[48%] pr-3">
                  <div className="group">
                    <ProductCard
                      product={product}
                      onSelect={setSelectedProduct}
                      index={index}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-1/2 bg-background border-gold/30 hover:bg-gold hover:text-primary-foreground transition-colors" />
            <CarouselNext className="right-0 translate-x-1/2 bg-background border-gold/30 hover:bg-gold hover:text-primary-foreground transition-colors" />
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
  <div className="text-center animate-slide-up">
    {/* Decorative Element */}
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
      <Sparkles className="w-5 h-5 text-gold" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
    
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold">
      <span className="gradient-text">منتجاتنا المميزة</span>
    </h2>
    
    {/* Decorative Divider */}
    <div className="mt-6 mx-auto w-32">
      <div className="divider-gold" />
    </div>
    
    <p className="mt-6 text-muted-foreground text-lg max-w-md mx-auto">
      اكتشف تشكيلتنا الفريدة من الأزياء العصرية
    </p>
  </div>
);

export default ProductsSection;

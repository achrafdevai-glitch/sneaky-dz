import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories, Category } from "@/hooks/useCategories";
import { useProducts, Product } from "@/hooks/useProducts";
import AnimatedSection from "@/components/AnimatedSection";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Sparkles } from "lucide-react";

const CategoriesSection = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isLoading = categoriesLoading || productsLoading;

  // Get products for selected category
  const filteredProducts = selectedCategory
    ? allProducts?.filter((p) => p.category_id === selectedCategory) || []
    : allProducts || [];

  const selectedCategoryData = categories?.find((c) => c.id === selectedCategory);

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-background" dir="rtl">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-background min-h-screen" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            // Categories Grid View
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Section Header */}
              <AnimatedSection className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50" />
                  <Sparkles className="w-5 h-5 text-white" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                  الأصناف
                </h2>
              </AnimatedSection>

              {/* Categories Grid */}
              {(!categories || categories.length === 0) ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">لا توجد أصناف متاحة</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/30 hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-2xl">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: category.color + "20" }}
                          >
                            <div
                              className="w-16 h-16 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Category Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                            {category.name}
                          </h3>
                          <p className="text-white/60 text-sm mt-1">
                            {allProducts?.filter(p => p.category_id === category.id).length || 0} منتج
                          </p>
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-white rotate-180" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* All Products Section */}
              {allProducts && allProducts.length > 0 && (
                <div className="mt-16">
                  <AnimatedSection className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      جميع المنتجات
                    </h2>
                  </AnimatedSection>
                  
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {allProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard
                          product={product}
                          onSelect={setSelectedProduct}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            // Products in Category View
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                <span>العودة للأصناف</span>
              </motion.button>

              {/* Category Header */}
              <AnimatedSection className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {selectedCategoryData?.name}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {filteredProducts.length} منتج
                </p>
              </AnimatedSection>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">لا توجد منتجات في هذا الصنف</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard
                          product={product}
                          onSelect={setSelectedProduct}
                        />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
};

export default CategoriesSection;

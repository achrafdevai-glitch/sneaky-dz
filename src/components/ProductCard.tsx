import { motion } from "framer-motion";
import { Product } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles, TrendingDown, XCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index?: number;
}

const ProductCard = ({ product, onSelect, index = 0 }: ProductCardProps) => {
  const { data: variants } = useProductVariants(product.id);
  
  const discount = Math.round(((product.old_price - product.new_price) / product.old_price) * 100);
  
  // Check stock: if using variants, check variant stock; if show_quantity enabled, check product.stock
  const hasVariants = variants && variants.length > 0;
  const totalVariantStock = hasVariants ? variants.reduce((sum, v) => sum + v.stock, 0) : null;
  const isOutOfStock = hasVariants 
    ? totalVariantStock === 0 
    : (product.show_quantity && product.stock !== null && product.stock <= 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8 }}
    >
      <Card 
        className={`overflow-hidden cursor-pointer bg-card border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group relative ${isOutOfStock ? 'opacity-75' : ''}`}
        onClick={() => onSelect(product)}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold/20 to-transparent z-10 pointer-events-none" />
        
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 z-20"
            >
              <div className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg">
                <XCircle className="w-5 h-5" />
                نفذت الكمية
              </div>
            </motion.div>
          )}
          
          {/* Discount Badge */}
          {discount > 0 && !isOutOfStock && (
            <motion.div 
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute top-3 left-3 flex items-center gap-1.5 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-2 rounded-full shadow-lg"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-{discount}%</span>
            </motion.div>
          )}

          {/* Quick View Button */}
          {!isOutOfStock && (
            <motion.div 
              className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100"
              initial={{ y: 20 }}
              whileHover={{ y: 0 }}
            >
              <Button 
                className="w-full bg-white/95 text-foreground hover:bg-white rounded-xl shadow-2xl font-medium backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(product);
                }}
              >
                <Sparkles className="w-4 h-4 ml-2 text-gold" />
                عرض التفاصيل
              </Button>
            </motion.div>
          )}
        </div>
        
        <CardContent className="p-5 space-y-4 bg-gradient-to-b from-card to-secondary/30" dir="rtl">
          {/* Product Name */}
          <h3 className="font-serif text-lg font-semibold line-clamp-2 leading-tight group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Price Section - Premium Design */}
          <div className="space-y-2">
            <div className="flex items-end gap-3">
              <span className={`text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent ${isOutOfStock ? 'opacity-50' : ''}`}>
                {product.new_price.toLocaleString()}
              </span>
              <span className="text-sm text-gold/80 font-medium pb-0.5">د.ج</span>
            </div>
            
            {product.old_price > product.new_price && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground/60 line-through">
                  {product.old_price.toLocaleString()} د.ج
                </span>
                <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                  وفّر {(product.old_price - product.new_price).toLocaleString()} د.ج
                </span>
              </div>
            )}
          </div>
          
          {/* Order Button - Premium */}
          <motion.div whileHover={{ scale: isOutOfStock ? 1 : 1.02 }} whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}>
            <Button 
              className={`w-full rounded-xl h-12 text-base font-medium shadow-lg transition-all duration-300 group/btn overflow-hidden relative ${
                isOutOfStock 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-gold hover:via-gold hover:to-gold-light text-primary-foreground hover:shadow-xl'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) onSelect(product);
              }}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? (
                <>
                  <XCircle className="w-5 h-5 ml-2" />
                  نفذت الكمية
                </>
              ) : (
                <>
                  <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-white/20 to-gold/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <ShoppingBag className="w-5 h-5 ml-2 group-hover/btn:rotate-12 transition-transform" />
                  اطلب الآن
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;

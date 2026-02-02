import { Product } from "@/hooks/useProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index?: number;
}

const ProductCard = ({ product, onSelect, index = 0 }: ProductCardProps) => {
  const discount = Math.round(((product.old_price - product.new_price) / product.old_price) * 100);

  return (
    <Card 
      className={`card-luxury overflow-hidden cursor-pointer bg-card border-0 shadow-lg animate-scale-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>-{discount}%</span>
          </div>
        )}

        {/* Quick View on Hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <Button 
            className="w-full btn-luxury rounded-xl shadow-xl"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
          >
            <ShoppingBag className="w-4 h-4 ml-2" />
            عرض المنتج
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3" dir="rtl">
        {/* Product Name */}
        <h3 className="font-serif text-lg font-semibold line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-xl font-bold text-gold">
            {product.new_price.toLocaleString()} د.ج
          </span>
          {product.old_price > product.new_price && (
            <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
              {product.old_price.toLocaleString()} د.ج
            </span>
          )}
        </div>
        
        {/* Order Button */}
        <Button 
          className="w-full mt-2 bg-primary hover:bg-primary/90 rounded-xl h-11 text-base transition-all duration-300 hover:shadow-lg group"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
        >
          <ShoppingBag className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
          اطلب الآن
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

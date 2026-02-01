import { Product } from "@/hooks/useProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const discount = Math.round(((product.old_price - product.new_price) / product.old_price) * 100);

  return (
    <Card 
      className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-square overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}
      </div>
      
      <CardContent className="p-4" dir="rtl">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary">
            {product.new_price.toLocaleString()} د.ج
          </span>
          {product.old_price > product.new_price && (
            <span className="text-sm text-muted-foreground line-through">
              {product.old_price.toLocaleString()} د.ج
            </span>
          )}
        </div>
        
        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ShoppingBag className="w-4 h-4 ml-2" />
          اطلب الآن
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

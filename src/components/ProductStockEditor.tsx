import { useEffect, useState } from "react";
import { Product, useUpdateProduct } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Package } from "lucide-react";
import { toast } from "sonner";

interface ProductStockEditorProps {
  product: Product;
}

/** Quick stock display + inline edit for simple (non-variant) products. */
const ProductStockEditor = ({ product }: ProductStockEditorProps) => {
  const { data: variants } = useProductVariants(product.id);
  const updateProduct = useUpdateProduct();
  const [value, setValue] = useState(product.stock?.toString() ?? "");

  useEffect(() => {
    setValue(product.stock?.toString() ?? "");
  }, [product.stock]);

  const hasVariants = (variants?.length ?? 0) > 0;

  if (hasVariants) {
    const total = (variants || []).reduce((sum, v) => sum + Math.max(0, v.stock), 0);
    return (
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Package className="h-4 w-4" />
          المخزون الكلي
        </span>
        {total === 0 ? (
          <span className="text-destructive font-semibold">نفذت الكمية</span>
        ) : (
          <span className="font-semibold text-gold">{total}</span>
        )}
      </div>
    );
  }

  if (product.stock === null || product.stock === undefined) {
    return (
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Package className="h-4 w-4" />
          المخزون
        </span>
        <span className="text-muted-foreground">غير محدود</span>
      </div>
    );
  }

  const parsed = Math.max(0, parseInt(value || "0", 10) || 0);
  const dirty = parsed !== product.stock;

  const save = async () => {
    try {
      await updateProduct.mutateAsync({ id: product.id, stock: parsed });
      toast.success("تم تحديث المخزون");
    } catch {
      toast.error("تعذّر تحديث المخزون");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
        <Package className="h-4 w-4" />
        المخزون
      </span>
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setValue(String(parsed))}
        className="h-8 w-20 text-center"
      />
      {product.stock === 0 && !dirty && (
        <span className="text-xs text-destructive font-semibold">نفذت</span>
      )}
      {dirty && (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={save}
          disabled={updateProduct.isPending}
        >
          {updateProduct.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4 text-gold" />
          )}
        </Button>
      )}
    </div>
  );
};

export default ProductStockEditor;

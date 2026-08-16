import { Product } from "@/hooks/useProducts";
import { ProductVariant } from "@/hooks/useProductVariants";
import { Label } from "@/components/ui/label";
import { Palette, Ruler, XCircle } from "lucide-react";

export interface VariantSelection {
  color: string | null;
  size: string | null;
  shoeSize: string | null;
}

interface VariantPickerProps {
  product: Product;
  variants: ProductVariant[] | undefined;
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
}

const CLOTHING = ["S", "M", "L", "XL", "XXL", "XXXL"];

const VariantPicker = ({ product, variants, selection, onChange }: VariantPickerProps) => {
  const hasVariants = !!variants && variants.length > 0;
  const colors = product.colors || [];

  const availableForColor = selection.color && hasVariants
    ? variants!.filter((v) => v.color === selection.color && v.stock > 0)
    : [];

  const clothingSizes = hasVariants
    ? availableForColor.filter((v) => CLOTHING.includes(v.size)).map((v) => ({ size: v.size, stock: v.stock }))
    : (product.sizes || []).map((s) => ({ size: s, stock: null as number | null }));

  const shoeSizes = hasVariants
    ? availableForColor.filter((v) => !CLOTHING.includes(v.size)).map((v) => ({ size: v.size, stock: v.stock }))
    : (product.shoe_sizes || []).map((s) => ({ size: s, stock: null as number | null }));

  return (
    <div className="space-y-4" dir="rtl">
      {colors.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Palette className="w-4 h-4 text-gold" />
            اللون {hasVariants && <span className="text-xs text-muted-foreground">(اختر اللون أولاً)</span>}
          </Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const available = !hasVariants || variants!.some((v) => v.color === color && v.stock > 0);
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`اللون ${color}`}
                  disabled={!available}
                  onClick={() => onChange({ color, size: null, shoeSize: null })}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    selection.color === color
                      ? "border-gold ring-2 ring-gold ring-offset-2 ring-offset-background"
                      : available
                        ? "border-border hover:border-gold/50"
                        : "border-border opacity-30 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {!available && <XCircle className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasVariants && colors.length > 0 && !selection.color && (
        <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-center">
          <p className="text-sm text-gold">اختر اللون أولاً لعرض المقاسات المتوفرة</p>
        </div>
      )}

      {clothingSizes.length > 0 && (!hasVariants || selection.color) && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Ruler className="w-4 h-4 text-gold" />
            المقاس
          </Label>
          <div className="flex flex-wrap gap-2">
            {clothingSizes.map(({ size, stock }) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ ...selection, size, shoeSize: null })}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selection.size === size ? "bg-gold text-black border-gold" : "border-border hover:border-gold/50"
                }`}
              >
                {size}
                {stock !== null && stock > 0 && stock <= 3 && (
                  <span className="text-xs mr-1 text-destructive">({stock})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {shoeSizes.length > 0 && (!hasVariants || selection.color) && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Ruler className="w-4 h-4 text-gold" />
            مقاس الحذاء
          </Label>
          <div className="flex flex-wrap gap-2">
            {shoeSizes.map(({ size, stock }) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ ...selection, shoeSize: size, size: null })}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selection.shoeSize === size ? "bg-gold text-black border-gold" : "border-border hover:border-gold/50"
                }`}
              >
                {size}
                {stock !== null && stock > 0 && stock <= 3 && (
                  <span className="text-xs mr-1 text-destructive">({stock})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantPicker;

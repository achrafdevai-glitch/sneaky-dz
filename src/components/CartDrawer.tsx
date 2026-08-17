import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import CartCheckoutForm from "./CartCheckoutForm";

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [checkout, setCheckout] = useState(false);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeCart();
          setCheckout(false);
        }
      }}
    >
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto" dir="rtl">
        <SheetHeader className="text-right">
          <SheetTitle className="font-serif text-2xl">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              {checkout ? "إتمام الطلب" : `سلة التسوق (${totalItems})`}
            </span>
          </SheetTitle>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {checkout ? (
            <motion.div key="checkout" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-6">
              <CartCheckoutForm
                onCancel={() => setCheckout(false)}
                onSuccess={() => {
                  setCheckout(false);
                  closeCart();
                }}
              />
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
              <ShoppingBag className="w-14 h-14 opacity-30" />
              <p>سلتك فارغة</p>
            </motion.div>
          ) : (
            <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 p-3 rounded-2xl border border-border/60 bg-card/50">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {item.color && (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.color }} />
                        </span>
                      )}
                      {(item.size || item.shoeSize) && <span>المقاس: {item.size || item.shoeSize}</span>}
                    </div>
                    <p className="text-gold font-bold text-sm">{(item.unitPrice * item.quantity).toLocaleString()} د.ج</p>
                    <div className="flex items-center gap-2 pt-1">
                      <Button type="button" variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        disabled={item.maxStock !== null && item.quantity >= item.maxStock}
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 mr-auto" onClick={() => removeItem(item.key)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <span className="text-muted-foreground">المجموع (بدون التوصيل)</span>
                <span className="text-xl font-bold text-gold">{subtotal.toLocaleString()} د.ج</span>
              </div>

              <Button
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold text-primary-foreground font-medium"
                onClick={() => setCheckout(true)}
              >
                متابعة الطلب
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

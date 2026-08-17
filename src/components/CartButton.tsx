import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartButton = () => {
  const { totalItems, openCart } = useCart();

  return (
    <motion.button
      type="button"
      onClick={openCart}
      aria-label="فتح سلة التسوق"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-light text-primary-foreground shadow-2xl flex items-center justify-center"
    >
      <ShoppingCart className="w-6 h-6" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CartButton;

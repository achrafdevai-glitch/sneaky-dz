import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, X, Sparkles, ShoppingBag, TrendingDown, Tag, XCircle } from "lucide-react";
import OrderForm from "./OrderForm";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  const { data: variants } = useProductVariants(product?.id || null);

  if (!product) return null;

  const images = product.images || [];
  const hasVideo = !!product.video_url;
  
  // Check stock: if using variants, check variant stock; if show_quantity enabled, check product.stock
  const hasVariants = variants && variants.length > 0;
  const totalVariantStock = hasVariants ? variants.reduce((sum, v) => sum + v.stock, 0) : null;
  const isOutOfStock = hasVariants 
    ? totalVariantStock === 0 
    : (product.show_quantity && product.stock !== null && product.stock <= 0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const discount = Math.round(
    ((product.old_price - product.new_price) / product.old_price) * 100
  );

  const savings = product.old_price - product.new_price;

  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-gold/20 p-0 rounded-3xl shadow-2xl" dir="rtl">
        <AnimatePresence mode="wait">
          {showOrderForm ? (
            <motion.div
              key="order-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-serif text-center">
                  <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                    إتمام الطلب
                  </span>
                </DialogTitle>
              </DialogHeader>
              <OrderForm
                product={product}
                onSuccess={() => {
                  setShowOrderForm(false);
                  onClose();
                }}
                onCancel={() => setShowOrderForm(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="product-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Image/Video Gallery */}
              <div className="relative aspect-square bg-gradient-to-br from-secondary to-muted overflow-hidden rounded-t-3xl">
                <AnimatePresence mode="wait">
                  {showVideo && hasVideo ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-full h-full"
                    >
                      <video
                        src={product.video_url!}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-10 h-10 hover:bg-destructive"
                        onClick={() => setShowVideo(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`image-${currentImageIndex}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      {images.length > 0 ? (
                        <img
                          src={images[currentImageIndex]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-24 h-24 text-muted-foreground/20" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && !showVideo && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full w-12 h-12 shadow-xl hover:bg-white dark:hover:bg-black/70"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full w-12 h-12 shadow-xl hover:bg-white dark:hover:bg-black/70"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Video Button */}
                {hasVideo && !showVideo && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="absolute bottom-4 left-4 bg-white/90 text-foreground hover:bg-white rounded-full shadow-xl"
                      onClick={() => setShowVideo(true)}
                    >
                      <Play className="h-4 w-4 ml-2 text-gold" />
                      شاهد الفيديو
                    </Button>
                  </motion.div>
                )}

                {/* Image Counter */}
                {images.length > 1 && !showVideo && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg"
                  >
                    <TrendingDown className="w-4 h-4" />
                    -{discount}%
                  </motion.div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Product Title */}
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl font-serif leading-tight">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>

                {/* Thumbnails */}
                {(images.length > 1 || hasVideo) && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((image, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setShowVideo(false);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          currentImageIndex === index && !showVideo
                            ? "border-gold shadow-lg shadow-gold/30"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                    {hasVideo && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowVideo(true)}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-secondary ${
                          showVideo
                            ? "border-gold shadow-lg shadow-gold/30"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Play className="h-6 w-6 text-gold" />
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Premium Price Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-muted/50 border border-gold/10"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    {/* New Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                        {product.new_price.toLocaleString()}
                      </span>
                      <span className="text-lg text-gold font-medium">د.ج</span>
                    </div>
                    
                    {product.old_price > product.new_price && (
                      <>
                        {/* Old Price */}
                        <span className="text-lg text-muted-foreground/50 line-through decoration-2">
                          {product.old_price.toLocaleString()} د.ج
                        </span>
                        
                        {/* Savings Badge */}
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          وفّر {savings.toLocaleString()} د.ج
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Out of Stock Notice */}
                {isOutOfStock && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center gap-3"
                  >
                    <XCircle className="w-6 h-6 text-destructive" />
                    <span className="text-lg font-bold text-destructive">نفذت الكمية - المنتج غير متوفر حالياً</span>
                  </motion.div>
                )}

                {/* Order Button - Premium */}
                <motion.div
                  whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                  whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                >
                  <Button
                    size="lg"
                    className={`w-full text-lg py-7 rounded-2xl font-medium relative overflow-hidden group ${
                      isOutOfStock
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-gradient-to-r from-gold via-gold-light to-gold hover:from-primary hover:to-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500'
                    }`}
                    onClick={() => !isOutOfStock && setShowOrderForm(true)}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? (
                      <>
                        <XCircle className="w-6 h-6 ml-3" />
                        <span>نفذت الكمية</span>
                      </>
                    ) : (
                      <>
                        {/* Shine effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        
                        <ShoppingBag className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                        <span className="relative">اطلب الآن</span>
                        <Sparkles className="w-5 h-5 mr-3 opacity-70" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;

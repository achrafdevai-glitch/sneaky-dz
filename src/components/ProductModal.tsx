import { useState } from "react";
import { Product } from "@/hooks/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, X, Sparkles, ShoppingBag } from "lucide-react";
import OrderForm from "./OrderForm";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  if (!product) return null;

  const images = product.images || [];
  const hasVideo = !!product.video_url;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const discount = Math.round(
    ((product.old_price - product.new_price) / product.old_price) * 100
  );

  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto glass border-gold/20 p-0" dir="rtl">
        {showOrderForm ? (
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-serif gradient-text text-center">
                إتمام الطلب
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
          </div>
        ) : (
          <>
            {/* Image/Video Gallery */}
            <div className="relative aspect-square bg-muted overflow-hidden">
              {showVideo && hasVideo ? (
                <div className="relative w-full h-full">
                  <video
                    src={product.video_url!}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 glass rounded-full w-10 h-10 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setShowVideo(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover animate-fade-in"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <ShoppingBag className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-3 top-1/2 -translate-y-1/2 glass rounded-full w-10 h-10 hover:bg-gold hover:text-primary-foreground transition-colors"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 glass rounded-full w-10 h-10 hover:bg-gold hover:text-primary-foreground transition-colors"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}

                  {/* Video Button */}
                  {hasVideo && (
                    <Button
                      size="sm"
                      className="absolute bottom-4 left-4 btn-luxury rounded-full shadow-xl"
                      onClick={() => setShowVideo(true)}
                    >
                      <Play className="h-4 w-4 ml-2" />
                      شاهد الفيديو
                    </Button>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </>
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
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setShowVideo(false);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index && !showVideo
                          ? "border-gold shadow-lg shadow-gold/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {hasVideo && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-muted ${
                        showVideo
                          ? "border-gold shadow-lg shadow-gold/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Play className="h-6 w-6 text-gold" />
                    </button>
                  )}
                </div>
              )}

              {/* Price Section */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                <span className="text-3xl font-bold text-gold">
                  {product.new_price.toLocaleString()} د.ج
                </span>
                {product.old_price > product.new_price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                      {product.old_price.toLocaleString()} د.ج
                    </span>
                    <span className="flex items-center gap-1 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Order Button */}
              <Button
                size="lg"
                className="w-full text-lg py-7 btn-luxury rounded-xl font-medium animate-pulse-gold"
                onClick={() => setShowOrderForm(true)}
              >
                <ShoppingBag className="w-5 h-5 ml-2" />
                اطلب الآن
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;

import { useState } from "react";
import { Product } from "@/hooks/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        {showOrderForm ? (
          <OrderForm
            product={product}
            onSuccess={() => {
              setShowOrderForm(false);
              onClose();
            }}
            onCancel={() => setShowOrderForm(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Image/Video Gallery */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
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
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => setShowVideo(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      لا توجد صور
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}

                  {/* Video Button */}
                  {hasVideo && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 left-4"
                      onClick={() => setShowVideo(true)}
                    >
                      <Play className="h-4 w-4 ml-1" />
                      شاهد الفيديو
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setShowVideo(false);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index && !showVideo
                        ? "border-primary"
                        : "border-transparent"
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
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-muted ${
                      showVideo ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Play className="h-6 w-6" />
                  </button>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {product.new_price.toLocaleString()} د.ج
              </span>
              {product.old_price > product.new_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {product.old_price.toLocaleString()} د.ج
                  </span>
                  <span className="bg-destructive text-destructive-foreground text-sm font-bold px-2 py-1 rounded-full">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Order Button */}
            <Button
              size="lg"
              className="w-full text-lg py-6"
              onClick={() => setShowOrderForm(true)}
            >
              اطلب الآن
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;

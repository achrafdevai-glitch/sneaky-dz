import { motion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";
import { useProductReviews } from "@/hooks/useProductReviews";
import { Skeleton } from "@/components/ui/skeleton";
import StarRating from "./StarRating";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { data: reviews, isLoading, isError } = useProductReviews(productId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive text-center py-4">
        تعذّر تحميل التقييمات، حاول لاحقاً
      </p>
    );
  }

  const count = reviews?.length || 0;
  const average = count > 0 ? reviews!.reduce((s, r) => s + r.rating, 0) / count : 0;

  return (
    <section className="space-y-4" aria-label="تقييمات المنتج">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-semibold">تقييمات المنتج</h3>
      </div>

      {count === 0 ? (
        <div className="text-center py-6 rounded-2xl bg-secondary/40 border border-border/40">
          <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">لا توجد تقييمات لهذا المنتج بعد</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-gold/10">
            <div className="text-3xl font-bold text-gold">{average.toFixed(1)}</div>
            <div className="space-y-1">
              <StarRating value={average} size="sm" />
              <p className="text-xs text-muted-foreground">بناءً على {count} تقييم</p>
            </div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pl-1">
            {reviews!.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.3) }}
                className="p-4 rounded-xl bg-card border border-border/50 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">{review.customer_name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(review.created_at), "dd MMM yyyy", { locale: ar })}
                  </span>
                </div>
                <StarRating value={review.rating} size="sm" />
                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed break-words">
                    {review.comment}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default ProductReviews;

import { motion, AnimatePresence } from "framer-motion";
import { useAllReviews, useDeleteReview } from "@/hooks/useProductReviews";
import { useProducts } from "@/hooks/useProducts";
import { useSettings, useUpdateSetting } from "@/hooks/useSettings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StarRating from "@/components/StarRating";
import { Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const ReviewsPage = () => {
  const { data: reviews, isLoading } = useAllReviews();
  const { data: products } = useProducts();
  const { data: settings } = useSettings();
  const updateSetting = useUpdateSetting();
  const deleteReview = useDeleteReview();

  const enabled = settings?.reviews_enabled !== "false";

  const productName = (id: string) =>
    products?.find((p) => p.id === id)?.name || "منتج محذوف";

  const handleToggle = async (value: boolean) => {
    try {
      await updateSetting.mutateAsync({ key: "reviews_enabled", value: value ? "true" : "false" });
      toast.success(value ? "تم تفعيل التقييمات" : "تم إخفاء التقييمات");
    } catch {
      toast.error("تعذّر تحديث الإعداد");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا التقييم؟")) return;
    try {
      await deleteReview.mutateAsync(id);
      toast.success("تم حذف التقييم");
    } catch {
      toast.error("تعذّر الحذف");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-2xl font-bold">التقييمات</h2>

      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50">
        <div>
          <Label className="text-base">إظهار التقييمات في المتجر</Label>
          <p className="text-xs text-muted-foreground">تحكم عام في ظهور التقييمات للزبائن</p>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          لا توجد تقييمات بعد
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="p-4 rounded-xl bg-card border border-border/50 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium truncate">{productName(review.product_id)}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.customer_name} — {format(new Date(review.created_at), "dd/MM/yyyy HH:mm")}
                    </p>
                    <StarRating value={review.rating} size="sm" />
                    {review.comment && (
                      <p className="text-sm text-muted-foreground break-words">{review.comment}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;

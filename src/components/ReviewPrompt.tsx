import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/useProductReviews";
import StarRating from "./StarRating";
import { toast } from "sonner";

interface ReviewPromptProps {
  productId: string;
  productName: string;
  orderId?: string | null;
  customerName: string;
  onDone: () => void;
}

const ReviewPrompt = ({ productId, productName, orderId, customerName, onDone }: ReviewPromptProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const createReview = useCreateReview();

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("يرجى اختيار عدد النجوم أولاً");
      return;
    }
    try {
      await createReview.mutateAsync({
        product_id: productId,
        order_id: orderId || null,
        customer_name: customerName,
        rating,
        comment,
      });
      setSubmitted(true);
      toast.success("شكراً لك! تم إرسال تقييمك");
      setTimeout(onDone, 1600);
    } catch (error) {
      toast.error("تعذّر إرسال التقييم، حاول مرة أخرى");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 space-y-4"
      >
        <CheckCircle className="w-14 h-14 mx-auto text-green-500" />
        <p className="text-lg font-semibold">تم تسجيل تقييمك بنجاح</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 text-center py-4"
    >
      <div className="space-y-1">
        <Sparkles className="w-8 h-8 mx-auto text-gold" />
        <h3 className="text-xl font-serif font-bold">ما رأيك في المنتج؟</h3>
        <p className="text-sm text-muted-foreground truncate">{productName}</p>
      </div>

      <div className="flex justify-center">
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="space-y-2 text-right">
        <Textarea
          placeholder="اكتب تعليقاً (اختياري)"
          value={comment}
          maxLength={1000}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-24 rounded-xl bg-secondary/30 border-border/50 focus:border-gold"
        />
        <p className="text-xs text-muted-foreground">{comment.length}/1000</p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-gold-light text-primary-foreground"
          onClick={handleSubmit}
          disabled={createReview.isPending}
        >
          {createReview.isPending ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            "إرسال التقييم"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onDone}
          disabled={createReview.isPending}
        >
          تخطي
        </Button>
      </div>
    </motion.div>
  );
};

export default ReviewPrompt;

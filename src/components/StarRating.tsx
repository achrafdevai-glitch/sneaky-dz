import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-9 h-9",
};

const StarRating = ({ value, onChange, size = "md", className = "" }: StarRatingProps) => {
  const interactive = !!onChange;

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      dir="ltr"
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "اختر عدد النجوم" : `التقييم ${value.toFixed(1)} من 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const Icon = (
          <Star
            className={`${sizes[size]} transition-colors ${
              filled ? "fill-gold text-gold" : "text-muted-foreground/40"
            }`}
          />
        );

        if (!interactive) return <span key={star}>{Icon}</span>;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === Math.round(value)}
            aria-label={`${star} من 5`}
            onClick={() => onChange(star)}
            className="rounded-full p-0.5 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {Icon}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

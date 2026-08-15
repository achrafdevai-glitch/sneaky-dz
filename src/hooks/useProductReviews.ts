import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductReview {
  id: string;
  product_id: string;
  order_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
}

export const useProductReviews = (productId: string | null) => {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProductReview[];
    },
    enabled: !!productId,
  });
};

/** All reviews (dashboard) */
export const useAllReviews = () => {
  return useQuery({
    queryKey: ["product-reviews", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProductReview[];
    },
  });
};

/** Aggregated rating summary per product, used for cards/listings */
export const useReviewSummaries = () => {
  return useQuery({
    queryKey: ["product-reviews", "summaries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("product_id, rating");

      if (error) throw error;

      const map: Record<string, ReviewSummary> = {};
      (data || []).forEach((row: { product_id: string; rating: number }) => {
        const current = map[row.product_id] || { average: 0, count: 0 };
        const total = current.average * current.count + row.rating;
        current.count += 1;
        current.average = total / current.count;
        map[row.product_id] = current;
      });
      return map;
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      product_id: string;
      order_id?: string | null;
      customer_name: string;
      rating: number;
      comment?: string | null;
    }) => {
      const rating = Math.round(review.rating);
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        throw new Error("INVALID_RATING");
      }
      const comment = (review.comment || "").trim().slice(0, 1000);

      const { data, error } = await supabase
        .from("product_reviews")
        .insert({
          product_id: review.product_id,
          order_id: review.order_id || null,
          customer_name: (review.customer_name || "زبون").trim().slice(0, 100) || "زبون",
          rating,
          comment: comment.length > 0 ? comment : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
    },
  });
};

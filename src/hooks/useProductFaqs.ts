import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductFaq {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export const useProductFaqs = (productId: string | null) => {
  return useQuery({
    queryKey: ["product-faqs", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_faqs")
        .select("*")
        .eq("product_id", productId)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ProductFaq[];
    },
    enabled: !!productId,
  });
};

const validate = (question: string, answer: string) => {
  const q = question.trim();
  const a = answer.trim();
  if (q.length < 1 || q.length > 300) throw new Error("INVALID_QUESTION");
  if (a.length < 1 || a.length > 2000) throw new Error("INVALID_ANSWER");
  return { q, a };
};

export const useCreateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faq: { product_id: string; question: string; answer: string; position?: number }) => {
      const { q, a } = validate(faq.question, faq.answer);
      const { data, error } = await supabase
        .from("product_faqs")
        .insert({ product_id: faq.product_id, question: q, answer: a, position: faq.position ?? 0 })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-faqs", variables.product_id] });
    },
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faq: { id: string; product_id: string; question: string; answer: string; position?: number }) => {
      const { q, a } = validate(faq.question, faq.answer);
      const { data, error } = await supabase
        .from("product_faqs")
        .update({ question: q, answer: a, ...(faq.position !== undefined ? { position: faq.position } : {}) })
        .eq("id", faq.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-faqs", variables.product_id] });
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productId }: { id: string; productId: string }) => {
      const { error } = await supabase.from("product_faqs").delete().eq("id", id);
      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ["product-faqs", productId] });
    },
  });
};

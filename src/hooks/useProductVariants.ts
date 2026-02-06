import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  size: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export const useProductVariants = (productId: string | null) => {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("color", { ascending: true });

      if (error) throw error;
      return data as ProductVariant[];
    },
    enabled: !!productId,
  });
};

export const useUpsertVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variant: Omit<ProductVariant, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("product_variants")
        .upsert(variant, { onConflict: "product_id,color,size" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", variables.product_id] });
    },
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productId }: { id: string; productId: string }) => {
      const { error } = await supabase.from("product_variants").delete().eq("id", id);
      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", productId] });
    },
  });
};

export const useBulkUpsertVariants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variants }: { productId: string; variants: { color: string; size: string; stock: number }[] }) => {
      // First delete all existing variants for this product
      await supabase.from("product_variants").delete().eq("product_id", productId);
      
      // Then insert the new ones
      if (variants.length > 0) {
        const variantsWithProductId = variants.map(v => ({
          product_id: productId,
          color: v.color,
          size: v.size,
          stock: v.stock,
        }));
        
        const { error } = await supabase
          .from("product_variants")
          .insert(variantsWithProductId);
          
        if (error) throw error;
      }
      
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", productId] });
    },
  });
};

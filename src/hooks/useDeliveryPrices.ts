import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DeliveryPrice {
  id: string;
  wilaya: string;
  home_price: number;
  office_price: number;
  created_at: string;
  updated_at: string;
}

export const useDeliveryPrices = () => {
  return useQuery({
    queryKey: ["delivery_prices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_prices")
        .select("*")
        .order("wilaya", { ascending: true });

      if (error) throw error;
      return data as DeliveryPrice[];
    },
  });
};

export const getDeliveryPrice = (
  deliveryPrices: DeliveryPrice[] | undefined,
  wilaya: string,
  deliveryType: "home" | "office"
): number => {
  if (!deliveryPrices) return 0;
  const price = deliveryPrices.find((p) => p.wilaya === wilaya);
  if (!price) return 600; // default
  return deliveryType === "home" ? price.home_price : price.office_price;
};

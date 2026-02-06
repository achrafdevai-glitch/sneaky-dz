-- Create product_variants table for color-size-stock combinations
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, color, size)
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Product variants are publicly readable" 
ON public.product_variants FOR SELECT USING (true);

CREATE POLICY "Product variants can be inserted" 
ON public.product_variants FOR INSERT WITH CHECK (true);

CREATE POLICY "Product variants can be updated" 
ON public.product_variants FOR UPDATE USING (true);

CREATE POLICY "Product variants can be deleted" 
ON public.product_variants FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to decrease stock on new order
CREATE OR REPLACE FUNCTION public.decrease_variant_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Only decrease stock for pending orders (new orders)
  IF NEW.status = 'pending' THEN
    UPDATE public.product_variants
    SET stock = stock - NEW.quantity
    WHERE product_id = NEW.product_id
      AND color = NEW.selected_color
      AND size = COALESCE(NEW.selected_size, NEW.selected_shoe_size);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to decrease stock on order insert
CREATE TRIGGER decrease_stock_on_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.decrease_variant_stock();
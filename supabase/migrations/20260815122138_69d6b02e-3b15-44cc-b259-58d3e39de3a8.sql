-- 1) Order confirmation timestamp
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;

CREATE OR REPLACE FUNCTION public.set_order_confirmed_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM 'confirmed') AND NEW.confirmed_at IS NULL THEN
    NEW.confirmed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_order_confirmed_at ON public.orders;
CREATE TRIGGER set_order_confirmed_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_order_confirmed_at();

-- 2) Safe, atomic stock validation + decrement
CREATE OR REPLACE FUNCTION public.decrease_variant_stock()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_qty integer := GREATEST(COALESCE(NEW.quantity, 1), 1);
  v_size text := COALESCE(NEW.selected_size, NEW.selected_shoe_size);
  v_has_variants boolean;
  v_available integer;
  v_updated integer;
  v_show_quantity boolean;
  v_stock integer;
BEGIN
  IF NEW.product_id IS NULL OR NEW.status = 'cancelled' THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = NEW.product_id)
    INTO v_has_variants;

  IF v_has_variants THEN
    IF NEW.selected_color IS NULL OR v_size IS NULL THEN
      RAISE EXCEPTION 'MISSING_VARIANT_SELECTION';
    END IF;

    UPDATE public.product_variants
       SET stock = stock - v_qty
     WHERE product_id = NEW.product_id
       AND color = NEW.selected_color
       AND size = v_size
       AND stock >= v_qty;

    GET DIAGNOSTICS v_updated = ROW_COUNT;

    IF v_updated = 0 THEN
      SELECT COALESCE(stock, 0) INTO v_available
        FROM public.product_variants
       WHERE product_id = NEW.product_id
         AND color = NEW.selected_color
         AND size = v_size;
      RAISE EXCEPTION 'OUT_OF_STOCK:%', COALESCE(v_available, 0);
    END IF;

    RETURN NEW;
  END IF;

  SELECT COALESCE(show_quantity, false), stock
    INTO v_show_quantity, v_stock
    FROM public.products
   WHERE id = NEW.product_id;

  IF v_stock IS NOT NULL THEN
    UPDATE public.products
       SET stock = stock - v_qty
     WHERE id = NEW.product_id
       AND stock >= v_qty;

    GET DIAGNOSTICS v_updated = ROW_COUNT;

    IF v_updated = 0 THEN
      SELECT COALESCE(stock, 0) INTO v_available FROM public.products WHERE id = NEW.product_id;
      RAISE EXCEPTION 'OUT_OF_STOCK:%', COALESCE(v_available, 0);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS decrease_stock_on_order ON public.orders;
CREATE TRIGGER decrease_stock_on_order
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.decrease_variant_stock();

-- Restock when an order is cancelled
CREATE OR REPLACE FUNCTION public.restock_on_cancel()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_qty integer := GREATEST(COALESCE(NEW.quantity, 1), 1);
  v_size text := COALESCE(NEW.selected_size, NEW.selected_shoe_size);
  v_updated integer;
BEGIN
  IF NEW.product_id IS NULL THEN
    RETURN NEW;
  END IF;
  IF NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'cancelled' THEN
    UPDATE public.product_variants
       SET stock = stock + v_qty
     WHERE product_id = NEW.product_id
       AND color = NEW.selected_color
       AND size = v_size;
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    IF v_updated = 0 THEN
      UPDATE public.products
         SET stock = stock + v_qty
       WHERE id = NEW.product_id
         AND stock IS NOT NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restock_on_cancel ON public.orders;
CREATE TRIGGER restock_on_cancel
AFTER UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.restock_on_cancel();

-- Prevent negative stock at the data level
ALTER TABLE public.product_variants DROP CONSTRAINT IF EXISTS product_variants_stock_non_negative;
ALTER TABLE public.product_variants ADD CONSTRAINT product_variants_stock_non_negative CHECK (stock >= 0);
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_stock_non_negative;
ALTER TABLE public.products ADD CONSTRAINT products_stock_non_negative CHECK (stock IS NULL OR stock >= 0);

-- 3) Product reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name text NOT NULL DEFAULT 'زبون',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text CHECK (comment IS NULL OR char_length(comment) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.product_reviews TO anon, authenticated;
GRANT DELETE, UPDATE ON public.product_reviews TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.product_reviews;
CREATE POLICY "Reviews are publicly readable" ON public.product_reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Reviews can be inserted" ON public.product_reviews;
CREATE POLICY "Reviews can be inserted" ON public.product_reviews FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Reviews can be updated" ON public.product_reviews;
CREATE POLICY "Reviews can be updated" ON public.product_reviews FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Reviews can be deleted" ON public.product_reviews;
CREATE POLICY "Reviews can be deleted" ON public.product_reviews FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON public.product_reviews(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS product_reviews_order_unique ON public.product_reviews(order_id) WHERE order_id IS NOT NULL;

-- 4) Product FAQs
CREATE TABLE IF NOT EXISTS public.product_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  question text NOT NULL CHECK (char_length(question) BETWEEN 1 AND 300),
  answer text NOT NULL CHECK (char_length(answer) BETWEEN 1 AND 2000),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_faqs TO anon, authenticated;
GRANT ALL ON public.product_faqs TO service_role;

ALTER TABLE public.product_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product FAQs are publicly readable" ON public.product_faqs;
CREATE POLICY "Product FAQs are publicly readable" ON public.product_faqs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Product FAQs can be inserted" ON public.product_faqs;
CREATE POLICY "Product FAQs can be inserted" ON public.product_faqs FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Product FAQs can be updated" ON public.product_faqs;
CREATE POLICY "Product FAQs can be updated" ON public.product_faqs FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Product FAQs can be deleted" ON public.product_faqs;
CREATE POLICY "Product FAQs can be deleted" ON public.product_faqs FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_product_faqs_updated_at ON public.product_faqs;
CREATE TRIGGER update_product_faqs_updated_at
BEFORE UPDATE ON public.product_faqs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS product_faqs_product_id_idx ON public.product_faqs(product_id, position);

-- 5) Reviews toggle setting
INSERT INTO public.settings (key, value)
SELECT 'reviews_enabled', 'true'
WHERE NOT EXISTS (SELECT 1 FROM public.settings WHERE key = 'reviews_enabled');
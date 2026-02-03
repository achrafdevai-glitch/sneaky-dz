-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  color TEXT DEFAULT '#D4AF37',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories can be inserted" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Categories can be updated" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Categories can be deleted" ON public.categories FOR DELETE USING (true);

-- Add category_id to products
ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Add sizes and colors columns to products
ALTER TABLE public.products ADD COLUMN sizes TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN colors TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN shoe_sizes TEXT[] DEFAULT '{}';

-- Create delivery_prices table
CREATE TABLE public.delivery_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wilaya TEXT NOT NULL UNIQUE,
  home_price NUMERIC NOT NULL DEFAULT 600,
  office_price NUMERIC NOT NULL DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for delivery_prices
ALTER TABLE public.delivery_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery_prices
CREATE POLICY "Delivery prices are publicly readable" ON public.delivery_prices FOR SELECT USING (true);
CREATE POLICY "Delivery prices can be inserted" ON public.delivery_prices FOR INSERT WITH CHECK (true);
CREATE POLICY "Delivery prices can be updated" ON public.delivery_prices FOR UPDATE USING (true);

-- Add delivery_price column to orders
ALTER TABLE public.orders ADD COLUMN delivery_price NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN selected_size TEXT;
ALTER TABLE public.orders ADD COLUMN selected_color TEXT;
ALTER TABLE public.orders ADD COLUMN selected_shoe_size TEXT;
ALTER TABLE public.orders ADD COLUMN address_detail TEXT;

-- Create trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for delivery_prices updated_at
CREATE TRIGGER update_delivery_prices_updated_at
BEFORE UPDATE ON public.delivery_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all Algerian wilayas with delivery prices
INSERT INTO public.delivery_prices (wilaya, office_price, home_price) VALUES
('الجزائر', 500, 500),
('البليدة', 500, 600),
('بومرداس', 500, 600),
('تيبازة', 500, 600),
('الشلف', 500, 600),
('البويرة', 500, 600),
('تيزي وزو', 500, 600),
('سطيف', 500, 600),
('قسنطينة', 500, 600),
('المدية', 500, 600),
('وهران', 500, 600),
('برج بوعريريج', 500, 600),
('عين الدفلى', 500, 600),
('أم البواقي', 500, 600),
('بجاية', 500, 600),
('باتنة', 500, 600),
('تلمسان', 500, 600),
('تيارت', 500, 600),
('جيجل', 500, 600),
('سكيكدة', 500, 600),
('سيدي بلعباس', 500, 600),
('عنابة', 500, 600),
('مستغانم', 500, 600),
('المسيلة', 500, 600),
('تيسمسيلت', 500, 600),
('ميلة', 500, 600),
('الجلفة', 600, 700),
('سعيدة', 600, 700),
('قالمة', 600, 700),
('معسكر', 600, 700),
('خنشلة', 600, 700),
('سوق أهراس', 600, 700),
('عين تموشنت', 600, 700),
('بسكرة', 700, 800),
('تبسة', 700, 800),
('الطارف', 700, 800),
('الأغواط', 800, 900),
('أولاد جلال', 800, 900),
('ورقلة', 900, 1000),
('البيض', 900, 1000),
('الوادي', 900, 1000),
('النعامة', 900, 1000),
('غرداية', 900, 1000),
('تقرت', 900, 1000),
('المغير', 900, 1000),
('المنيعة', 1000, 1100),
('أدرار', 1100, 1200),
('بشار', 1100, 1200),
('تيميمون', 1100, 1200),
('بني عباس', 1100, 1200),
('عين صالح', 1100, 1200),
('تمنراست', 1400, 1600),
('تندوف', 1600, 1800),
('إليزي', 1800, 2000),
('برج باجي مختار', 1800, 2000),
('عين قزام', 1800, 2000);
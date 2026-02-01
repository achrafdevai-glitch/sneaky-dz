-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  old_price DECIMAL(10,2) NOT NULL,
  new_price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table  
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('home', 'office')),
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table for hero video
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default hero video setting
INSERT INTO public.settings (key, value) VALUES ('hero_video', '/videos/hero-video.mp4');

-- Create storage bucket for product images/videos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);

-- Products can be managed by anyone (no auth for admin simplicity)
CREATE POLICY "Products can be inserted" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products can be updated" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products can be deleted" ON public.products FOR DELETE USING (true);

-- Orders are publicly readable and insertable
CREATE POLICY "Orders are publicly readable" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders can be inserted" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders can be updated" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Orders can be deleted" ON public.orders FOR DELETE USING (true);

-- Settings are publicly readable and manageable
CREATE POLICY "Settings are publicly readable" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings can be updated" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Settings can be inserted" ON public.settings FOR INSERT WITH CHECK (true);

-- Storage policies for product media
CREATE POLICY "Product media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-media');
CREATE POLICY "Anyone can upload product media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-media');
CREATE POLICY "Anyone can update product media" ON storage.objects FOR UPDATE USING (bucket_id = 'product-media');
CREATE POLICY "Anyone can delete product media" ON storage.objects FOR DELETE USING (bucket_id = 'product-media');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
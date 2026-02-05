-- إضافة حقول الملاحظات والكمية للمنتجات
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS show_notes BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_quantity BOOLEAN DEFAULT false;

-- إضافة حقل الكمية والملاحظات للطلبات
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL;
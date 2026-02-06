-- Add stock quantity to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer DEFAULT null;

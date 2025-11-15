-- Create enum for item categories
CREATE TYPE item_category AS ENUM (
  'electronics',
  'clothing',
  'accessories',
  'bags',
  'documents',
  'keys',
  'jewelry',
  'other'
);

-- Create enum for item status
CREATE TYPE item_status AS ENUM (
  'active',
  'matched',
  'claimed',
  'expired'
);

-- Create lost_items table
CREATE TABLE public.lost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category item_category NOT NULL,
  description TEXT NOT NULL,
  last_seen_location TEXT NOT NULL,
  date_lost DATE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  image_url TEXT,
  status item_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create found_items table
CREATE TABLE public.found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category item_category NOT NULL,
  description TEXT NOT NULL,
  found_location TEXT NOT NULL,
  date_found DATE NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  image_url TEXT,
  status item_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create matches table to track potential matches
CREATE TABLE public.item_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_item_id UUID REFERENCES public.lost_items(id) ON DELETE CASCADE,
  found_item_id UUID REFERENCES public.found_items(id) ON DELETE CASCADE,
  match_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lost_item_id, found_item_id)
);

-- Enable RLS on all tables
ALTER TABLE public.lost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lost_items
CREATE POLICY "Anyone can view lost items"
  ON public.lost_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create lost items"
  ON public.lost_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lost items"
  ON public.lost_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lost items"
  ON public.lost_items FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for found_items
CREATE POLICY "Anyone can view found items"
  ON public.found_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create found items"
  ON public.found_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own found items"
  ON public.found_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own found items"
  ON public.found_items FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Anyone can view matches"
  ON public.item_matches FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create matches"
  ON public.item_matches FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true);

-- Storage policies
CREATE POLICY "Anyone can view item images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'item-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'item-images' AND auth.uid() IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_lost_items_updated_at
  BEFORE UPDATE ON public.lost_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_found_items_updated_at
  BEFORE UPDATE ON public.found_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
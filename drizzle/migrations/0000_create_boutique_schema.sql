-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- First signed-up user becomes admin
CREATE OR REPLACE FUNCTION public.handle_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_first_admin
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_first_admin();

-- Shop settings
CREATE TABLE public.shop_settings (
  id int PRIMARY KEY DEFAULT 1,
  shop_name text NOT NULL DEFAULT 'Maison Kaira',
  tagline text NOT NULL DEFAULT 'Style That Defines You',
  logo_url text,
  phone text NOT NULL DEFAULT '+91 98765 43210',
  whatsapp text NOT NULL DEFAULT '919876543210',
  email text NOT NULL DEFAULT 'hello@maisonkaira.com',
  address text NOT NULL DEFAULT '14 Linking Road, Bandra West, Mumbai 400050',
  maps_url text NOT NULL DEFAULT 'https://maps.google.com/?q=Linking+Road+Bandra+West+Mumbai',
  opening_hours text NOT NULL DEFAULT 'Mon – Sat: 10:30 AM – 9:00 PM\nSunday: 11:00 AM – 7:00 PM',
  instagram text NOT NULL DEFAULT 'https://instagram.com',
  facebook text NOT NULL DEFAULT 'https://facebook.com',
  about_text text NOT NULL DEFAULT 'For over eighteen years we have dressed a city that never stands still. What began as a single tailoring counter is now a boutique built on fabric, fit and an eye for what comes next — every piece chosen by hand, every customer fitted in person.',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
GRANT SELECT ON public.shop_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.shop_settings TO authenticated;
GRANT ALL ON public.shop_settings TO service_role;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shop settings are public" ON public.shop_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update shop settings" ON public.shop_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active categories are public" ON public.categories FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  sizes text[] NOT NULL DEFAULT '{}',
  colors text[] NOT NULL DEFAULT '{}',
  material text NOT NULL DEFAULT '',
  availability text NOT NULL DEFAULT 'In Store',
  image_url text,
  images text[] NOT NULL DEFAULT '{}',
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_trending boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are public" ON public.products FOR SELECT TO anon, authenticated USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Offers
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  headline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  starts_at date,
  expires_at date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active offers are public" ON public.offers FOR SELECT TO anon, authenticated
  USING ((is_active AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage offers" ON public.offers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Gallery
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is public" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enquiries
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  product text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send an enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed
INSERT INTO public.shop_settings (id) VALUES (1);

INSERT INTO public.categories (name, slug, image_url, sort_order) VALUES
  ('Women', 'women', '/images/cat-women.jpg', 1),
  ('Men', 'men', '/images/cat-men.jpg', 2),
  ('Kids', 'kids', '/images/cat-kids.jpg', 3),
  ('Casual Wear', 'casual', '/images/cat-casual.jpg', 4),
  ('Traditional Wear', 'traditional', '/images/cat-traditional.jpg', 5),
  ('Denim', 'denim', '/images/cat-denim.jpg', 6),
  ('T-Shirts', 't-shirts', '/images/cat-tshirts.jpg', 7),
  ('Shirts', 'shirts', '/images/cat-shirts.jpg', 8);

INSERT INTO public.products (name, slug, category_id, description, price, sizes, colors, material, image_url, images, is_new_arrival, is_featured, is_trending)
VALUES
  ('Black Oversized T-Shirt', 'black-oversized-tshirt', (SELECT id FROM public.categories WHERE slug='t-shirts'),
   'A heavyweight cotton tee cut with a relaxed drop shoulder. Softens beautifully with every wash.', 1290,
   '{"S","M","L","XL","XXL"}', '{"Black","Off White","Sand"}', '240 GSM combed cotton', '/images/p-tshirt.jpg', '{"/images/p-tshirt.jpg"}', true, true, true),
  ('Ivory Linen Shirt', 'ivory-linen-shirt', (SELECT id FROM public.categories WHERE slug='shirts'),
   'Breathable pure linen with a soft camp collar — made for long, warm days.', 2450,
   '{"S","M","L","XL"}', '{"Ivory","Olive","Sky"}', '100% European linen', '/images/p-linen-shirt.jpg', '{"/images/p-linen-shirt.jpg"}', true, false, true),
  ('Classic Indigo Denim Jacket', 'classic-indigo-denim-jacket', (SELECT id FROM public.categories WHERE slug='denim'),
   'Rigid selvedge indigo that fades to your shape. A jacket built to outlast trends.', 4290,
   '{"S","M","L","XL"}', '{"Indigo","Washed Blue"}', '13.5oz selvedge denim', '/images/p-denim-jacket.jpg', '{"/images/p-denim-jacket.jpg"}', true, true, true),
  ('Handloom Cotton Kurta', 'handloom-cotton-kurta', (SELECT id FROM public.categories WHERE slug='traditional'),
   'Woven on handlooms and finished with a fine mandarin collar. Quietly festive.', 3190,
   '{"S","M","L","XL","XXL"}', '{"Ecru","Charcoal","Terracotta"}', 'Handloom cotton', '/images/p-kurta.jpg', '{"/images/p-kurta.jpg"}', true, false, true),
  ('Wide Leg Pleated Trousers', 'wide-leg-pleated-trousers', (SELECT id FROM public.categories WHERE slug='women'),
   'A high-rise, fluid trouser with a single deep pleat. Tailored, never stiff.', 2990,
   '{"26","28","30","32","34"}', '{"Black","Stone"}', 'Viscose twill', '/images/p-trousers.jpg', '{"/images/p-trousers.jpg"}', true, true, false),
  ('Everyday Cotton Co-ord', 'everyday-cotton-coord', (SELECT id FROM public.categories WHERE slug='casual'),
   'Matching knit set in a washed sand tone. Wear it together or apart.', 3490,
   '{"XS","S","M","L"}', '{"Sand","Sage"}', 'Brushed cotton knit', '/images/p-coord.jpg', '{"/images/p-coord.jpg"}', false, false, true),
  ('Slim Fit Dark Denim', 'slim-fit-dark-denim', (SELECT id FROM public.categories WHERE slug='denim'),
   'A clean, dark-rinse jean with just enough stretch for everyday wear.', 2790,
   '{"30","32","34","36","38"}', '{"Dark Indigo","Jet Black"}', 'Stretch denim', '/images/p-jeans.jpg', '{"/images/p-jeans.jpg"}', false, false, true),
  ('Kids Relaxed Cotton Set', 'kids-relaxed-cotton-set', (SELECT id FROM public.categories WHERE slug='kids'),
   'Soft, roomy and built for playgrounds. Gentle on skin, tough on stains.', 1590,
   '{"2-3Y","4-5Y","6-7Y","8-9Y"}', '{"Cream","Sage"}', 'Organic cotton', '/images/cat-kids.jpg', '{"/images/cat-kids.jpg"}', false, false, false);

INSERT INTO public.offers (title, headline, description, image_url, expires_at) VALUES
  ('Festive Collection', 'Up to 30% OFF', 'Handloom kurtas, silk blends and occasion wear — reduced in store for the season.', '/images/offer-festive.jpg', CURRENT_DATE + 45),
  ('Denim Week', 'Buy 2, Save 20%', 'Every jean, jacket and denim shirt in the store, for a limited time only.', '/images/offer-denim.jpg', CURRENT_DATE + 20);

INSERT INTO public.gallery (image_url, caption, sort_order) VALUES
  ('/images/hero.jpg', 'The winter campaign', 1),
  ('/images/store-interior.jpg', 'Inside the Bandra store', 2),
  ('/images/p-denim-jacket.jpg', 'Indigo, always', 3),
  ('/images/cat-women.jpg', 'Linen season', 4),
  ('/images/store-exterior.jpg', 'Find us on Linking Road', 5),
  ('/images/p-kurta.jpg', 'Handloom detail', 6);
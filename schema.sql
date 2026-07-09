-- Migration Schema for DiayFacture

-- 1. Clients Table
CREATE TABLE public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Invoices Table
CREATE TABLE public.invoices (
    id TEXT PRIMARY KEY, -- e.g., 'DF/2026/042'
    client_name TEXT NOT NULL,
    client_phone TEXT,
    date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount TEXT NOT NULL,
    raw_amount NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('brouillon', 'envoyee', 'payee', 'en retard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Invoice Lines Table
CREATE TABLE public.invoice_lines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL
);

-- 5. Settings Table
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_name TEXT NOT NULL,
    profile_email TEXT NOT NULL,
    profile_phone TEXT NOT NULL,
    profile_role TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_address TEXT NOT NULL,
    company_ninea TEXT,
    company_currency TEXT NOT NULL DEFAULT 'XOF'
);

-- Insert default settings
INSERT INTO public.settings (profile_name, profile_email, profile_phone, profile_role, company_name, company_address, company_ninea, company_currency)
VALUES (
    'DIAYSIMA DESIGN', 'contact@diaysima.com', '+221 77 000 00 00', 'Fondateur & CEO',
    'DIAYSIMA DESIGN', 'Dakar, Sénégal', '', 'XOF'
);

-- Row Level Security (RLS) setup
-- For simplicity in this initial migration, we allow anon access.
-- In production, you should enable RLS and require authentication.

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert to clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to clients" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert to products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow public read access to invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert to invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to invoices" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to invoices" ON public.invoices FOR DELETE USING (true);

CREATE POLICY "Allow public read access to invoice_lines" ON public.invoice_lines FOR SELECT USING (true);
CREATE POLICY "Allow public insert to invoice_lines" ON public.invoice_lines FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to invoice_lines" ON public.invoice_lines FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to invoice_lines" ON public.invoice_lines FOR DELETE USING (true);

CREATE POLICY "Allow public read access to settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public update to settings" ON public.settings FOR UPDATE USING (true);

-- Realtime configuration
alter publication supabase_realtime add table public.clients;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.invoices;
alter publication supabase_realtime add table public.invoice_lines;
alter publication supabase_realtime add table public.settings;

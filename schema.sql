-- Migration Schema for DiayFacture

-- 1. Clients Table
CREATE TABLE public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Invoices Table
CREATE TABLE public.invoices (
    id TEXT PRIMARY KEY, -- e.g., 'DF/2026/042'
    user_id UUID DEFAULT auth.uid() NOT NULL,
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
    user_id UUID DEFAULT auth.uid() NOT NULL,
    invoice_id TEXT NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL
);

-- 5. Settings Table
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() NOT NULL,
    profile_name TEXT NOT NULL,
    profile_email TEXT NOT NULL,
    profile_phone TEXT NOT NULL,
    profile_role TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_address TEXT NOT NULL,
    company_ninea TEXT,
    company_currency TEXT NOT NULL DEFAULT 'XOF'
);

-- Insert default settings (Handled by frontend dynamically now per user)

-- Row Level Security (RLS) setup
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own clients" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON public.clients FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON public.invoices FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own invoice_lines" ON public.invoice_lines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoice_lines" ON public.invoice_lines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoice_lines" ON public.invoice_lines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoice_lines" ON public.invoice_lines FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own settings" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.settings FOR UPDATE USING (auth.uid() = user_id);

-- Realtime configuration
alter publication supabase_realtime add table public.clients;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.invoices;
alter publication supabase_realtime add table public.invoice_lines;
alter publication supabase_realtime add table public.settings;

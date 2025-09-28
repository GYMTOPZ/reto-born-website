-- Crear tabla para lista de espera
CREATE TABLE waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    feature VARCHAR(100) DEFAULT 'nutricion_inteligente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones públicas
CREATE POLICY "Allow public inserts" ON waitlist
    FOR INSERT TO anon
    WITH CHECK (true);

-- Política para que solo usuarios autenticados puedan leer
CREATE POLICY "Only authenticated users can read" ON waitlist
    FOR SELECT TO authenticated
    USING (true);
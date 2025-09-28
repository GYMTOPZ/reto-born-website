-- Primero, eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Allow public inserts" ON waitlist;
DROP POLICY IF EXISTS "Only authenticated users can read" ON waitlist;

-- Asegurarse de que RLS esté habilitado
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Crear política más permisiva para inserciones públicas
CREATE POLICY "Enable insert for all users" ON waitlist
    FOR INSERT
    WITH CHECK (true);

-- Mantener lectura solo para usuarios autenticados
CREATE POLICY "Enable read access for authenticated users only" ON waitlist
    FOR SELECT
    TO authenticated
    USING (true);

-- Verificar que la tabla existe y tiene la estructura correcta
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'waitlist';
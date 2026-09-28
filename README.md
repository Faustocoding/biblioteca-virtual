# Mi Biblioteca Virtual

App personal de biblioteca virtual: buscá y agregá libros (Open Library / Google Books),
llevá el estado de lectura, tus reseñas, citas favoritas, estadísticas y metas anuales.

## Stack

- React + Vite + Tailwind CSS
- PWA instalable (vite-plugin-pwa)
- Supabase (Postgres + Auth con magic link)
- Recharts para el dashboard de estadísticas

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local # completar con tus credenciales de Supabase
npm run dev
```

## Base de datos

El esquema inicial está en `supabase/schema.sql` y la migración a multi-usuario
(auth + RLS por usuario) en `supabase/migration_auth.sql`.

## Deploy

Pensado para desplegarse en Vercel. Variables de entorno necesarias:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

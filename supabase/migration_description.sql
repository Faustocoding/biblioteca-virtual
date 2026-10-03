-- Agrega una columna para guardar el resumen/descripción del libro.
-- Se completa automáticamente cuando el libro se agrega vía Google Books
-- (que ya trae la descripción en la búsqueda), o la primera vez que se
-- pide el resumen desde la app para libros de Open Library o agregados
-- manualmente (se guarda en caché para no volver a pedirla).

alter table books add column description text;

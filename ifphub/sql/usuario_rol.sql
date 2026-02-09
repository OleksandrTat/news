-- Añade columna de rol para controlar permisos.
alter table public.usuario
  add column if not exists rol text not null default 'usuario';

-- Ejemplo: elevar a admin por email (ajusta el correo).
-- update public.usuario
-- set rol = 'admin'
-- where mail = 'admin@ifp.es';

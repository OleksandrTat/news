-- Funcion: public.fn_crear_noticia
-- Inserta una noticia en public.noticia.
-- Ajusta el nombre de la tabla/columnas si tu esquema difiere.

-- Asegura un valor por defecto para id_noticia (evita nulls si no hay serial/identity).
do $$
begin
  if to_regclass('public.noticia') is not null then
    if not exists (
      select 1
      from pg_attrdef d
      join pg_attribute a on a.attrelid = d.adrelid and a.attnum = d.adnum
      where d.adrelid = 'public.noticia'::regclass
        and a.attname = 'id_noticia'
    ) then
      if not exists (
        select 1
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where c.relkind = 'S'
          and c.relname = 'noticia_id_noticia_seq'
          and n.nspname = 'public'
      ) then
        create sequence public.noticia_id_noticia_seq;
      end if;

      alter table public.noticia
        alter column id_noticia set default nextval('public.noticia_id_noticia_seq');
      alter sequence public.noticia_id_noticia_seq
        owned by public.noticia.id_noticia;
      perform setval(
        'public.noticia_id_noticia_seq',
        coalesce((select max(id_noticia) from public.noticia), 0),
        true
      );
    end if;
  end if;
end $$;

-- Elimina versiones anteriores para evitar ambigüedad en RPC y cambios de retorno.
drop function if exists public.fn_crear_noticia(text, text, text, integer);
drop function if exists public.fn_crear_noticia(text, text, text);

create or replace function public.fn_crear_noticia(
  p_titulo text,
  p_descripcion text,
  p_imagen text default null
)
returns table (
  id_noticia integer,
  titulo varchar,
  descripcion text,
  imagen varchar,
  fecha_hora timestamp
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  insert into public.noticia as n (titulo, descripcion, imagen, fecha_hora)
  values (
    trim(p_titulo),
    trim(p_descripcion),
    nullif(trim(p_imagen), ''),
    now()
  )
  returning
    n.id_noticia, n.titulo, n.descripcion, n.imagen, n.fecha_hora;
end;
$$;

grant execute on function public.fn_crear_noticia(text, text, text)
to anon, authenticated;

-- Si RLS bloquea inserciones, puedes optar por:
-- 1) Asignar como owner al rol que posee la tabla (p.ej. postgres).
-- 2) O crear una policy explicita para insertar en public.noticia.

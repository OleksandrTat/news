-- Funcion: public.fn_get_rol_usuario
-- Devuelve el rol de un usuario. Útil si RLS bloquea SELECT directo.

create or replace function public.fn_get_rol_usuario(
  p_id_usuario integer
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rol text;
begin
  select u.rol
  into v_rol
  from public.usuario u
  where u.id_usuario = p_id_usuario;

  return v_rol;
end;
$$;

grant execute on function public.fn_get_rol_usuario(integer)
to anon, authenticated;

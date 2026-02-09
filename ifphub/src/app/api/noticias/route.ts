import { NextResponse } from "next/server";
import { createClient } from "../../backend/utils/supabase/client";
import { decodeUserId } from "@/app/utils/hashid";
import { NEWS_CREATOR_ROLES } from "@/app/utils/roles";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_noticia");

  if (error) {
    console.error("Error al obtener noticias:", error);
    return NextResponse.json({ error: "Error al obtener noticias" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createClient();

  let payload: {
    titulo?: string;
    descripcion?: string;
    imagen?: string | null;
    uid?: number | string;
    sig?: string;
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invÃ¡lido" },
      { status: 400 }
    );
  }

  const titulo = payload.titulo?.trim();
  const descripcion = payload.descripcion?.trim();
  const imagen =
    typeof payload.imagen === "string" ? payload.imagen.trim() : null;
  if (!titulo || !descripcion) {
    return NextResponse.json(
      { error: "TÃ­tulo y descripciÃ³n son obligatorios" },
      { status: 400 }
    );
  }

  const uid =
    typeof payload.uid === "number"
      ? payload.uid
      : Number(payload.uid ?? NaN);
  const sig = typeof payload.sig === "string" ? payload.sig : null;

  if (!uid || !sig) {
    return NextResponse.json(
      { error: "Sesión inválida. Inicia sesión de nuevo." },
      { status: 401 }
    );
  }

  const decoded = decodeUserId(sig);
  if (!decoded || decoded !== uid) {
    return NextResponse.json(
      { error: "No tienes permiso para crear noticias." },
      { status: 403 }
    );
  }

  const { data: perfil, error: perfilError } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id_usuario", uid)
    .maybeSingle();

  if (perfilError || !perfil?.rol) {
    console.error("Error validando rol:", perfilError);
    return NextResponse.json(
      { error: "No tienes permiso para crear noticias." },
      { status: 403 }
    );
  }

  const rol = String(perfil.rol).trim().toLowerCase();
  if (!NEWS_CREATOR_ROLES.includes(rol as (typeof NEWS_CREATOR_ROLES)[number])) {
    return NextResponse.json(
      { error: "No tienes permiso para crear noticias." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase.rpc("fn_crear_noticia", {
    p_titulo: titulo,
    p_descripcion: descripcion,
    p_imagen: imagen,
  });

  if (error) {
    console.error("Error al crear noticia:", error);
    return NextResponse.json(
      { error: "Error al crear noticia" },
      { status: 500 }
    );
  }

  const created = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ success: true, data: created });
}

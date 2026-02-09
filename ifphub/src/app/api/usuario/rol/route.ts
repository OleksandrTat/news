import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";
import { decodeUserId } from "@/app/utils/hashid";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uidParam = searchParams.get("uid");
  const sig = searchParams.get("sig");

  const uid = Number(uidParam ?? NaN);
  if (!uid || !sig) {
    return NextResponse.json(
      { error: "Parámetros inválidos." },
      { status: 400 }
    );
  }

  const decoded = decodeUserId(sig);
  if (!decoded || decoded !== uid) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 }
    );
  }

  const supabase = createClient();

  const { data: perfil, error } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id_usuario", uid)
    .maybeSingle();

  if (error || !perfil?.rol) {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "fn_get_rol_usuario",
      { p_id_usuario: uid }
    );

    if (rpcError) {
      console.error("Error obteniendo rol:", error, rpcError);
      return NextResponse.json(
        { error: "No se pudo obtener el rol." },
        { status: 500 }
      );
    }

    const rol = String(rpcData ?? "").trim().toLowerCase();
    return NextResponse.json({ rol });
  }

  const rol = String(perfil?.rol ?? "").trim().toLowerCase();
  return NextResponse.json({ rol });
}

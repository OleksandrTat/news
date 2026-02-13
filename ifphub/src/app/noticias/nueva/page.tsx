"use client";

import { useState } from "react";
import Link from "next/link";
import AuthGuard from "@/app/frontend/components/AuthGuard";
import Header from "@/app/frontend/components/header";
import { NEWS_CREATOR_ROLES } from "@/app/utils/roles";

type CreatedNoticia = {
  id_noticia?: number;
  titulo?: string;
};

export default function NuevaNoticiaPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [created, setCreated] = useState<CreatedNoticia | null>(null);

  const canSubmit =
    titulo.trim().length > 0 && descripcion.trim().length > 0 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const storedUid = sessionStorage.getItem("uid");
    const storedSig = sessionStorage.getItem("sig");

    if (!storedUid || !storedSig) {
      setErrorMsg("Sesion invalida. Inicia sesion de nuevo.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setCreated(null);

    try {
      const res = await fetch("/api/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: Number(storedUid),
          sig: storedSig,
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          imagen: imagen.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result?.error ?? "No se pudo crear la noticia.");
      } else {
        setCreated(result?.data ?? null);
        setTitulo("");
        setDescripcion("");
        setImagen("");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error de red al crear la noticia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={NEWS_CREATOR_ROLES}>
      <div>
        <Header />

        <main className="min-h-screen px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted">
              <Link href="/noticias" className="hover:text-accent transition-colors">
                Noticias
              </Link>
              <span>-</span>
              <span>Crear noticia</span>
            </div>

            <section className="overflow-hidden rounded-[28px] border border-[#dce7ef] bg-white/95 shadow-sm">
              <header className="border-b border-[#e4edf3] bg-[linear-gradient(150deg,#ffffff,#f4f9fc)] px-6 py-7 md:px-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Editor del portal
                </p>
                <h1 className="mt-2 font-display text-4xl text-primary">Crear noticia</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                  Publica novedades relevantes para la comunidad academica. Revisa ortografia y contexto antes de enviar.
                </p>
              </header>

              <form className="space-y-5 px-6 py-7 md:px-8" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-primary">Titulo</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    maxLength={120}
                    placeholder="Ej: Jornada de innovacion en el campus"
                    className="w-full rounded-xl border border-[#d6e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  />
                  <p className="mt-1 text-xs text-muted">Maximo 120 caracteres.</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-primary">Descripcion</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    rows={7}
                    placeholder="Escribe el contenido principal de la noticia..."
                    className="w-full rounded-xl border border-[#d6e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  />
                  <p className="mt-1 text-xs text-muted">
                    Puedes separar parrafos con una linea en blanco.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-primary">
                    Imagen (opcional)
                  </label>
                  <input
                    type="url"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-[#d6e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  />
                  {imagen.trim().length > 0 && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-[#dce7ef]">
                      <img
                        src={imagen}
                        alt="Previsualizacion"
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="rounded-lg border border-[#f0cfc4] bg-[#fff3ef] p-3 text-sm text-[#a74822]">
                    {errorMsg}
                  </div>
                )}

                {created?.id_noticia && (
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#d8e4ec] bg-[#f5f9fc] p-3 text-sm text-primary">
                    <span>Noticia creada correctamente.</span>
                    <Link
                      href={`/detail/${created.id_noticia}`}
                      className="font-semibold text-accent hover:text-accent/80 transition-colors"
                    >
                      Ver noticia
                    </Link>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Publicando..." : "Publicar noticia"}
                  </button>

                  <Link
                    href="/noticias"
                    className="rounded-xl border border-[#d8e4ec] px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
                  >
                    Volver
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

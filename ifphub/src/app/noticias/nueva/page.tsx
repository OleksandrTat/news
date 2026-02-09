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
      setErrorMsg("Sesión inválida. Inicia sesión de nuevo.");
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
        setErrorMsg(result?.error ?? "No se pudo crear la noticia");
      } else {
        setCreated(result?.data ?? null);
        setTitulo("");
        setDescripcion("");
        setImagen("");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error de red al crear la noticia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={NEWS_CREATOR_ROLES}>
      <div>
        <Header />
        <main className="px-4 py-8 bg-gradient-to-b from-[#fafbfc] to-white min-h-screen">
          <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link href="/noticias" className="hover:text-accent transition-colors">
            Noticias
          </Link>
          <span>•</span>
          <span>Crear noticia</span>
        </div>

        <header className="mt-2 mb-6">
          <h1 className="text-3xl font-semibold">Crear noticia</h1>
          <p className="text-muted mt-1">
            Publica una noticia del campus. El acceso está restringido.
          </p>
        </header>

        <form
          className="bg-card rounded-[14px] p-6 md:p-8 shadow-sm border border-[#eef3f6] space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              maxLength={120}
              placeholder="Ej: Jornada de innovación en el campus"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <p className="text-xs text-muted mt-1">Máximo 120 caracteres.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows={6}
              placeholder="Escribe el contenido principal de la noticia..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <p className="text-xs text-muted mt-1">
              Puedes incluir varios párrafos separados por líneas en blanco.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen (opcional)
            </label>
            <input
              type="url"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            {imagen.trim().length > 0 && (
              <div className="mt-3 rounded-lg overflow-hidden border border-[#eef3f6]">
                <img
                  src={imagen}
                  alt="Previsualización"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {errorMsg}
            </div>
          )}

          {created?.id_noticia && (
            <div className="text-sm text-[#0E4A54] bg-[#f6fbfd] border border-[#e4f1f6] rounded-lg p-3 flex flex-wrap items-center gap-3">
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
              className="px-5 py-2 rounded-xl bg-accent text-white font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Publicando..." : "Publicar noticia"}
            </button>

            <Link
              href="/noticias"
              className="px-5 py-2 rounded-xl border border-[#eef3f6] text-sm font-semibold hover:border-accent/40 hover:text-accent transition"
            >
              Volver
            </Link>
          </div>
        </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

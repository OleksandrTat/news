"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Noticia = {
  id_noticia: number;
  titulo?: string | null;
  fecha_hora?: string | null;
  imagen?: string | null;
};

const getPicsum = (seed: string | number, width = 200, height = 200) =>
  `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${width}/${height}`;

const getTimestamp = (value?: string | null) => {
  if (!value) return 0;
  const parsed = new Date(value);
  const timestamp = parsed.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const formatDate = (value?: string | null) => {
  const timestamp = getTimestamp(value);
  if (!timestamp) return "Fecha pendiente";
  return new Date(timestamp).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
};

export default function Sidebar() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/noticias", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload) => {
        if (!active) return;

        const rawList = Array.isArray(payload) ? payload : payload?.data ?? [];
        const normalized = rawList
          .map((item: any) => ({
            id_noticia: Number(item?.id_noticia ?? 0),
            titulo: String(item?.titulo ?? "").trim(),
            fecha_hora: String(item?.fecha_hora ?? ""),
            imagen: String(item?.imagen ?? "").trim() || null,
          }))
          .filter((item: Noticia) => item.id_noticia > 0)
          .sort(
            (a: Noticia, b: Noticia) => getTimestamp(b.fecha_hora) - getTimestamp(a.fecha_hora)
          );

        setNoticias(normalized);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const latest = useMemo(() => noticias.slice(0, 4), [noticias]);

  return (
    <aside className="overflow-hidden rounded-2xl border border-[#dce7ef] bg-white/95 shadow-md-custom">
      <div className="border-b border-[#e7eef3] bg-[linear-gradient(140deg,#f7fbff,#f2f7fa)] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Panel de apoyo
        </p>
        <h3 className="mt-2 text-lg font-display font-semibold text-primary">
          Ultimo minuto
        </h3>
      </div>

      <div className="max-h-[calc(100vh-11rem)] space-y-6 overflow-y-auto p-5 scrollbar-hide">
        <section>
          <div className="space-y-2" aria-live="polite">
            {loading &&
              [0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-[#e8eef3] bg-white p-2"
                >
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-md bg-[#eaf0f5]" />
                  <div className="flex-1">
                    <div className="h-3 w-4/5 animate-pulse rounded bg-[#eaf0f5]" />
                    <div className="mt-2 h-2 w-1/3 animate-pulse rounded bg-[#eaf0f5]" />
                  </div>
                </div>
              ))}

            {!loading && latest.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#dbe6ee] bg-[#f9fcff] p-3 text-sm text-muted">
                No hay noticias disponibles por ahora.
              </div>
            )}

            {!loading &&
              latest.map((noticia) => {
                const title = noticia.titulo?.trim() || "Sin titulo";
                const image =
                  noticia.imagen && noticia.imagen.trim() !== ""
                    ? noticia.imagen
                    : getPicsum(noticia.id_noticia, 56, 56);

                return (
                  <Link
                    key={noticia.id_noticia}
                    href={`/detail/${noticia.id_noticia}`}
                    className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition hover:border-[#dce7ef] hover:bg-[#f8fbfd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 text-sm leading-tight">
                      <p className="line-clamp-2 font-semibold text-primary group-hover:text-accent">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-muted">{formatDate(noticia.fecha_hora)}</p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>

        <section className="rounded-xl border border-[#e3ebf1] bg-white p-4">
          <h4 className="text-sm font-semibold text-primary">Comunidad IFPHub</h4>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Publica avisos utiles, comparte eventos y mantente al dia con los anuncios del campus.
          </p>
        </section>

        <div className="relative h-[220px] overflow-hidden rounded-xl border border-[#e1eaf1]">
          <Image
            src="/imagenes/anuncio.png"
            alt="Publicidad IFP"
            fill
            className="object-cover"
            sizes="280px"
            priority
          />
        </div>
      </div>
    </aside>
  );
}

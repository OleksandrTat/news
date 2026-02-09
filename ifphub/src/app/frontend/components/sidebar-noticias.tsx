"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Noticia = {
  id_usuario: number;
  titulo: string;
  fecha_hora: string;
  id_noticia: number;
  imagen?: string | null;
};

const getPicsum = (seed: string | number, w = 200, h = 200) =>
  `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;

export default function Sidebar({ uid, sig }: { uid?: string; sig?: string }) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const query = uid && sig ? `?uid=${uid}&sig=${sig}` : "";

  useEffect(() => {
    fetch("/api/noticias")
      .then((res) => res.json())
      .then(setNoticias)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="bg-card rounded-[14px] p-6 shadow-md-custom flex flex-col gap-8 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <section>
        <h3 className="text-accent uppercase tracking-widest text-sm font-libre mb-3 border-l-4 border-accent pl-3">
          Ultimas noticias
        </h3>

        <div className="flex flex-col gap-3" aria-live="polite">
          {loading && (
            <>
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 items-center p-2 rounded-md bg-white/60"
                >
                  <div className="w-14 h-14 rounded-md bg-[#eef3f6] animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 w-3/4 bg-[#eef3f6] rounded animate-pulse" />
                    <div className="h-2 w-1/3 bg-[#eef3f6] rounded mt-2 animate-pulse" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && noticias.length === 0 && (
            <div className="text-sm text-muted bg-white/70 rounded-md p-3 border border-[#eef3f6]">
              No hay noticias disponibles por ahora.
            </div>
          )}

          {!loading &&
            noticias.slice(0, 3).map((n) => (
              <a
                key={n.id_noticia}
                href={`/detail/${n.id_noticia}${query}`}
                className="flex gap-3 items-center p-2 rounded-md hover:bg-[#f3f6f7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={
                      n.imagen && n.imagen.trim() !== ""
                        ? n.imagen
                        : getPicsum(n.id_noticia, 56, 56)
                    }
                    alt={n.titulo}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="text-sm leading-tight">
                  <p className="font-semibold line-clamp-1">{n.titulo}</p>
                  <p className="text-muted text-xs mt-1">
                    {new Date(n.fecha_hora).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </a>
            ))}
        </div>
      </section>

      <section>
        <h3 className="text-accent uppercase tracking-widest text-sm font-libre mb-3 border-l-4 border-accent pl-3">
          Informacion
        </h3>

        <div className="text-sm text-muted leading-relaxed">
          Portal oficial de noticias del campus. Encuentra avisos, eventos,
          actividades y recursos actualizados.
        </div>
      </section>

      <div className="h-[260px] rounded-lg overflow-hidden relative">
        <Image
          src="/imagenes/anuncio.png"
          alt="Publicidad IFP"
          fill
          className="object-cover"
          sizes="260px"
          priority
        />
      </div>
    </aside>
  );
}

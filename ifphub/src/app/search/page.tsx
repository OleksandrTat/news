"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "../frontend/components/header";
import Sidebar from "../frontend/components/sidebar-noticias";
import { estimateReadingTime } from "../utils/readingTime";

type Noticia = {
  id_noticia: number;
  titulo?: string | null;
  descripcion?: string | null;
  fecha_hora?: string | null;
  imagen?: string | null;
};

type SortKey = "relevance" | "recent" | "popular";

const QUERY_DEFAULT = "";

const quickTags = [
  "Innovación",
  "Robótica",
  "Ciberseguridad",
  "Big Data",
  "Empleabilidad",
];

const getPicsum = (seed: string | number, w = 320, h = 200) =>
  `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(QUERY_DEFAULT);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [session, setSession] = useState<{ uid?: string; sig?: string }>({});

  useEffect(() => {
    const uid = sessionStorage.getItem("uid") ?? undefined;
    const sig = sessionStorage.getItem("sig") ?? undefined;
    setSession({ uid, sig });
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await fetch("/api/noticias", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "No se pudieron cargar las noticias.");
        }

        const list = Array.isArray(data) ? data : data?.data ?? [];
        if (active) setNoticias(list);
      } catch (error) {
        console.error(error);
        if (active) setErrorMsg("No se pudieron cargar las noticias.");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  const tokens = useMemo(
    () =>
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean),
    [query]
  );

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null;

    const prepared = noticias
      .map((n) => {
        const title = (n.titulo ?? "").toLowerCase();
        const desc = (n.descripcion ?? "").toLowerCase();
        const combined = `${title} ${desc}`.trim();
        const fecha = n.fecha_hora ? new Date(n.fecha_hora) : null;

        let score = 0;
        if (tokens.length > 0) {
          for (const t of tokens) {
            if (title.includes(t)) score += 2;
            if (desc.includes(t)) score += 1;
          }
        }

        return { ...n, combined, fecha, score };
      })
      .filter((n) => {
        if (tokens.length > 0 && n.score === 0) return false;

        if ((from || to) && !n.fecha) return false;

        if (from && n.fecha && n.fecha < from) return false;
        if (to && n.fecha && n.fecha > to) return false;

        return true;
      });

    const sorted = [...prepared].sort((a, b) => {
      if (sort === "recent") {
        const ad = a.fecha?.getTime() ?? 0;
        const bd = b.fecha?.getTime() ?? 0;
        return bd - ad;
      }

      if (sort === "popular") {
        return (b.id_noticia ?? 0) - (a.id_noticia ?? 0);
      }

      if (a.score !== b.score) return b.score - a.score;

      const ad = a.fecha?.getTime() ?? 0;
      const bd = b.fecha?.getTime() ?? 0;
      return bd - ad;
    });

    return sorted;
  }, [noticias, fromDate, toDate, sort, tokens]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayCount = filtered.filter((n) =>
      n.fecha_hora ? isSameDay(new Date(n.fecha_hora), now) : false
    ).length;
    const weekCount = filtered.filter((n) => {
      if (!n.fecha_hora) return false;
      const d = new Date(n.fecha_hora);
      return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return [
      { label: "Resultados", value: String(filtered.length) },
      { label: "Nuevos hoy", value: String(todayCount) },
      { label: "Últimos 7 días", value: String(weekCount) },
    ];
  }, [filtered]);

  const handleReset = () => {
    setQuery(QUERY_DEFAULT);
    setFromDate("");
    setToDate("");
    setSort("relevance");
  };

  const detailQuery = session.uid && session.sig
    ? `?uid=${encodeURIComponent(session.uid)}&sig=${encodeURIComponent(session.sig)}`
    : "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f9fb] via-white to-[#f2f6f8]">
      <Header />

      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="relative overflow-hidden rounded-[28px] border border-[#e4edf2] bg-gradient-to-br from-white via-[#f7fbff] to-[#f2f6f8] p-8 lg:p-12 shadow-sm-custom">
          <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_top,#f9d6df,transparent_60%)] opacity-70" />
          <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_top,#dbe9f2,transparent_60%)] opacity-70" />

          <div className="relative grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6 animate-rise">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold tracking-wide">
                Búsqueda inteligente
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-libre font-semibold text-primary">
                  Encuentra noticias, eventos y recursos del campus
                </h1>
                <p className="text-muted text-sm md:text-base max-w-xl">
                  Filtra por fechas, categorías y relevancia. Descubre contenido
                  recomendado según tus intereses y el contexto del campus.
                </p>
              </div>

              <form
                className="grid gap-3 sm:grid-cols-[1fr_auto]"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative">
                  <input
                    aria-label="Buscar"
                    type="search"
                    placeholder="Buscar por tema, evento o palabra clave"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-2xl border border-[#dde5ea] bg-white/90 px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
                    Enter
                  </span>
                </div>
                <button className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30">
                  Buscar
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted">Sugerencias:</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="rounded-full border border-[#e6edf2] bg-white/80 px-3 py-1 text-[11px] font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#e7eef3] bg-white/80 px-4 py-3 text-sm shadow-sm"
                  >
                    <div className="text-xs text-muted">{item.label}</div>
                    <div className="text-lg font-semibold text-primary">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 animate-rise">
              <div className="rounded-2xl border border-[#e7eef3] bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-primary mb-4">
                  Filtros rápidos
                </h3>
                <div className="grid gap-3">
                  <label className="text-xs text-muted">
                    Desde
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    />
                  </label>
                  <label className="text-xs text-muted">
                    Hasta
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    />
                  </label>
                  <label className="text-xs text-muted">
                    Ordenar por
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    >
                      <option value="relevance">Relevancia</option>
                      <option value="recent">Más recientes</option>
                      <option value="popular">Más leídas</option>
                    </select>
                  </label>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  >
                    Aplicar filtros
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-xl border border-[#e6edf2] px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e7eef3] bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-primary mb-3">
                  Consejos de búsqueda
                </h3>
                <ul className="text-xs text-muted space-y-2">
                  <li>Usa comillas para búsquedas exactas.</li>
                  <li>Combina temas: "IA" + "eventos".</li>
                  <li>Filtra por fechas para encontrar lo más reciente.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-primary">
                  Resultados para: <span className="text-accent">“{query.trim() || "Todo"}”</span>
                </h2>
                <p className="text-sm text-muted">
                  {loading ? "Buscando noticias..." : `Mostrando ${filtered.length} resultados.`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSort("relevance")}
                  className={`rounded-full border px-3 py-1 font-semibold transition ${
                    sort === "relevance"
                      ? "border-accent/40 text-accent"
                      : "border-[#e6edf2] bg-white text-primary hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  Relevancia
                </button>
                <button
                  type="button"
                  onClick={() => setSort("recent")}
                  className={`rounded-full border px-3 py-1 font-semibold transition ${
                    sort === "recent"
                      ? "border-accent/40 text-accent"
                      : "border-[#e6edf2] bg-white text-primary hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  Recientes
                </button>
                <button
                  type="button"
                  onClick={() => setSort("popular")}
                  className={`rounded-full border px-3 py-1 font-semibold transition ${
                    sort === "popular"
                      ? "border-accent/40 text-accent"
                      : "border-[#e6edf2] bg-white text-primary hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  Populares
                </button>
              </div>
            </div>

            {loading && (
              <div className="grid gap-4">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#e7eef3] bg-white/95 p-5 shadow-sm animate-pulse"
                  >
                    <div className="h-4 w-24 rounded bg-[#eef3f6]" />
                    <div className="mt-4 h-5 w-3/4 rounded bg-[#eef3f6]" />
                    <div className="mt-2 h-3 w-full rounded bg-[#eef3f6]" />
                  </div>
                ))}
              </div>
            )}

            {!loading && errorMsg && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            {!loading && !errorMsg && filtered.length === 0 && (
              <div className="rounded-2xl border border-[#e7eef3] bg-white/90 p-6 text-sm text-muted">
                No se encontraron resultados para la búsqueda actual.
              </div>
            )}

            {!loading && !errorMsg && filtered.length > 0 && (
              <div className="grid gap-4">
                {filtered.map((r, idx) => {
                  const image = r.imagen && r.imagen.trim() !== ""
                    ? r.imagen
                    : getPicsum(r.id_noticia, 320, 200);
                  const readingMinutes = estimateReadingTime(
                    `${r.titulo ?? ""} ${r.descripcion ?? ""}`.trim()
                  );

                  return (
                    <article
                      key={r.id_noticia}
                      className="group grid gap-4 rounded-2xl border border-[#e7eef3] bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none animate-rise"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">
                          Noticias
                        </span>
                        {r.fecha_hora && (
                          <span className="text-muted">
                            {new Date(r.fecha_hora).toLocaleDateString("es-ES")}
                          </span>
                        )}
                        <span className="text-muted">•</span>
                        <span className="text-muted" title="Tiempo de lectura estimado">
                          Lectura {readingMinutes} min
                        </span>
                        <span className="ml-auto rounded-full border border-[#e6edf2] px-3 py-1 text-[11px] font-semibold text-primary">
                          Campus
                        </span>
                      </div>

                      <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                        <div
                          className="h-28 w-full rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${image})` }}
                        />
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                            {r.titulo ?? "Sin título"}
                          </h3>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {r.descripcion ?? "Resumen no disponible."}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                            <Link
                              href={`/detail/${r.id_noticia}${detailQuery}`}
                              className="inline-flex items-center gap-2 font-semibold text-accent hover:text-accent/80"
                            >
                              Ver detalle
                              <span aria-hidden="true">→</span>
                            </Link>
                            <span>Compartir</span>
                            <span>Guardar</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start space-y-6">
            <div className="rounded-2xl border border-[#e7eef3] bg-white/90 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-primary mb-3">
                Panel rápido
              </h3>
              <div className="grid gap-3 text-xs text-muted">
                <div className="flex items-center justify-between">
                  <span>Última actualización</span>
                  <span className="font-semibold text-primary">Hoy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Resultados visibles</span>
                  <span className="font-semibold text-primary">
                    {filtered.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Query activa</span>
                  <span className="font-semibold text-primary">
                    {query.trim() || "Todas"}
                  </span>
                </div>
              </div>
            </div>
            <Sidebar />
          </aside>
        </div>
      </section>

      <footer className="mt-8 text-center text-sm text-muted border-t border-[#e7eef3] py-6">
        © 2026 Portal Noticias — Diseño Pro++
      </footer>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../frontend/components/header";
import Sidebar from "../frontend/components/sidebar-noticias";
import AuthGuard from "../frontend/components/AuthGuard";
import { estimateReadingTime } from "../utils/readingTime";

type Noticia = {
  id_noticia: number;
  titulo?: string | null;
  descripcion?: string | null;
  fecha_hora?: string | null;
  imagen?: string | null;
};

type ViewMode = "comfortable" | "compact";

const QUERY_DEFAULT = "";

const stopWords = new Set([
  "para",
  "desde",
  "hasta",
  "sobre",
  "entre",
  "tras",
  "ante",
  "bajo",
  "hacia",
  "esta",
  "este",
  "estas",
  "estos",
  "del",
  "las",
  "los",
  "que",
  "una",
  "unos",
  "unas",
  "como",
  "con",
  "sin",
  "por",
  "the",
  "and",
  "para",
  "campus",
  "portal",
  "noticia",
  "noticias",
]);

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatSuggestionLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const getPicsum = (seed: string | number, width = 320, height = 200) =>
  `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${width}/${height}`;

const getTimestamp = (value?: string | null) => {
  if (!value) return 0;
  const parsed = new Date(value);
  const timestamp = parsed.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDate = (value?: string | null) => {
  const timestamp = getTimestamp(value);
  if (!timestamp) return "Fecha pendiente";
  return new Date(timestamp).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function SearchPage() {
  const [query, setQuery] = useState(QUERY_DEFAULT);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("comfortable");
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const syncFromUrl = () => {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q !== null) setQuery(q);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);

    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

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
      normalizeText(query)
        .trim()
        .split(/\s+/)
        .filter(Boolean),
    [query]
  );

  const suggestionTags = useMemo(() => {
    const bag = new Map<string, number>();

    for (const noticia of noticias) {
      const text = `${noticia.titulo ?? ""} ${noticia.descripcion ?? ""}`;
      const words = normalizeText(text).match(/[a-z0-9]{4,}/g) ?? [];

      for (const word of words) {
        if (stopWords.has(word)) continue;
        if (/^\d+$/.test(word)) continue;
        bag.set(word, (bag.get(word) ?? 0) + 1);
      }
    }

    const selected = [...bag.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => formatSuggestionLabel(word));

    if (selected.length > 0) return selected;

    return ["Eventos", "Comunidad", "Talleres", "Campus"];
  }, [noticias]);

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null;

    const prepared = noticias
      .map((n) => {
        const title = normalizeText(n.titulo ?? "");
        const desc = normalizeText(n.descripcion ?? "");
        const fecha = n.fecha_hora ? new Date(n.fecha_hora) : null;

        let score = 0;
        if (tokens.length > 0) {
          for (const token of tokens) {
            if (title.includes(token)) score += 2;
            if (desc.includes(token)) score += 1;
          }
        }

        return { ...n, fecha, score };
      })
      .filter((n) => {
        if (tokens.length > 0 && n.score === 0) return false;

        if ((from || to) && !n.fecha) return false;

        if (from && n.fecha && n.fecha < from) return false;
        if (to && n.fecha && n.fecha > to) return false;

        return true;
      });

    return [...prepared].sort((a, b) => {
      if (tokens.length > 0 && a.score !== b.score) {
        return b.score - a.score;
      }

      const ad = a.fecha?.getTime() ?? 0;
      const bd = b.fecha?.getTime() ?? 0;
      return bd - ad;
    });
  }, [noticias, fromDate, toDate, tokens]);

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
      { label: "Ultimos 7 dias", value: String(weekCount) },
    ];
  }, [filtered]);

  const todayLabel = useMemo(() => new Date().toLocaleDateString("es-ES"), []);

  const handleReset = () => {
    setQuery(QUERY_DEFAULT);
    setFromDate("");
    setToDate("");
  };

  return (
    <AuthGuard>
      <main className="min-h-screen">
        <Header />

        <section className="mx-auto max-w-6xl px-4 pt-8">
          <div className="relative overflow-hidden rounded-[28px] border border-[#d8e5ee] bg-[linear-gradient(150deg,#ffffff,#f3f8fb)] p-7 md:p-9 shadow-sm-custom">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_top,rgba(223,106,57,0.2),transparent_64%)]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_top,rgba(16,47,69,0.16),transparent_64%)]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-5 animate-rise">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                  Busqueda inteligente
                </div>

                <div className="space-y-2">
                  <h1 className="font-display text-4xl leading-tight text-primary md:text-5xl">
                    Encuentra noticias por tema, fecha y relevancia
                  </h1>
                  <p className="max-w-2xl text-sm text-muted md:text-base">
                    Filtra contenido del campus, revisa resultados recientes y navega directo al detalle de cada publicacion.
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
                      className="w-full rounded-xl border border-[#d7e3eb] bg-white px-4 py-3 text-sm text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-wide text-muted">
                      ENTER
                    </span>
                  </div>
                  <button className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30">
                    Buscar
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted">Sugerencias:</span>
                  {suggestionTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setQuery(tag);
                        setFromDate("");
                        setToDate("");
                      }}
                      className="rounded-full border border-[#d8e4ec] bg-white px-3 py-1 font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[#dce7ef] bg-white/90 px-4 py-3 text-sm shadow-sm"
                    >
                      <div className="text-xs text-muted">{item.label}</div>
                      <div className="text-lg font-semibold text-primary">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 animate-rise">
                <div className="rounded-2xl border border-[#dce7ef] bg-white/92 p-5 shadow-sm">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                    Filtros
                  </h2>

                  <div className="grid gap-3">
                    <label className="text-xs font-semibold text-muted">
                      Desde
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#d7e3eb] bg-white px-3 py-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      />
                    </label>
                    <label className="text-xs font-semibold text-muted">
                      Hasta
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#d7e3eb] bg-white px-3 py-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white"
                    >
                      Filtros activos
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 rounded-lg border border-[#d8e4ec] px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#dce7ef] bg-white/92 p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-primary">Consejos de busqueda</h3>
                  <ul className="space-y-2 text-xs text-muted">
                    <li>Prueba palabras clave cortas para ampliar resultados.</li>
                    <li>Combina filtros de fecha para contexto reciente.</li>
                    <li>Usa la ordenacion por relevancia para consultas largas.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-primary md:text-3xl">
                    Resultados para <span className="text-accent">"{query.trim() || "todo"}"</span>
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {loading ? "Buscando noticias..." : `Mostrando ${filtered.length} resultados.`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="ml-0 flex items-center gap-1 rounded-full border border-[#d8e4ec] bg-white p-0.5 sm:ml-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("comfortable")}
                      className={`rounded-full px-3 py-1 font-semibold transition ${
                        viewMode === "comfortable"
                          ? "bg-primary text-white"
                          : "text-primary hover:text-accent"
                      }`}
                    >
                      Comoda
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("compact")}
                      className={`rounded-full px-3 py-1 font-semibold transition ${
                        viewMode === "compact"
                          ? "bg-primary text-white"
                          : "text-primary hover:text-accent"
                      }`}
                    >
                      Compacta
                    </button>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="grid gap-4">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#dce7ef] bg-white p-5 shadow-sm animate-pulse"
                    >
                      <div className="h-4 w-24 rounded bg-[#eaf0f5]" />
                      <div className="mt-4 h-5 w-3/4 rounded bg-[#eaf0f5]" />
                      <div className="mt-2 h-3 w-full rounded bg-[#eaf0f5]" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && errorMsg && (
                <div className="rounded-2xl border border-[#f0cfc4] bg-[#fff3ef] p-5 text-sm text-[#a74822]">
                  {errorMsg}
                </div>
              )}

              {!loading && !errorMsg && filtered.length === 0 && (
                <div className="rounded-2xl border border-[#dce7ef] bg-white/90 p-6 text-sm text-muted">
                  No se encontraron resultados para la busqueda actual.
                </div>
              )}

              {!loading && !errorMsg && filtered.length > 0 && (
                <div className="grid gap-4">
                  {filtered.map((result, idx) => {
                    const image = result.imagen && result.imagen.trim() !== ""
                      ? result.imagen
                      : getPicsum(result.id_noticia, 320, 200);
                    const readingMinutes = estimateReadingTime(
                      `${result.titulo ?? ""} ${result.descripcion ?? ""}`.trim()
                    );
                    const compact = viewMode === "compact";

                    return (
                      <article
                        key={result.id_noticia}
                        className={`group grid gap-4 rounded-2xl border border-[#dce7ef] bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none animate-rise ${
                          compact ? "p-4" : "p-5"
                        }`}
                        style={{ animationDelay: `${idx * 55}ms` }}
                      >
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                          <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">
                            Noticias
                          </span>
                          <span>{formatDate(result.fecha_hora)}</span>
                          <span>-</span>
                          <span title="Tiempo de lectura estimado">Lectura {readingMinutes} min</span>
                          <span className="ml-auto rounded-full border border-[#d8e4ec] px-3 py-1 text-[11px] font-semibold text-primary">
                            Campus
                          </span>
                        </div>

                        <div
                          className={`grid gap-3 ${
                            compact ? "md:grid-cols-[128px_1fr]" : "md:grid-cols-[170px_1fr]"
                          }`}
                        >
                          <div
                            className={`w-full rounded-xl bg-cover bg-center ${
                              compact ? "h-24" : "h-[7.5rem]"
                            }`}
                            style={{ backgroundImage: `url(${image})` }}
                          />
                          <div className="space-y-2">
                            <h3
                              className={`font-semibold text-primary transition-colors group-hover:text-accent ${
                                compact ? "text-base" : "text-lg"
                              }`}
                            >
                              {result.titulo ?? "Sin titulo"}
                            </h3>
                            <p className={`text-sm text-muted ${compact ? "line-clamp-1" : "line-clamp-2"}`}>
                              {result.descripcion ?? "Resumen no disponible."}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                              <Link
                                href={`/detail/${result.id_noticia}`}
                                className="inline-flex items-center gap-2 font-semibold text-accent hover:text-accent/80"
                              >
                                Ver detalle
                                <span aria-hidden="true">-&gt;</span>
                              </Link>
                              <button type="button" className="transition hover:text-accent">
                                Compartir
                              </button>
                              <button type="button" className="transition hover:text-accent">
                                Guardar
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[#dce7ef] bg-white/92 p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-primary">Panel rapido</h3>
                <div className="grid gap-3 text-xs text-muted">
                  <div className="flex items-center justify-between">
                    <span>Ultima actualizacion</span>
                    <span className="font-semibold text-primary">{todayLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resultados visibles</span>
                    <span className="font-semibold text-primary">{filtered.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Query activa</span>
                    <span className="font-semibold text-primary">{query.trim() || "Todas"}</span>
                  </div>
                </div>
              </div>
              <Sidebar />
            </aside>
          </div>
        </section>

        <footer className="mt-8 border-t border-[#dce7ef] py-6 text-center text-sm text-muted">
          (c) 2026 Portal Noticias - IFPHub
        </footer>
      </main>
    </AuthGuard>
  );
}

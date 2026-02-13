import Hero, { type HeroNoticia } from "@/app/frontend/components/hero";
import Sidebar from "@/app/frontend/components/sidebar-noticias";
import Link from "next/link";
import Header from "@/app/frontend/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/app/frontend/components/ui/breadcrumb";
import AuthGuard from "@/app/frontend/components/AuthGuard";
import { createClient } from "@/app/backend/utils/supabase/client";

type NoticiasPayload = {
  data?: unknown;
};

type RawNoticia = {
  id_noticia?: number | string | null;
  titulo?: string | null;
  descripcion?: string | null;
  fecha_hora?: string | null;
  imagen?: string | null;
};

const getTimestamp = (dateValue?: string | null) => {
  if (!dateValue) return 0;
  const parsed = new Date(dateValue);
  const timestamp = parsed.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toSafeString = (value: unknown) =>
  typeof value === "string" ? value : "";

const normalizeNoticia = (input: RawNoticia): HeroNoticia => {
  const idCandidate =
    typeof input.id_noticia === "number"
      ? input.id_noticia
      : Number(input.id_noticia ?? 0);

  return {
    id_noticia: Number.isFinite(idCandidate) ? idCandidate : 0,
    titulo: toSafeString(input.titulo),
    descripcion: toSafeString(input.descripcion),
    fecha_hora: toSafeString(input.fecha_hora) || null,
    imagen: toSafeString(input.imagen) || null,
  };
};

async function getNoticias(): Promise<HeroNoticia[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("fn_get_noticia");

  if (error) {
    console.error("No se pudieron cargar las noticias:", error);
    return [];
  }

  const payload: unknown = data;

  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray((payload as NoticiasPayload).data)
    ? ((payload as NoticiasPayload).data as unknown[])
    : [];

  return rawList
    .filter(isRecord)
    .map((item) => normalizeNoticia(item as RawNoticia))
    .filter((item) => item.id_noticia > 0);
}

const getPicsum = (seed: string | number, width: number, height: number) =>
  `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${width}/${height}`;

const formatDate = (dateValue?: string | null) => {
  const timestamp = getTimestamp(dateValue);
  if (!timestamp) return "Fecha pendiente";
  return new Date(timestamp).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const truncateText = (value?: string | null, maxLength = 132) => {
  const safeValue = (value ?? "").trim();
  if (!safeValue) return "Resumen no disponible.";
  if (safeValue.length <= maxLength) return safeValue;
  return `${safeValue.slice(0, maxLength).trim()}...`;
};

export default async function Page() {
  const noticias = await getNoticias();

  const orderedNoticias = [...noticias].sort(
    (a, b) => getTimestamp(b.fecha_hora) - getTimestamp(a.fecha_hora)
  );

  const hasNoticias = orderedNoticias.length > 0;
  const featured = orderedNoticias[0] ?? null;

  const latestNews = orderedNoticias.slice(1, 6);
  const latestList = latestNews.length > 0 ? latestNews : orderedNoticias.slice(0, 5);

  const discoverBase = orderedNoticias.slice(6, 12);
  const discoverList =
    discoverBase.length > 0 ? discoverBase : orderedNoticias.slice(0, 6);

  const now = Date.now();
  const todayCount = orderedNoticias.filter((item) => {
    const ts = getTimestamp(item.fecha_hora);
    return ts > 0 && now - ts < 24 * 60 * 60 * 1000;
  }).length;

  const weekCount = orderedNoticias.filter((item) => {
    const ts = getTimestamp(item.fecha_hora);
    return ts > 0 && now - ts < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <AuthGuard>
      <div>
        <Header />

        <section className="px-4 pt-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">Noticias</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="text-xs font-medium text-muted">
              {orderedNoticias.length} articulos disponibles
            </div>
          </div>
        </section>

        <main className="min-h-screen px-4 py-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px]">
            <section className="space-y-8">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#dce7ef] bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-xs text-muted">Total publicadas</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">{orderedNoticias.length}</p>
                </div>
                <div className="rounded-xl border border-[#dce7ef] bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-xs text-muted">Ultimas 24h</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">{todayCount}</p>
                </div>
                <div className="rounded-xl border border-[#dce7ef] bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-xs text-muted">Ultimos 7 dias</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">{weekCount}</p>
                </div>
              </div>

              <Hero
                featured={featured}
                totalNoticias={orderedNoticias.length}
              />

              <section
                id="ultimas"
                className="rounded-2xl border border-[#dce7ef] bg-white/95 p-6 md:p-8 shadow-sm"
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
                      Ultimas publicaciones
                    </p>
                    <h2 className="mt-2 font-display text-3xl text-primary">Lectura recomendada</h2>
                    <p className="mt-2 text-sm text-muted">
                      Noticias recientes para revisar en menos de cinco minutos.
                    </p>
                  </div>
                  <Link
                    href="/search"
                    className="inline-flex items-center rounded-lg border border-[#d8e4ec] bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
                  >
                    Abrir busqueda avanzada
                  </Link>
                </div>

                <div className="grid gap-4" aria-live="polite">
                  {!hasNoticias && (
                    <div className="rounded-lg border border-dashed border-[#d9e6ee] bg-[#f8fbfe] p-4 text-sm text-muted">
                      No hay noticias disponibles por ahora.
                    </div>
                  )}

                  {latestList.map((noticia) => {
                    const title = noticia.titulo?.trim() || "Sin titulo";
                    const image =
                      noticia.imagen?.trim() ||
                      getPicsum(`latest-${noticia.id_noticia}`, 220, 140);

                    return (
                      <Link
                        key={`latest-${noticia.id_noticia}`}
                        href={`/detail/${noticia.id_noticia}`}
                        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      >
                        <article className="group grid gap-4 rounded-xl border border-[#e1ebf2] bg-[linear-gradient(160deg,#ffffff,#f8fbfe)] p-4 transition hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-sm md:grid-cols-[148px_1fr_auto] md:items-center motion-reduce:transform-none">
                          <div className="relative h-[160px] w-full overflow-hidden rounded-lg md:h-[90px] md:w-[148px]">
                            <img
                              src={image}
                              alt={title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                              <span className="rounded-full bg-accent/10 px-2.5 py-1 font-semibold text-accent">
                                Noticia
                              </span>
                              <span>{formatDate(noticia.fecha_hora)}</span>
                            </div>
                            <h3 className="line-clamp-2 text-base font-semibold text-primary group-hover:text-accent">
                              {title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-muted">
                              {truncateText(noticia.descripcion)}
                            </p>
                          </div>

                          <span className="text-sm font-semibold text-primary transition group-hover:text-accent">
                            Ver
                          </span>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-5">
                <div className="border-l-4 border-accent pl-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                    Explora mas contenido
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    Una seleccion adicional para ampliar contexto y mantenerte informado.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {discoverList.map((noticia) => {
                    const title = noticia.titulo?.trim() || "Sin titulo";
                    const image =
                      noticia.imagen?.trim() ||
                      getPicsum(`discover-${noticia.id_noticia}`, 640, 360);

                    return (
                      <Link
                        key={`discover-${noticia.id_noticia}`}
                        href={`/detail/${noticia.id_noticia}`}
                        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      >
                        <article className="group overflow-hidden rounded-xl border border-[#deebf2] bg-white shadow-sm transition hover:-translate-y-1 hover:border-accent/30 hover:shadow-md motion-reduce:transform-none">
                          <div className="relative h-[190px] overflow-hidden">
                            <img
                              src={image}
                              alt={title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2d43]/68 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div>
                          <div className="p-4">
                            <div className="text-xs text-muted">{formatDate(noticia.fecha_hora)}</div>
                            <h4 className="mt-2 line-clamp-2 text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                              {title}
                            </h4>
                            <p className="mt-2 line-clamp-3 text-sm text-muted">
                              {truncateText(noticia.descripcion, 150)}
                            </p>
                            <div className="mt-4 text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                              Abrir articulo
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <footer className="border-t border-[#dce7ef] pt-6 pb-4 text-center text-sm text-muted">
                <p className="flex items-center justify-center gap-2">
                  <span>(c) 2026 Portal Noticias - FProject</span>
                  <span className="text-accent">-</span>
                  <Link href="/terminos" className="hover:text-accent transition-colors">
                    Terminos
                  </Link>
                  <span className="text-accent">-</span>
                  <Link href="/privacidad" className="hover:text-accent transition-colors">
                    Privacidad
                  </Link>
                </p>
              </footer>
            </section>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Sidebar />
            </aside>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

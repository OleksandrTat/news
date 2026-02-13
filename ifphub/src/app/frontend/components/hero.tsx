import Link from "next/link";
import CreateNewsButton from "@/app/frontend/components/create-news-button";

export type HeroNoticia = {
  id_noticia: number;
  titulo?: string | null;
  descripcion?: string | null;
  fecha_hora?: string | null;
  imagen?: string | null;
};

type HeroProps = {
  featured: HeroNoticia | null;
  totalNoticias: number;
};

const getPicsum = (seed: string | number, width = 1200, height = 720) =>
  `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${width}/${height}`;

const getTimestamp = (dateValue?: string | null) => {
  if (!dateValue) return 0;
  const parsed = new Date(dateValue);
  const timestamp = parsed.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const formatDate = (dateValue?: string | null) => {
  const timestamp = getTimestamp(dateValue);
  if (!timestamp) return "Fecha pendiente";
  return new Date(timestamp).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const truncateText = (value?: string | null, maxLength = 220) => {
  const safeValue = (value ?? "").trim();
  if (!safeValue) {
    return "Consulta comunicados oficiales, actividades y eventos para mantenerte al dia con toda la comunidad IFPHub.";
  }
  if (safeValue.length <= maxLength) return safeValue;
  return `${safeValue.slice(0, maxLength).trim()}...`;
};

const estimateReadingMinutes = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 210));
};

export default function Hero({ featured, totalNoticias }: HeroProps) {
  const featuredTitle =
    featured?.titulo?.trim() || "Noticias clave del campus, en un solo vistazo";
  const featuredDescription = truncateText(featured?.descripcion);
  const featuredDate = formatDate(featured?.fecha_hora);
  const featuredLink = featured ? `/detail/${featured.id_noticia}` : "/search";
  const featuredImage =
    featured?.imagen?.trim() || getPicsum(featured?.id_noticia ?? "ifphub-cover");
  const readMinutes = estimateReadingMinutes(
    `${featured?.titulo ?? ""} ${featured?.descripcion ?? ""}`.trim()
  );

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#d3e0e8] bg-[linear-gradient(150deg,#ffffff,#f2f8fb)] p-5 md:p-7 shadow-md-custom">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top,rgba(203,99,37,0.22),transparent_64%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top,rgba(16,40,58,0.18),transparent_64%)]" />

      <div className="relative overflow-hidden rounded-2xl border border-[#dbe7ef] bg-white">
        <div className="relative h-[340px] md:h-[460px]">
          <img
            src={featuredImage}
            alt={featuredTitle}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04] motion-reduce:transform-none"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d2c]/92 via-[#0a1d2c]/42 to-[#0a1d2c]/18" />

          <div className="absolute left-5 top-5 inline-flex rounded-full border border-white/35 bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-primary">
            Portada de hoy
          </div>

          <div className="absolute inset-x-5 bottom-5 space-y-4 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/78">{featuredDate}</p>
            <h2 className="max-w-4xl text-3xl leading-[1.02] md:text-6xl">
              {featuredTitle}
            </h2>
            <p className="max-w-3xl text-sm text-white/88 md:text-base">{featuredDescription}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={featuredLink}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm transition hover:bg-white/90"
              >
                Leer destacada
                <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link
                href="#ultimas"
                className="inline-flex items-center rounded-lg border border-white/45 bg-white/14 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/24"
              >
                Ver ultimas
              </Link>
              <CreateNewsButton
                className="inline-flex items-center rounded-lg border border-[#e3a07c] bg-[linear-gradient(140deg,#cb6325,#bc5314)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-92"
                label="Publicar noticia"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-t border-[#dbe7ef] bg-[linear-gradient(160deg,#ffffff,#f7fbfe)] p-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#e6eef4] bg-white px-3 py-2">
            <p className="text-[11px] text-muted">Noticias activas</p>
            <p className="text-lg font-semibold text-primary">{totalNoticias}</p>
          </div>
          <div className="rounded-lg border border-[#e6eef4] bg-white px-3 py-2">
            <p className="text-[11px] text-muted">Lectura portada</p>
            <p className="text-lg font-semibold text-primary">{readMinutes} min</p>
          </div>
          <div className="rounded-lg border border-[#e6eef4] bg-white px-3 py-2">
            <p className="text-[11px] text-muted">Actualizada</p>
            <p className="text-sm font-semibold text-primary line-clamp-1">{featuredDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

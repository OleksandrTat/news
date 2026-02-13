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
    <section className="relative overflow-hidden rounded-[30px] border border-[#d8e5ee] bg-[linear-gradient(150deg,#ffffff,#f3f8fb)] p-5 md:p-7 shadow-md-custom">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top,rgba(223,106,57,0.2),transparent_64%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top,rgba(16,47,69,0.16),transparent_64%)]" />

      <div className="relative overflow-hidden rounded-2xl border border-[#deebf2] bg-white">
        <div className="relative h-[320px] md:h-[430px]">
          <img
            src={featuredImage}
            alt={featuredTitle}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105 motion-reduce:transform-none"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c2233]/90 via-[#0c2233]/35 to-[#0c2233]/10" />

          <div className="absolute left-5 top-5 inline-flex rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-primary">
            Portada de hoy
          </div>

          <div className="absolute inset-x-5 bottom-5 space-y-4 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/80">{featuredDate}</p>
            <h2 className="max-w-4xl font-display text-3xl leading-tight md:text-5xl">
              {featuredTitle}
            </h2>
            <p className="max-w-3xl text-sm text-white/90 md:text-base">{featuredDescription}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={featuredLink}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:bg-white/90"
              >
                Leer destacada
                <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link
                href="#ultimas"
                className="inline-flex items-center rounded-lg border border-white/45 bg-white/12 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Ver ultimas
              </Link>
              <CreateNewsButton
                className="inline-flex items-center rounded-lg border border-[#ffd3c2] bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                label="Publicar noticia"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-t border-[#deebf2] bg-[linear-gradient(160deg,#ffffff,#f8fbfe)] p-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-[11px] text-muted">Noticias activas</p>
            <p className="text-lg font-semibold text-primary">{totalNoticias}</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-[11px] text-muted">Lectura portada</p>
            <p className="text-lg font-semibold text-primary">{readMinutes} min</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-[11px] text-muted">Actualizada</p>
            <p className="text-sm font-semibold text-primary line-clamp-1">{featuredDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Sidebar from "@/app/frontend/components/sidebar-noticias";
import Header from "@/app/frontend/components/header";
import AuthGuard from "@/app/frontend/components/AuthGuard";
import { createClient } from "@/app/backend/utils/supabase/client";
import Link from "next/link";
import { estimateReadingTime } from "@/app/utils/readingTime";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/app/frontend/components/ui/breadcrumb";

const formatDate = (dateString?: string) => {
  if (!dateString) return "Fecha pendiente";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Fecha pendiente";
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function DetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_noticia_por_id", {
    p_id: Number(id),
  });

  if (error) {
    console.error(error);
    return (
      <AuthGuard>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-[#f0cfc4] bg-[#fff3ef] p-6 text-center">
            <h1 className="text-xl font-semibold text-[#a74822]">Error cargando noticia</h1>
            <p className="mt-2 text-sm text-[#a74822]">
              No se pudo obtener el contenido. Intenta nuevamente en unos minutos.
            </p>
            <Link
              href="/noticias"
              className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#a74822]"
            >
              Volver a noticias
            </Link>
          </div>
        </main>
      </AuthGuard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <AuthGuard>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-[#dce7ef] bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-primary">Noticia no encontrada</h1>
            <p className="mt-2 text-sm text-muted">
              Esta publicacion no existe o fue retirada del portal.
            </p>
            <Link
              href="/noticias"
              className="mt-4 inline-flex rounded-lg border border-[#d8e4ec] px-4 py-2 text-sm font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
            >
              Volver a noticias
            </Link>
          </div>
        </main>
      </AuthGuard>
    );
  }

  const noticia = data[0];

  const imagen =
    noticia.imagen && noticia.imagen.trim() !== ""
      ? noticia.imagen
      : "/imagenes/default_image.webp";

  const descripcion = noticia.descripcion ?? "";
  const readingMinutes = estimateReadingTime(
    `${noticia.titulo ?? ""} ${descripcion}`.trim()
  );

  const descriptionParts = descripcion
    .split(/\n\s*\n/)
    .map((part: string) => part.trim())
    .filter(Boolean);

  const paragraphs =
    descriptionParts.length > 0 ? descriptionParts : [descripcion || "Contenido no disponible."];

  return (
    <AuthGuard>
      <div>
        <Header />

        <section className="px-4 pt-6">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/noticias" className="hover:text-accent transition-colors">
                    Noticias
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[210px] truncate font-semibold sm:max-w-[440px]">
                    {noticia.titulo}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        <main className="min-h-screen px-4 py-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px]">
            <article className="overflow-hidden rounded-2xl border border-[#dce7ef] bg-white shadow-sm">
              <div className="relative h-[330px] overflow-hidden md:h-[460px]">
                <img
                  src={imagen}
                  alt={noticia.titulo}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2233]/88 via-[#0c2233]/35 to-transparent" />

                <div className="absolute left-5 top-5 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">
                  Noticia
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/85">
                    <span>{formatDate(noticia.fecha_hora)}</span>
                    <span>-</span>
                    <span>Lectura {readingMinutes} min</span>
                  </div>
                  <h1 className="font-display text-3xl leading-tight text-white md:text-5xl">
                    {noticia.titulo}
                  </h1>
                </div>
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <div className="mb-8 grid gap-3 rounded-xl border border-[#dce7ef] bg-[linear-gradient(140deg,#f9fcff,#f3f8fb)] p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted">Publicado</p>
                    <p className="text-sm font-semibold text-primary">{formatDate(noticia.fecha_hora)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Tiempo estimado</p>
                    <p className="text-sm font-semibold text-primary">{readingMinutes} minutos</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Categoria</p>
                    <p className="text-sm font-semibold text-primary">Actualidad campus</p>
                  </div>
                </div>

                <div className="space-y-6 text-[17px] leading-relaxed text-[#243746]">
                  {paragraphs.map((paragraph: string, index: number) => (
                    <p
                      key={`${index}-${paragraph.slice(0, 12)}`}
                      className={index === 0 ? "first-letter:mr-2 first-letter:float-left first-letter:text-5xl first-letter:leading-none first-letter:font-semibold first-letter:text-accent" : ""}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <blockquote className="my-10 rounded-xl border-l-4 border-accent bg-accent/10 p-5 text-lg italic text-primary">
                  "Mantente informado para participar mejor en la vida academica del campus."
                </blockquote>

                <div className="border-t border-[#dce7ef] pt-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-muted">Etiquetas:</span>
                    {[
                      "Campus",
                      "Comunidad",
                      "Eventos",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full border border-[#d8e4ec] bg-white px-3 py-1 font-semibold text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <footer className="mt-10 border-t border-[#dce7ef] pt-6 text-center text-sm text-muted">
                  <p className="flex items-center justify-center gap-2">
                    <span>(c) 2026 Portal Noticias - IFPHub</span>
                    <span className="text-accent">-</span>
                    <Link href="/contacto" className="hover:text-accent transition-colors">
                      Contacto
                    </Link>
                  </p>
                </footer>
              </div>
            </article>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Sidebar />
            </aside>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

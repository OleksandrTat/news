import Hero from "@/app/frontend/components/hero";
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

async function getNoticias() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/noticias`, {
    cache: "no-store",
  });

  return await res.json();
}

export default async function Page() {
  const noticias = await getNoticias();
  const noticiasArray = Array.isArray(noticias) ? noticias : noticias?.data ?? [];
  const hasNoticias = noticiasArray.length > 0;

  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const randomNoticias = shuffle(noticiasArray).slice(0, 8);

  const getPicsum = (seed: string | number, w: number, h: number) =>
    `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;

  return (
    <AuthGuard>
      <div>
        <Header />

        <section className="px-4 pt-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">Noticias</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="text-xs text-muted">
              {noticiasArray.length} articulos disponibles
            </div>
          </div>
        </section>

        <main className="px-4 py-6 bg-gradient-to-b from-[#fafbfc] to-white min-h-screen">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_320px]">
            <section className="space-y-8">
              <div className="bg-card rounded-[14px] p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#eef3f6]">
                <Hero />
              </div>

              <section className="bg-card rounded-[14px] p-8 shadow-sm border border-[#eef3f6]">
                <div className="border-l-4 border-accent pl-3 mb-6">
                  <h3 className="text-accent uppercase tracking-widest text-sm font-libre flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Popular
                  </h3>
                </div>

                <div className="grid gap-4" aria-live="polite">
                  {!hasNoticias && (
                    <div className="rounded-lg border border-[#eef3f6] bg-white/70 p-4 text-sm text-muted">
                      No hay noticias disponibles por ahora.
                    </div>
                  )}
                  {randomNoticias.slice(0, 3).map((n: any, idx: number) => {
                    const resumen = (n.descripcion ?? "").slice(0, 70);
                    return (
                      <Link
                        key={n.id_noticia}
                        href={`/detail/${n.id_noticia}`}
                        className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      >
                        <article
                          className="group flex gap-4 items-center p-4 rounded-lg bg-white border border-[#eef3f6] hover:border-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 motion-reduce:transform-none"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="relative overflow-hidden rounded-md flex-shrink-0">
                            <img
                              src={getPicsum(n.id_noticia, 110, 72)}
                              alt={n.titulo}
                              className="w-[110px] h-[72px] object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[15px] font-semibold group-hover:text-accent transition-colors line-clamp-2">
                              {n.titulo}
                            </h4>
                            <p className="text-sm text-muted mt-1 line-clamp-2">
                              {resumen ? `${resumen}...` : "Resumen no disponible."}
                            </p>
                          </div>
                          <svg className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="border-l-4 border-accent pl-3 mb-6">
                  <h3 className="text-accent uppercase tracking-widest text-sm font-libre">
                    Mas noticias
                  </h3>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {randomNoticias.slice(0, 4).map((n: any, idx: number) => {
                    const resumen = (n.descripcion ?? "").slice(0, 100);
                    return (
                      <Link
                        key={n.id_noticia}
                        href={`/detail/${n.id_noticia}`}
                        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      >
                        <div
                          className="group bg-white rounded-xl p-0 border border-[#eef3f6] hover:border-accent/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2 motion-reduce:transform-none"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="relative overflow-hidden h-[160px]">
                            <img
                              src={getPicsum(n.id_noticia, 640, 360)}
                              alt={n.titulo}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-base group-hover:text-accent transition-colors line-clamp-2 mb-2">
                              {n.titulo}
                            </h4>
                            <p className="text-sm text-muted line-clamp-2">
                              {resumen ? `${resumen}...` : "Resumen no disponible."}
                            </p>
                            <div className="mt-3 flex items-center text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="font-medium">Leer mas</span>
                              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <footer className="mt-8 text-center text-sm text-muted border-t pt-6 pb-4">
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

            <aside className="lg:sticky lg:top-20 lg:self-start">
              <Sidebar />
            </aside>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

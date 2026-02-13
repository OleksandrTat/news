import Link from "next/link";

export default function TerminosPage() {
  return (
    <main className="min-h-screen px-4 py-12">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#dce7ef] bg-white/95 shadow-sm">
        <header className="border-b border-[#e4edf3] bg-[linear-gradient(150deg,#ffffff,#f4f9fc)] px-7 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Legal
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary">Terminos de uso</h1>
          <p className="mt-2 text-sm text-muted">
            Condiciones para el uso adecuado del portal de noticias del campus.
          </p>
        </header>

        <div className="space-y-4 px-7 py-7 text-sm text-muted leading-relaxed">
          <div className="rounded-xl border border-[#dce7ef] bg-[#f7fbfe] p-4">
            Este portal esta destinado a uso academico de la comunidad educativa.
          </div>
          <div className="rounded-xl border border-[#dce7ef] bg-[#f7fbfe] p-4">
            El contenido publicado debe respetar normas internas y legislacion aplicable.
          </div>

          <Link
            href="/noticias"
            className="inline-flex rounded-lg border border-[#d8e4ec] px-4 py-2 font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
          >
            Volver a noticias
          </Link>
        </div>
      </section>
    </main>
  );
}

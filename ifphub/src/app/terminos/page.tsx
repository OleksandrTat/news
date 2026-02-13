import Link from "next/link";

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-2xl border border-[#e7eef3] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-primary">Terminos de uso</h1>
        <p className="mt-4 text-sm text-muted">
          Este portal es de uso academico para la comunidad del campus.
        </p>
        <p className="mt-2 text-sm text-muted">
          El contenido publicado debe respetar las normas internas y la
          legislacion aplicable.
        </p>
        <Link
          href="/noticias"
          className="inline-flex mt-6 text-sm font-semibold text-accent hover:opacity-80"
        >
          Volver a noticias
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-2xl border border-[#e7eef3] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-primary">
          Politica de privacidad
        </h1>
        <p className="mt-4 text-sm text-muted">
          Los datos personales se usan solo para autenticacion y gestion del
          acceso al portal.
        </p>
        <p className="mt-2 text-sm text-muted">
          Si necesitas ejercer tus derechos de acceso, rectificacion o
          eliminacion, contacta con administracion del centro.
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

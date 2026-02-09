import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function DetailPage() {
  return (
    <main className="wrap">
      <Header />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="bg-card rounded-[14px] p-8 shadow-md-custom">
          {/* Article Header */}
          <div className="mb-5">
            <span className="inline-block bg-accent text-white px-2 py-1 rounded-lg text-xs font-bold">ACTUALIDAD</span>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold leading-tight">
              Feria tecnológica del campus: innovación y talento en acción
            </h1>
            <p className="text-sm text-muted mt-1">
              Publicado el 8 de noviembre de 2026 • Por Redacción Campus
            </p>
          </div>

          {/* Media */}
          <div className="h-80 rounded-[14px] bg-gradient-to-br from-soft to-[#ffeaf0] mb-6" />

          {/* Content */}
          <div className="article-content text-gray-800 space-y-4">
            <p>El evento reunió a más de 40 expositores entre empresas, startups y estudiantes. Durante toda la jornada se presentaron proyectos, demostraciones de robots y conferencias sobre innovación tecnológica.</p>
            <p>Además, el pabellón principal contó con una zona interactiva donde los asistentes pudieron probar prototipos y conversar directamente con los creadores. La feria se consolida como una de las actividades más esperadas del año académico.</p>
            <p>Las próximas ediciones incluirán nuevos espacios para emprendimientos sociales y sostenibles, según confirmaron los organizadores.</p>
          </div>

          {/* Related */}
          <section className="mt-10">
            <h3 className="border-l-4 border-accent pl-3 mb-4 text-accent uppercase text-sm tracking-widest">Relacionadas</h3>
            <div className="grid gap-3">
              {[
                { title: 'Charlas de innovación y creatividad', desc: 'Un espacio para compartir ideas y proyectos.' },
                { title: 'Club de robótica abre nuevas inscripciones', desc: 'Conoce cómo participar este semestre.' }
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 bg-white border border-[#eef3f6] p-3 rounded-lg hover:shadow-md transition-transform">
                  <div className="w-24 h-16 rounded-md bg-soft" />
                  <div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-10 text-center text-sm text-muted border-t pt-4">
            © 2026 Portal Noticias — Diseño Pro++
          </footer>
        </article>

        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>
    </main>
  )
}

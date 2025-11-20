export default function Sidebar(){
return (
<div className="space-y-4">
<div className="sticky top-24 bg-white p-4 rounded-lg border border-[#eef3f6] shadow-sm-custom">
<h4 className="text-sm font-bold mb-3">Últimas</h4>
<div className="flex flex-col gap-3">
{[
['Apertura laboratorio','Nuevo equipo disponible'],
['Convocatoria prácticas','Plazas limitadas'],
['Actividad deportiva','Inscripciones abiertas']
].map((it)=> (
<div key={it[0]} className="flex items-center gap-3">
<div className="w-12 h-12 rounded-md bg-[var(--soft)]" />
<div>
<p className="font-semibold text-sm">{it[0]}</p>
<p className="text-xs text-muted">{it[1]}</p>
</div>
</div>
))}
</div>
</div>


<div className="h-[260px] rounded-lg bg-gradient-to-b from-[var(--soft)] to-[#ffdfe8] flex items-center justify-center font-extrabold text-accent">PUBLICIDAD</div>
</div>
)
}
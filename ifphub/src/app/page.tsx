"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const uid = sessionStorage.getItem("uid");
    const sig = sessionStorage.getItem("sig");

    if (uid && sig) {
      router.replace("/noticias");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("/api/usuario/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          setErrorMsg(result?.error ?? "No se pudo iniciar sesion.");
        } else {
          const uid = String(result.usuario.uid);
          const sig = String(result.usuario.sig);
          const userNombre = result.usuario.nombre ?? "";
          const userApellido = result.usuario.apellido ?? "";
          const mail = result.usuario.mail ?? result.usuario.email ?? email ?? "";
          const rol = (result.usuario.rol ?? "").trim().toLowerCase();
          const fullName = [userNombre, userApellido].filter(Boolean).join(" ").trim();

          if (fullName) {
            sessionStorage.setItem("ifphub_user_name", fullName);
          }

          if (mail) {
            sessionStorage.setItem("ifphub_user_email", mail);
          }

          sessionStorage.setItem("ifphub_user_role_uid", uid);
          if (rol) {
            sessionStorage.setItem("ifphub_user_role", rol);
          } else {
            sessionStorage.removeItem("ifphub_user_role");
          }

          sessionStorage.setItem("uid", uid);
          sessionStorage.setItem("sig", sig);

          router.replace("/noticias");
        }
      } else {
        const res = await fetch("/api/usuario/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            apellido,
            email,
            password,
            fecha_nacimiento: null,
            id_curso: null,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          setErrorMsg(result?.error ?? "No se pudo registrar la cuenta.");
        } else {
          setIsLogin(true);
          setPassword("");
        }
      }
    } catch {
      setErrorMsg("No se pudo completar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const infoBlocks = [
    {
      title: "Comunicados oficiales",
      text: "Recibe avisos del campus, fechas clave y cambios de horario en un solo lugar.",
    },
    {
      title: "Eventos y actividades",
      text: "Sigue ferias, charlas y acciones academicas sin perder actualizaciones importantes.",
    },
    {
      title: "Acceso rapido",
      text: "Busca noticias por tema y entra directo al detalle con una experiencia simple.",
    },
  ];

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-[#d8e5ee] bg-white/95 shadow-md-custom lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(160deg,#102f45,#163d56)] px-6 py-8 text-white md:px-8 md:py-10">
          <div className="pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_top,rgba(223,106,57,0.36),transparent_64%)]" />
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_64%)]" />

          <div className="relative space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                IFPHub portal
              </div>
              <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                Noticias que importan
              </h1>
              <p className="mt-4 max-w-xl text-sm text-white/85 md:text-base">
                Accede al portal para consultar novedades del campus, publicaciones del equipo y recursos de la comunidad academica.
              </p>
            </div>

            <div className="space-y-3">
              {infoBlocks.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-white/80">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-white/70">Experiencia</p>
                <p className="mt-1 text-2xl font-bold">Fluida</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-white/70">Actualizacion</p>
                <p className="mt-1 text-2xl font-bold">Constante</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-md">
            <div className="grid grid-cols-2 rounded-xl border border-[#d9e4ec] bg-[#f4f8fb] p-1">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrorMsg("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isLogin ? "bg-white text-primary shadow-sm" : "text-muted"
                }`}
              >
                Iniciar sesion
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrorMsg("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  !isLogin ? "bg-white text-primary shadow-sm" : "text-muted"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            <header className="mt-6">
              <h2 className="text-3xl font-display text-primary">
                {isLogin ? "Bienvenido de nuevo" : "Registro de usuario"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {isLogin
                  ? "Accede para continuar al panel de noticias."
                  : "Completa tus datos para activar tu cuenta en el portal."}
              </p>
            </header>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-primary">Nombre</span>
                    <input
                      type="text"
                      required={!isLogin}
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-[#d6e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      placeholder="Tu nombre"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-primary">Apellido</span>
                    <input
                      type="text"
                      required={!isLogin}
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full rounded-xl border border-[#d6e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      placeholder="Tu apellido"
                    />
                  </label>
                </div>
              )}

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-primary">Correo electronico</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#d6e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  placeholder="correo@campus.com"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-primary">Contrasena</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#d6e2ea] bg-white px-4 py-2.5 pr-20 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-muted transition hover:text-accent"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </label>

              {errorMsg && (
                <div className="rounded-xl border border-[#f1d3c9] bg-[#fff3ef] px-4 py-3 text-sm text-[#a74822]">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Procesando..." : isLogin ? "Entrar al portal" : "Crear cuenta"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              {isLogin ? "Aun no tienes cuenta?" : "Ya tienes cuenta?"} {" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg("");
                }}
                className="font-semibold text-accent hover:text-accent/80"
              >
                {isLogin ? "Registrate aqui" : "Inicia sesion"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

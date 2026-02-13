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
          body: JSON.stringify({ email, password }),
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

          if (fullName) sessionStorage.setItem("ifphub_user_name", fullName);
          if (mail) sessionStorage.setItem("ifphub_user_email", mail);

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

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-[480px] rounded-2xl border border-[#d4e2ea] bg-white/95 p-6 shadow-md-custom md:p-8">
        <div className="mb-6 space-y-2 text-center">
          <div className="inline-flex rounded-full border border-[#d8e4ec] bg-[#f5f9fc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            IFPHub
          </div>
          <h1 className="text-3xl text-primary md:text-4xl">{isLogin ? "Iniciar sesion" : "Crear cuenta"}</h1>
          <p className="text-sm text-muted">
            {isLogin
              ? "Accede al portal de noticias del campus."
              : "Completa tus datos para registrarte en el portal."}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl border border-[#d4e2ea] bg-[#f4f8fb] p-1">
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
            Login
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
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-primary">Nombre</span>
                <input
                  type="text"
                  required={!isLogin}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-xl border border-[#d4e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
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
                  className="w-full rounded-xl border border-[#d4e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
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
              className="w-full rounded-xl border border-[#d4e2ea] bg-white px-4 py-2.5 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
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
                className="w-full rounded-xl border border-[#d4e2ea] bg-white px-4 py-2.5 pr-20 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
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
            <div className="rounded-xl border border-[#f0d1c5] bg-[#fff3ef] px-4 py-3 text-sm text-[#9f4620]">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(140deg,#cb6325,#bc5314)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Procesando..." : isLogin ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isLogin ? "No tienes cuenta?" : "Ya tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="font-semibold text-accent hover:text-accent/80"
          >
            {isLogin ? "Registrate" : "Inicia sesion"}
          </button>
        </p>
      </div>
    </main>
  );
}

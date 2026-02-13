"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateNewsButton from "@/app/frontend/components/create-news-button";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const syncFromUrl = () => {
      const q = new URLSearchParams(window.location.search).get("q");
      setQuery(q ?? "");
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);

    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  const goSearch = () => {
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("sig");
    sessionStorage.removeItem("ifphub_user_name");
    sessionStorage.removeItem("ifphub_user_email");
    sessionStorage.removeItem("ifphub_user_role");
    sessionStorage.removeItem("ifphub_user_role_uid");
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9e4ec] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-3 rounded-xl border border-transparent px-1 py-1 transition hover:border-[#dfe8ee]"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(140deg,#102f45,#0b2537)] text-white font-black text-sm shadow-sm">
              IF
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-bold tracking-wide text-primary">
                IFPHub Noticias
              </div>
              <div className="text-[11px] text-muted">
                Actualidad y comunicados del campus
              </div>
            </div>
          </Link>

          <form
            className="order-3 w-full lg:order-none lg:flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              goSearch();
            }}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m1.85-5.65a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z" />
                </svg>
              </span>
              <input
                aria-label="Buscar noticias"
                placeholder="Buscar noticias, eventos y recursos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-[#d7e3eb] bg-white px-10 py-2.5 text-sm text-primary shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-wide text-muted">
                ENTER
              </span>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/noticias"
              className="hidden rounded-lg border border-[#d8e3ea] bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent/40 hover:text-accent sm:inline-flex"
            >
              Inicio
            </Link>
            <button
              type="button"
              onClick={goSearch}
              className="rounded-lg border border-[#d8e3ea] bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent/40 hover:text-accent"
            >
              Buscar
            </button>
            <CreateNewsButton
              className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
              label="Nueva"
            />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-[#f0d8d0] bg-white px-3 py-2 text-xs font-semibold text-[#b5481d] transition hover:border-[#e7b8a8] hover:text-[#9f3f18]"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

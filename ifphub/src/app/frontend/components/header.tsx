"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CreateNewsButton from "@/app/frontend/components/create-news-button";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    setQuery(q ?? "");
  }, [searchParams]);

  const goSearch = () => {
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#e6edf2] bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold">
            N
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-sm text-primary">
              Noticias — Campus
            </div>
            <div className="text-xs text-muted">Portal de noticias y eventos</div>
          </div>
        </Link>

        <div className="flex-1 hidden md:block">
          <div className="relative">
            <input
              aria-label="Buscar noticias"
              placeholder="Buscar noticias, eventos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goSearch();
                }
              }}
              className="w-full rounded-xl border border-[#dde5ea] bg-white/90 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted">
              Enter
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goSearch}
            className="px-3 py-2 rounded-md text-xs font-semibold border border-[#dde5ea] bg-white hover:border-accent/40 hover:text-accent transition"
          >
            Buscar
          </button>
          <CreateNewsButton className="px-3 py-2 rounded-md text-xs font-semibold bg-accent text-white hover:opacity-90 transition" />
        </div>
      </div>
    </header>
  );
}

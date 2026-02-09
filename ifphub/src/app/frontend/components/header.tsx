"use client";

import Link from "next/link"
import CreateNewsButton from "@/app/frontend/components/create-news-button"

export default function Header() {
  return (
    <header className="sticky top-4 bg-card rounded-[14px] p-4 flex items-center justify-between shadow-md-custom backdrop-blur-sm z-10">
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="w-12 h-12 rounded-[14px] bg-primary text-white flex items-center justify-center font-extrabold cursor-pointer">N</div>
        </Link>

        <div>
          <div className="font-bold text-sm">Noticias — Campus</div>
          <div className="text-xs text-muted">Portal de noticias y eventos</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/search">
          <input
            aria-label="Buscar noticias"
            placeholder="Buscar noticias, eventos..."
            className="w-64 max-w-[40vw] p-2 rounded-md border border-[#dde5ea] bg-[#f9fcfd] cursor-pointer focus:outline-none"
            readOnly
          />
        </Link>
        <Link
          href="/search"
          className="px-3 py-2 rounded-md text-xs font-semibold border border-[#dde5ea] bg-white hover:border-accent/40 hover:text-accent transition"
        >
          Buscar
        </Link>
        <CreateNewsButton
          className="px-3 py-2 rounded-md text-xs font-semibold bg-accent text-white hover:opacity-90 transition"
        />
      </div>
    </header>
  )
}

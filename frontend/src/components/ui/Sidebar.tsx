'use client';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-900 text-zinc-400 min-h-screen p-6 flex flex-col justify-between border-r border-zinc-800">
      <div>
        <div className="mb-10 px-2">
          <h2 className="text-xl font-serif font-semibold text-white tracking-wider">Ark Eucalipto</h2>
          <p className="text-xs text-zinc-500 mt-1">Painel Administrativo</p>
        </div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-3 rounded text-sm font-medium bg-zinc-800 text-white font-semibold">
            📊 Visão Geral
          </Link>
          <Link href="/dashboard/leads" className="flex items-center px-4 py-3 rounded text-sm font-medium hover:bg-zinc-800/50 hover:text-zinc-200">
            🌾 Leads Rurais
          </Link>
        </nav>
      </div>
      <div className="text-xs text-zinc-600 px-2 border-t border-zinc-800 pt-4">v1.0.0</div>
    </aside>
  );
}
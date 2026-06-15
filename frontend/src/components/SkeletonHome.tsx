'use client';

export default function SkeletonHome() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-16 animate-pulse">
      
      {/* Esqueleto do Banner Principal (Hero) */}
      <div className="space-y-4">
        <div className="h-4 bg-zinc-200 rounded w-1/4" />
        <div className="h-12 bg-zinc-200 rounded w-3/4 md:w-1/2" />
        <div className="h-6 bg-zinc-200 rounded w-full md:w-2/3" />
        <div className="flex gap-3 pt-2">
          <div className="h-11 bg-zinc-300 rounded-xl w-32" />
          <div className="h-11 bg-zinc-200 rounded-xl w-32" />
        </div>
      </div>

      {/* Esqueleto da Grade de Produtos/Diferenciais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-zinc-100 rounded-2xl p-6 space-y-4 bg-white/50">
            <div className="w-12 h-12 bg-zinc-200 rounded-xl" />
            <div className="h-5 bg-zinc-200 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-3 bg-zinc-200 rounded w-full" />
              <div className="h-3 bg-zinc-200 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
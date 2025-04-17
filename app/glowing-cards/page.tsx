import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function GlowingCardsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-950">
      <h1 className="mb-8 text-3xl font-bold text-white">Glowing Cards</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="relative overflow-hidden p-6 rounded-xl bg-slate-900 w-72 h-48 flex items-center justify-center border border-slate-800">
            <GlowingEffect 
              spread={20} 
              blur={10}
              glow={true}
              disabled={false}
              variant="default"
            />
            <h2 className="text-xl font-semibold text-white z-10">Card {i}</h2>
          </div>
        ))}
      </div>
    </div>
  );
} 
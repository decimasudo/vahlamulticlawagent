// app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import InteractiveBackground from "@/components/InteractiveBackground";
import { Toaster } from "sonner";
import { BuilderProvider } from "@/context/BuilderContext"; 
import GlobalAssemblyCart from "@/context/GlobalAssemblyCart";
import { 
  LayoutGrid, 
  Cpu, 
  BookOpen, 
  Activity, 
  ShieldCheck, 
  User,
  Settings,
  Store 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Command Center", href: "/dashboard", icon: Activity },
    { name: "Skill Market", href: "/dashboard/browse", icon: Store },
    { name: "Agent Templates", href: "/dashboard/agents", icon: Cpu },
    { name: "Security Protocols", href: "/dashboard/docs", icon: ShieldCheck },
    { name: "System Architecture", href: "/dashboard/how-it-works", icon: LayoutGrid },
  ];

  return (
    <BuilderProvider>
      {/* FIX 1: Ubah background induk menjadi bg-[#050505] yang sangat gelap, 
        TAPI bukan di elemen yang menutupi background.
      */}
      <div className="relative flex h-screen overflow-hidden selection:bg-industrial selection:text-black font-sans bg-transparent text-white">
        
        {/* FIX 2: Letakkan InteractiveBackground di root layer, pastikan z-index nya paling bawah */}
        <div className="absolute inset-0 z-[-10]">
           <InteractiveBackground />
        </div>
        
        {/* Overlay retro scanline */}
        <div className="scanline absolute inset-0 pointer-events-none z-50" />
        
        {/* Toaster UI */}
        <Toaster 
          position="bottom-right" 
          theme="dark"
          toastOptions={{
            style: { background: '#0a0a0a', border: '1px solid #FFCC00', color: '#FFCC00', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '12px' },
          }}
        />

        {/* --- SIDEBAR --- */}
        <aside className="w-64 flex flex-col flex-shrink-0 z-40 bg-black/80 backdrop-blur-md border-r border-gunmetal/30">
          <div className="p-6 border-b border-gunmetal/30 bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-industrial flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(255,204,0,0.4)]">
                <span className="font-black text-black text-lg">V</span>
              </div>
              <div>
                <h1 className="font-bold text-white text-lg tracking-tight uppercase">VAHLA</h1>
                <span className="text-[9px] text-industrial font-terminal uppercase tracking-widest block">Protocol v4.0</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gunmetal/20">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all group relative overflow-hidden ${isActive ? "text-industrial bg-industrial/10 border-l-2 border-industrial" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-industrial" : "text-gray-500 group-hover:text-white"}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gunmetal/30 bg-black/40">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="relative w-8 h-8">
                 <div className="absolute inset-0 border border-gunmetal rounded-sm group-hover:border-industrial transition-colors" />
                 <div className="absolute inset-0 bg-gunmetal/20 flex items-center justify-center">
                   <User className="w-4 h-4 text-gray-400 group-hover:text-industrial" />
                 </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate uppercase tracking-wider group-hover:text-industrial transition-colors">Operator</p>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[9px] text-gray-500 truncate font-terminal">AUBURN-01</p>
                </div>
              </div>
              <Settings className="w-4 h-4 text-gray-600 hover:text-white transition-colors" />
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-transparent">
          
          <GlobalAssemblyCart />

          {/* FIX 3: Pastikan area scroll juga bg-transparent */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-industrial/20 scrollbar-track-transparent bg-transparent">
            {children}
          </div>
        </main>
      </div>
    </BuilderProvider>
  );
}
// EOF
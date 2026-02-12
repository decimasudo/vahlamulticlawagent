// components/GlobalAssemblyCart.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // TAMBAH INI
import { useBuilder } from "@/context/BuilderContext";
import { Cpu, X, Trash2, Rocket, Zap, AlertTriangle } from "lucide-react"; // Ganti FileCode2 jadi Rocket

export default function GlobalAssemblyCart() {
  const router = useRouter(); // INISIALISASI ROUTER
  const { draftSkills, agentName, removeSkill, clearCart, isHydrated } = useBuilder();
  const [isOpen, setIsOpen] = useState(false);

  if (!isHydrated) return null;

  // LOGIKA BARU: Redirect ke halaman Deploy
  const handleProceedToDeploy = () => {
    if (draftSkills.length === 0) return;
    setIsOpen(false);
    router.push("/dashboard/deploy"); // Pindah ke halaman animasi
  };

  return (
    <>
      <div className="fixed top-6 right-8 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className={`
            flex items-center gap-3 px-4 py-2 border-2 transition-all duration-300 shadow-2xl backdrop-blur-md group
            ${draftSkills.length > 0 
              ? "bg-industrial/10 border-industrial text-industrial shadow-[0_0_20px_rgba(255,204,0,0.2)] hover:bg-industrial hover:text-black" 
              : "bg-black/80 border-gunmetal/50 text-gray-500 hover:border-gray-400"}
          `}
        >
          <Cpu className="w-5 h-5 group-hover:animate-pulse" />
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Assembly Line</span>
            <span className="text-xs font-black leading-none mt-1">
              {draftSkills.length} <span className="text-[10px] font-normal">MODULES</span>
            </span>
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#080808] border-2 border-industrial shadow-[0_0_50px_rgba(255,204,0,0.1)] flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-gunmetal/30 flex justify-between items-center bg-industrial text-black shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5" />
                <h2 className="font-black uppercase tracking-widest text-sm">
                  Neural Assembly // {agentName}
                </h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-industrial p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-industrial/20">
              <div className="flex justify-between items-end mb-6">
                 <p className="text-xs text-gray-400 font-terminal uppercase tracking-wider">
                   Review injected modules before deploying.
                 </p>
                 {draftSkills.length > 0 && (
                   <button onClick={clearCart} className="text-[10px] text-red-500 hover:underline font-terminal uppercase">
                     Clear All
                   </button>
                 )}
              </div>

              <div className="space-y-3">
                {draftSkills.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-gunmetal/30 text-center flex flex-col items-center">
                    <AlertTriangle className="w-8 h-8 text-gunmetal mb-3" />
                    <span className="text-gray-500 font-terminal text-xs uppercase">ASSEMBLY LINE IS EMPTY.</span>
                  </div>
                ) : (
                  draftSkills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center justify-between p-4 bg-white/5 border border-gunmetal/30 group hover:border-industrial/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="font-terminal text-[10px] text-gray-500">0{index + 1}</span>
                        <div>
                          <h4 className="font-bold text-sm uppercase text-gray-200 group-hover:text-industrial">{skill.name}</h4>
                          <span className="text-[9px] font-terminal text-gray-500 uppercase">{skill.category}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeSkill(skill.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gunmetal/30 bg-black/60 shrink-0">
              <button 
                onClick={handleProceedToDeploy} // PANGGIL FUNGSI BARU DI SINI
                disabled={draftSkills.length === 0}
                className="w-full py-4 bg-industrial hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform relative z-10" /> 
                <span className="relative z-10">{draftSkills.length === 0 ? "AWAITING MODULES..." : "INITIALIZE DEPLOYMENT"}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
// EOF
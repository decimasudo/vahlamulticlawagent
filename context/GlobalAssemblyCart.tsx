// components/GlobalAssemblyCart.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBuilder } from "@/context/BuilderContext";
import { saveNewAgent } from "@/lib/supabase"; // Import fungsi save
import { Cpu, X, Trash2, Rocket, Zap, AlertTriangle, Edit3, Save } from "lucide-react";
import { toast } from "sonner";

export default function GlobalAssemblyCart() {
  const router = useRouter();
  const { draftSkills, agentName, setAgentName, removeSkill, clearCart, isHydrated } = useBuilder();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State loading saat save ke DB

  if (!isHydrated) return null;

  // LOGIKA BARU: Save ke DB dulu, baru Redirect
  const handleProceedToDeploy = async () => {
    if (draftSkills.length === 0) return;

    // 1. Validasi Nama
    if (!agentName || agentName.trim() === "" || agentName === "Custom Unit") {
      toast.error("PLEASE ENTER A VALID UNIT DESIGNATION NAME.");
      // Fokuskan ke input (opsional, via ref)
      return;
    }

    setIsSaving(true);
    toast.loading("REGISTERING UNIT TO ARCHIVES...", { id: "saving-agent" });

    try {
      // 2. Simpan ke Supabase
      await saveNewAgent({
        name: agentName,
        description: `Community assembled unit with ${draftSkills.length} modules.`,
        skills: draftSkills.map(s => s.name), // Simpan nama skill saja
        is_official: false, // Tandai sebagai Community Agent
        creator: "Anonymous_Operator" // Nanti bisa diganti jika ada sistem Login User
      });

      toast.success("UNIT REGISTERED SUCCESSFULLY.", { id: "saving-agent" });
      
      // 3. Tutup Modal & Redirect ke Animasi Deploy
      setIsOpen(false);
      router.push("/dashboard/deploy");

    } catch (error) {
      console.error(error);
      toast.error("FAILED TO REGISTER UNIT. DEPLOYING LOCALLY ONLY.", { id: "saving-agent" });
      
      // Tetap lanjut deploy meski gagal save ke DB (Fallback)
      setIsOpen(false);
      router.push("/dashboard/deploy");
    } finally {
      setIsSaving(false);
    }
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
                  Neural Assembly
                </h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-industrial p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-industrial/20">
              
              {/* INPUT NAMA AGENT (WAJIB) */}
              <div className="mb-6 bg-white/5 p-4 border border-gunmetal/50 rounded-sm">
                <label className="text-[10px] font-bold uppercase text-industrial tracking-widest mb-2 block flex items-center gap-2">
                  <Edit3 className="w-3 h-3" /> Unit Designation (Required)
                </label>
                <input 
                  type="text" 
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="ENTER_UNIT_NAME (e.g. DATA_SCRAPER_V1)"
                  className="w-full bg-black border border-gunmetal p-3 text-white font-terminal text-sm focus:border-industrial outline-none placeholder:text-gray-700 uppercase"
                />
                <p className="text-[9px] text-gray-500 mt-2 font-terminal">
                  * This name will be used for the installer filename and archived in the community database.
                </p>
              </div>

              <div className="flex justify-between items-end mb-4">
                 <p className="text-xs text-gray-400 font-terminal uppercase tracking-wider">
                   Included Modules ({draftSkills.length})
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
                onClick={handleProceedToDeploy}
                disabled={draftSkills.length === 0 || isSaving}
                className="w-full py-4 bg-industrial hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale group relative overflow-hidden"
              >
                {isSaving ? (
                  <span className="animate-pulse">ARCHIVING UNIT TO DATABASE...</span>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform relative z-10" /> 
                    <span className="relative z-10">INITIALIZE DEPLOYMENT</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
// EOF
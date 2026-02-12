// app/dashboard/deploy/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBuilder } from "@/context/BuilderContext";
import { Terminal, ShieldCheck, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DeployPage() {
  const router = useRouter();
  const { draftSkills, agentName, clearCart, isHydrated } = useBuilder();

  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"compiling" | "securing" | "complete">("compiling");
  
  const dataRef = useRef({ draftSkills, agentName });
  useEffect(() => {
    dataRef.current = { draftSkills, agentName };
  }, [draftSkills, agentName]);

  useEffect(() => {
    // Redirect jika kosong & belum ada progress
    if (isHydrated && draftSkills.length === 0 && progress === 0) {
      router.push("/dashboard");
    }
  }, [isHydrated, draftSkills.length, progress, router]);

  useEffect(() => {
    if (!isHydrated || dataRef.current.draftSkills.length === 0) return;
    
    let currentProgress = 0;
    let phase = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10; 
      if (currentProgress >= 100) currentProgress = 100;
      
      setProgress(currentProgress);

      const { agentName, draftSkills } = dataRef.current;

      if (currentProgress >= 20 && phase === 0) {
        phase = 1;
        setLogs(prev => [...prev, `[SYS] Initializing deployment for UNIT: ${agentName}...`]);
      } 
      else if (currentProgress >= 50 && phase === 1) {
        phase = 2;
        setStatus("compiling");
        setLogs(prev => [...prev, `> Fetching dependencies for ${draftSkills.length} modules...`]);
      } 
      else if (currentProgress >= 80 && phase === 2) {
        phase = 3;
        setStatus("securing");
        setLogs(prev => [...prev, `[CLAWSEC] Injecting armor protocols...`, `> Verifying CVE database match: SAFE.`]);
      } 
      else if (currentProgress >= 100 && phase === 3) {
        phase = 4;
        clearInterval(interval);
        setStatus("complete");
        setLogs(prev => [...prev, `[SUCCESS] .bat payload generated successfully. Initiating transfer...`]);
        
        setTimeout(() => {
          let batContent = `@echo off\ncolor 0E\n`;
          batContent += `echo ====================================================\n`;
          batContent += `echo   VAHLA MULTICLAW : NEURAL DEPLOYMENT SEQUENCE\n`;
          batContent += `echo   AGENT: ${agentName.toUpperCase()}\n`;
          batContent += `echo ====================================================\n\n`;

          draftSkills.forEach((skill, index) => {
            batContent += `echo [MODULE 0${index + 1}] Injecting ${skill.name}...\n`;
            batContent += `${skill.install_command} && npx clawsec install\n`;
            batContent += `echo [MODULE 0${index + 1}] Hardened and Secured.\n\n`;
          });

          batContent += `echo ====================================================\n`;
          batContent += `echo   DEPLOYMENT COMPLETE. UNIT IS OPERATIONAL.\n`;
          batContent += `echo ====================================================\n`;
          batContent += `pause\n`;

          const blob = new Blob([batContent], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          // GUNAKAN NAMA AGENT SEBAGAI NAMA FILE
          link.download = `deploy-${agentName.toLowerCase().replace(/\s+/g, '-')}.bat`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success("PAYLOAD DELIVERED.");
        }, 1000);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isHydrated]);

  const handleReturn = () => {
    clearCart();
    router.push("/dashboard");
  };

  if (!isHydrated) return null;

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 bg-transparent relative z-20">
      <div className="w-full max-w-3xl space-y-8 bg-black/40 p-10 backdrop-blur-md border border-gunmetal/30 rounded-xl shadow-2xl">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border-4 border-gunmetal/30 shadow-[0_0_30px_rgba(255,204,0,0.1)] mb-4 relative">
            {status === "complete" ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : status === "securing" ? (
              <ShieldCheck className="w-10 h-10 text-amber animate-pulse" />
            ) : (
              <Loader2 className="w-10 h-10 text-industrial animate-spin" />
            )}
            {status !== "complete" && (
              <div className="absolute inset-[-4px] rounded-full border-t-4 border-industrial animate-spin" style={{ animationDuration: '2s' }} />
            )}
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            {status === "complete" ? "Deployment Complete" : "Assembling Neural Unit"}
          </h1>
          <p className="text-industrial font-terminal text-sm uppercase tracking-widest">
            TARGET: {agentName}
          </p>
        </div>

        <div className="bg-black/60 border border-gunmetal/50 p-1 rounded-sm overflow-hidden">
          <div 
            className={`h-2 transition-all duration-300 ${status === "complete" ? "bg-green-500" : "bg-industrial"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-[#050505] border-2 border-gunmetal/30 p-6 font-terminal text-xs md:text-sm h-64 overflow-y-auto flex flex-col justify-end shadow-inner relative rounded-sm">
          <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#050505] to-transparent z-10" />
          <div className="space-y-3 z-0">
            {logs.map((log, i) => (
              <div key={i} className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${log.includes('[SUCCESS]') ? 'text-green-500' : log.includes('[CLAWSEC]') ? 'text-amber' : 'text-gray-400'}`}>
                <Terminal className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                <span className="leading-relaxed">{log}</span>
              </div>
            ))}
            {status !== "complete" && (
              <div className="flex gap-2 text-industrial animate-pulse mt-4">
                <span className="w-2 h-4 bg-industrial" />
                <span className="opacity-50">Processing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-8 transition-opacity duration-1000 delay-500" style={{ opacity: status === "complete" ? 1 : 0, pointerEvents: status === "complete" ? 'auto' : 'none' }}>
          <button 
            onClick={handleReturn}
            className="flex items-center gap-3 px-8 py-4 bg-industrial hover:bg-white text-black transition-all font-bold uppercase tracking-widest text-sm group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Acknowledge & Return
          </button>
        </div>
      </div>
    </div>
  );
}
// EOFppn
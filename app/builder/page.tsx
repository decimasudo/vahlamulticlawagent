// app/builder/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import skillsData from "@/data/skills.json";
import { Skill, CommunityAgent } from "@/types";
import { getCommunityAgents, saveCommunityAgent } from "@/lib/supabase";
import CommunityPresets from "@/components/CommunityPresets";
import DownloadSection from "@/components/DownloadSection";
import InteractiveBackground from "@/components/InteractiveBackground";
import { 
  Hammer, 
  Search, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  UploadCloud, 
  Zap,
  Terminal as TerminalIcon
} from "lucide-react";

export default function AgentBuilder() {
  const allSkills: Skill[] = skillsData.skills as unknown as Skill[];
  
  // State Management
  const [communityAgents, setCommunityAgents] = useState<CommunityAgent[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load Community Presets on Mount
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await getCommunityAgents();
        setCommunityAgents(data as unknown as CommunityAgent[]);
      } catch (err) {
        console.error("FAILED_TO_FETCH_COMMUNITY_DATA", err);
      }
    };
    fetchPresets();
  }, []);

  // Manual Input Search Logic (Autocomplete)
  useEffect(() => {
    if (manualInput.length > 1) {
      const filtered = allSkills.filter(s => 
        s.name.toLowerCase().includes(manualInput.toLowerCase()) &&
        !selectedSkills.find(ss => ss.id === s.id)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [manualInput, selectedSkills, allSkills]);

  // Handlers
  const addSkill = (skill: Skill) => {
    if (!selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
      setManualInput("");
      setSuggestions([]);
    }
  };

  const removeSkill = (id: number) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== id));
  };

  const handleFork = (agent: CommunityAgent) => {
    // Load skills based on name matching from our static JSON
    const skillsToLoad = allSkills.filter(s => agent.skills.includes(s.name));
    setSelectedSkills(skillsToLoad);
    // Scroll to workshop
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  // --- NEW FEATURE: PUBLISH TO COMMUNITY ---
  const publishToCommunity = async () => {
    if (selectedSkills.length === 0) {
      alert("CRITICAL_ERROR: No modules detected in assembly line.");
      return;
    }

    const agentName = prompt("ENTER_AGENT_DESIGNATION (e.g., CyberSentinel-01):");
    if (!agentName) return;

    const creatorName = prompt("ENTER_OPERATOR_ID (Your Name):") || "ANON_OPERATOR";

    setIsPublishing(true);
    const newAgent = {
      name: agentName,
      description: `A tactical unit optimized with ${selectedSkills.length} hardened modules.`,
      creator: creatorName,
      skills: selectedSkills.map(s => s.name),
    };

    try {
      await saveCommunityAgent(newAgent);
      alert("SUCCESS: Blueprint archived to Vahla Community Mainframe.");
      
      // Refresh presets to show the new one
      const updated = await getCommunityAgents();
      setCommunityAgents(updated as unknown as CommunityAgent[]);
    } catch (e) {
      console.error(e);
      alert("TRANSMISSION_FAILURE: Could not reach Supabase node.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen relative pb-40 selection:bg-industrial selection:text-black">
      <div className="scanline" />
      <InteractiveBackground />

      {/* Header Section */}
      <header className="border-b-4 border-industrial bg-black/90 backdrop-blur-md p-6 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-3 border border-gunmetal hover:border-industrial text-gunmetal hover:text-industrial transition-all bg-black">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tighter font-rajdhani">Neural_Foundry</h1>
              <p className="text-[10px] font-terminal text-gunmetal tracking-[0.2em]">VAHLA_HEAVY_INDUSTRIES // ASSEMBLY_UNIT_01</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-industrial/5 border border-industrial/20 text-industrial font-terminal text-[10px] uppercase">
              <ShieldCheck className="w-4 h-4" /> Hardening_Protocol_v4.0_Active
            </div>
            <button 
              onClick={publishToCommunity}
              disabled={isPublishing || selectedSkills.length === 0}
              className="flex-grow md:flex-initial flex items-center justify-center gap-2 bg-amber px-6 py-3 text-black font-bold uppercase text-xs hover:bg-white transition-all disabled:opacity-30 disabled:grayscale"
            >
              <UploadCloud className="w-4 h-4" /> {isPublishing ? "ARCHIVING..." : "Publish_to_Community"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-12 mt-8">
        
        {/* 1. Community Presets Section */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
           <CommunityPresets agents={communityAgents} onFork={handleFork} />
        </section>

        {/* 2. Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left: The Assembly Line */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/60 border-2 border-gunmetal p-8 relative overflow-hidden backdrop-blur-sm">
               <div className="absolute top-0 right-0 p-3 font-terminal text-[10px] text-gunmetal opacity-30 rotate-90 origin-top-right select-none">
                 FOUNDRY_PROTOTYPE_v4
               </div>
               
               <div className="flex items-center gap-3 mb-10">
                 <div className="p-2 bg-industrial text-black">
                    <Hammer className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold uppercase tracking-tighter">Current_Blueprint_Assembly</h3>
               </div>

               {selectedSkills.length === 0 ? (
                 <div className="py-24 text-center border-2 border-dashed border-gunmetal/20 flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-2 border-gunmetal/20 rounded-full flex items-center justify-center animate-pulse">
                      <Plus className="text-gunmetal/40" />
                   </div>
                   <p className="font-terminal text-gunmetal text-xs uppercase tracking-widest">
                     Awaiting module injection. <br /> Use the terminal to add skills from the database.
                   </p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {selectedSkills.map((skill, index) => (
                     <div key={skill.id} className="flex items-center justify-between p-5 bg-white/5 border border-gunmetal/30 group hover:border-industrial transition-all relative">
                        {/* Decorative Barcode */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-industrial opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center gap-6">
                          <span className="font-terminal text-gunmetal text-[10px] w-6">0{index + 1}</span>
                          <div>
                            <h4 className="font-bold uppercase text-lg group-hover:text-industrial transition-colors">{skill.name}</h4>
                            <div className="flex gap-2 mt-1">
                               <span className="text-[9px] text-gunmetal font-terminal uppercase border border-gunmetal/30 px-2 py-0.5">{skill.category}</span>
                               <span className="text-[9px] text-amber font-terminal uppercase px-2 py-0.5 bg-amber/5">Verified</span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => removeSkill(skill.id)} 
                          className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                          title="Eject Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   ))}

                   {/* MANDATORY SECURITY LAYER (Visual only, to enforce branding) */}
                   <div className="p-5 bg-amber/10 border-2 border-dashed border-amber/40 flex items-center justify-between relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 pointer-events-none" />
                      <div className="flex items-center gap-6 relative z-10">
                         <span className="font-terminal text-amber text-[10px] w-6">SEC</span>
                         <div>
                           <h4 className="font-bold uppercase text-lg text-amber">ClawSec_Armor_Core</h4>
                           <p className="text-[10px] text-amber/60 font-terminal uppercase mt-1">Automated Integrity & Watchdog Injection</p>
                         </div>
                      </div>
                      <ShieldCheck className="text-amber w-8 h-8 animate-pulse" />
                   </div>
                 </div>
               )}
            </div>

            {/* Tactical Info Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-matte border border-gunmetal/30 flex items-start gap-4">
                  <Zap className="text-industrial w-5 h-5 shrink-0" />
                  <div className="space-y-1">
                     <span className="block text-[10px] font-bold text-gunmetal uppercase tracking-widest">High_Agency_Core</span>
                     <p className="text-[11px] text-gray-500 font-terminal leading-relaxed">
                       Blueprints are optimized for autonomous execution with minimal human intervention.
                     </p>
                  </div>
               </div>
               <div className="p-4 bg-matte border border-gunmetal/30 flex items-start gap-4">
                  <ShieldCheck className="text-amber w-5 h-5 shrink-0" />
                  <div className="space-y-1">
                     <span className="block text-[10px] font-bold text-gunmetal uppercase tracking-widest">Integrity_Verified</span>
                     <p className="text-[11px] text-gray-500 font-terminal leading-relaxed">
                       Cross-referenced with Prompt-Security repositories for CVE protection.
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: The Control Terminal */}
          <aside className="space-y-6">
            <div className="bg-black border-2 border-industrial p-8 space-y-8 sticky top-32 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2">
                 <TerminalIcon className="text-industrial w-5 h-5" />
                 <h3 className="font-bold uppercase tracking-widest text-sm text-industrial">Module_Injection</h3>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-4 text-industrial font-terminal text-sm font-bold animate-pulse">{`>>`}</div>
                <input 
                  type="text" 
                  className="w-full bg-matte/50 border-b-2 border-gunmetal p-4 pl-12 font-terminal text-industrial focus:border-industrial outline-none transition-all placeholder:text-gunmetal/40"
                  placeholder="SEARCH_BY_MODULE_NAME..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                />
                
                {/* Autocomplete Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-black border-2 border-industrial z-50 mt-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                    {suggestions.map(s => (
                      <div 
                        key={s.id}
                        onClick={() => addSkill(s)}
                        className="p-4 border-b border-gunmetal/20 hover:bg-industrial hover:text-black cursor-pointer flex justify-between items-center transition-all group"
                      >
                        <div className="space-y-0.5">
                           <span className="font-terminal text-xs font-bold uppercase block">{s.name}</span>
                           <span className="text-[8px] text-gunmetal group-hover:text-black/60 uppercase">{s.category}</span>
                        </div>
                        <Plus className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4">
                 <div className="bg-white/5 p-4 border border-gunmetal/30">
                    <p className="text-[10px] font-terminal text-gunmetal uppercase leading-relaxed text-center italic">
                       "Every module added is a step towards true agency."
                    </p>
                 </div>
                 
                 <Link href="/dashboard" className="block w-full text-center py-4 bg-gunmetal/10 border border-gunmetal/40 hover:border-industrial text-gunmetal hover:text-industrial font-terminal text-xs transition-all uppercase tracking-[0.2em]">
                   Open_Full_Database
                 </Link>
              </div>
            </div>

            {/* Industrial Character Detail (Optional Decorative) */}
            <div className="p-6 border border-gunmetal/20 bg-black/40 flex items-center gap-4 group overflow-hidden relative">
               <div className="relative w-12 h-12 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src="/scifi-girl.jpeg" alt="Auburn" fill className="object-cover rounded-full border border-industrial" />
               </div>
               <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-industrial uppercase tracking-widest">Operator: Auburn-01</span>
                  <span className="block text-[8px] text-gunmetal font-terminal uppercase">Biometrics: Verified</span>
               </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Global Build & Download Bar */}
      <DownloadSection selectedSkills={selectedSkills} />
    </main>
  );
}
// EOF
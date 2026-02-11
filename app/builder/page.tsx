// app/builder/page.tsx
"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import skillsData from "@/data/skills.json";
import { Skill, CommunityAgent } from "@/types";
import { getCommunityAgents, saveCommunityAgent } from "@/lib/supabase";
import InteractiveBackground from "@/components/InteractiveBackground";
import { 
  Hammer, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  UploadCloud, 
  Cpu,
  Terminal as TerminalIcon
} from "lucide-react";
import DownloadSection from "@/components/DownloadSection";

export default function NeuralFoundry() {
  const allSkills: Skill[] = skillsData.skills as unknown as Skill[];
  
  const [communityAgents, setCommunityAgents] = useState<CommunityAgent[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load Initial Data
  useEffect(() => {
    // 1. Load Presets dari Supabase
    const fetchPresets = async () => {
      const data = await getCommunityAgents();
      setCommunityAgents(data as unknown as CommunityAgent[]);
    };
    
    // 2. Load Draft Skills dari Dashboard (jika ada)
    const saved = localStorage.getItem("vahla_draft_skills");
    if (saved) {
      setSelectedSkills(JSON.parse(saved));
      localStorage.removeItem("vahla_draft_skills"); // Bersihkan setelah di-load
    }

    fetchPresets();
  }, []);

  // Autocomplete Logic
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

  const addSkill = (skill: Skill) => {
    if (!selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
      setManualInput("");
    }
  };

  const removeSkill = (id: number) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== id));
  };

  const publishToCommunity = async () => {
    if (selectedSkills.length === 0) return alert("NO_MODULES_DETECTED");
    const agentName = prompt("ENTER_AGENT_DESIGNATION:") || "UNNAMED_UNIT";
    const creatorName = prompt("ENTER_OPERATOR_ID:") || "ANON_OPERATOR";

    setIsPublishing(true);
    try {
      await saveCommunityAgent({
        name: agentName,
        description: `High-agency unit with ${selectedSkills.length} modules.`,
        creator: creatorName,
        skills: selectedSkills.map(s => s.name),
      });
      alert("BLUEPRINT_ARCHIVED_SUCCESSFULLY");
      window.location.reload();
    } catch (e) {
      alert("TRANSMISSION_ERROR");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen relative pb-40 bg-[#050505]">
      <InteractiveBackground />
      <div className="scanline" />

      {/* Header Foundry */}
      <header className="border-b-4 border-industrial bg-black/90 p-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 border border-gunmetal hover:border-industrial transition-all">
              <ArrowLeft className="w-5 h-5 text-gunmetal" />
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Neural_Foundry</h1>
          </div>
          <button 
            onClick={publishToCommunity}
            disabled={isPublishing || selectedSkills.length === 0}
            className="bg-amber px-6 py-2 text-black font-bold text-xs uppercase hover:bg-white transition-all disabled:opacity-20"
          >
            {isPublishing ? "ARCHIVING..." : "Publish_to_Community"}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-16 mt-10">
        
        {/* SECTION 1: Community Presets (The 5 Examples) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <Cpu className="text-industrial w-5 h-5" />
             <h2 className="text-xl font-bold uppercase tracking-[0.2em]">Community_Presets</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {communityAgents.map((agent) => (
              <div key={agent.id} className="border border-gunmetal/30 bg-black/40 p-5 hover:border-industrial transition-all group">
                <span className="text-[8px] font-terminal text-gunmetal block mb-1">BY: {agent.creator}</span>
                <h4 className="font-bold text-sm uppercase mb-4 truncate">{agent.name}</h4>
                <button 
                  onClick={() => {
                    const presetSkills = allSkills.filter(s => agent.skills.includes(s.name));
                    setSelectedSkills(presetSkills);
                  }}
                  className="w-full py-2 bg-gunmetal/20 text-[9px] font-bold uppercase hover:bg-industrial hover:text-black transition-all"
                >
                  Load_Blueprint
                </button>
              </div>
            ))}
          </div>
        </section>

        

        {/* SECTION 2: The Workshop UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Assembly Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-2 border-gunmetal p-8 bg-black/60 backdrop-blur-sm relative min-h-[400px]">
               <h3 className="text-2xl font-bold uppercase mb-8 flex items-center gap-3">
                 <Hammer className="text-industrial w-6 h-6" /> Assembly_Line
               </h3>

               {selectedSkills.length === 0 ? (
                 <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gunmetal/20">
                    <p className="text-gunmetal font-terminal text-xs animate-pulse uppercase">Waiting for module injection...</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                    {selectedSkills.map((skill, i) => (
                      <div key={skill.id} className="flex justify-between items-center p-4 bg-white/5 border border-gunmetal/30 group">
                        <div className="flex items-center gap-4">
                          <span className="text-gunmetal font-terminal text-[10px]">0{i+1}</span>
                          <h4 className="font-bold uppercase text-sm group-hover:text-industrial transition-colors">{skill.name}</h4>
                        </div>
                        <button onClick={() => removeSkill(skill.id)} className="text-gunmetal hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {/* Hardened Security Node */}
                    <div className="p-4 bg-industrial/10 border-2 border-dashed border-industrial/30 flex justify-between items-center">
                       <div className="flex items-center gap-4 text-industrial">
                          <ShieldCheck className="w-5 h-5" />
                          <span className="font-bold uppercase text-sm tracking-widest">ClawSec_Armor_Core</span>
                       </div>
                       <span className="text-[8px] font-terminal text-industrial">MANDATORY_INJECTION</span>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Module Injection Terminal (Sidebar) */}
          <aside className="space-y-6">
            <div className="border-2 border-industrial bg-black p-6 space-y-6">
              <div className="flex items-center gap-2 text-industrial">
                <TerminalIcon className="w-4 h-4" />
                <h3 className="font-bold uppercase text-xs tracking-widest">Module_Injection</h3>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-industrial font-terminal">$</div>
                <input 
                  type="text"
                  placeholder="SEARCH_BY_NAME..."
                  className="w-full bg-matte border border-gunmetal p-3 pl-8 font-terminal text-industrial outline-none focus:border-industrial"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-black border-2 border-industrial z-50 mt-1">
                    {suggestions.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => addSkill(s)}
                        className="p-3 border-b border-gunmetal/20 hover:bg-industrial hover:text-black cursor-pointer font-terminal text-[10px] uppercase flex justify-between items-center"
                      >
                        {s.name} <Plus className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-4">
                <p className="text-[9px] text-gunmetal font-terminal uppercase leading-relaxed text-center">
                  -- OR --
                </p>
                <Link href="/dashboard" className="block w-full py-3 border border-gunmetal text-gunmetal text-center font-terminal text-[10px] hover:border-industrial hover:text-industrial transition-all">
                  BROWSE_1700+_SKILLS
                </Link>
              </div>
            </div>

            {/* Operator Signature (Auburn-01 Image) */}
            <div className="p-4 border border-gunmetal/20 bg-black/40 flex items-center gap-4">
               <div className="relative w-12 h-12 border border-industrial overflow-hidden">
                  <Image src="/scifi-girl.jpeg" alt="Auburn" fill className="object-cover grayscale" />
               </div>
               <div className="font-terminal space-y-0.5">
                  <span className="block text-industrial text-[10px] font-bold">OPERATOR: AUBURN-01</span>
                  <span className="block text-gunmetal text-[8px] uppercase tracking-widest">Biometrics_Verified</span>
               </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Reusing existing DownloadSection for Final Build */}
      <DownloadSection selectedSkills={selectedSkills} />
    </main>
  );
}
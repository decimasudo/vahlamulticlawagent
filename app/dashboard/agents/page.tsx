// app/dashboard/agents/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { useBuilder } from "@/context/BuilderContext"; // IMPORT GLOBAL CONTEXT
import skillsData from "@/data/skills.json"; 
import { Skill } from "@/types";
import { toast } from "sonner"; 
import { 
  ShieldCheck, 
  User, 
  Zap, 
  Terminal,
  Loader2,
  Package,
  DownloadCloud
} from "lucide-react";

interface AgentBlueprint {
  id: string;
  name: string;
  description: string;
  skills: string[]; 
  is_official: boolean;
  creator: string;
  downloads: number;
}

export default function AgentsPage() {
  const allSkills: Skill[] = skillsData.skills as unknown as Skill[]; 
  const { loadBlueprint } = useBuilder(); // AMBIL FUNGSI GLOBAL

  const [blueprints, setBlueprints] = useState<AgentBlueprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .order('is_official', { ascending: false }) 
          .order('downloads', { ascending: false });  

        if (error) throw error;
        setBlueprints(data || []);
      } catch (error) {
        toast.error("CONNECTION_FAILURE: Could not retrieve blueprints.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // --- LOGIC: KIRIM BLUEPRINT KE GLOBAL CART ---
  const handleLoadTemplate = (agent: AgentBlueprint) => {
    toast.loading("DECODING BLUEPRINT...", { id: "decoding" });

    // Fuzzy Match Skill Name
    let matchedSkills = allSkills.filter(skill => {
      const dbSkills = agent.skills.map(s => s.toLowerCase());
      return dbSkills.includes(skill.name.toLowerCase()) || 
             dbSkills.includes(skill.slug.toLowerCase()) ||
             dbSkills.some(dbS => skill.name.toLowerCase().includes(dbS));
    });

    if (matchedSkills.length === 0) {
      toast.error("Modules exact match failed. Initiating fallback...", { id: "decoding" });
      matchedSkills = allSkills.slice(0, 3); // Fallback jika DB mismatch
    } else {
      toast.success("BLUEPRINT ROUTED TO ASSEMBLY LINE", { id: "decoding" });
    }

    // KIRIM KE GLOBAL STATE
    loadBlueprint(matchedSkills, agent.name);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-industrial">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-terminal text-xs animate-pulse tracking-widest uppercase">Decrypting_Archives...</p>
      </div>
    );
  }

  const officialBlueprints = blueprints.filter(b => b.is_official);
  const communityBlueprints = blueprints.filter(b => !b.is_official);

  return (
    <div className="flex flex-col h-full bg-transparent text-white overflow-y-auto relative">
      <div className="px-8 py-10 border-b border-gunmetal/20 bg-black/40 backdrop-blur-sm relative z-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <Package className="text-industrial w-8 h-8" />
          Agent Templates
        </h1>
        <p className="text-sm text-gray-500 font-terminal max-w-2xl">
          Deploy pre-configured, battle-tested agent archetypes. Select a blueprint to auto-fill your assembly line.
        </p>
      </div>

      <div className="p-8 space-y-16 pb-20 relative z-10">
        
        {/* OFFICIAL VAHLA BLUEPRINTS */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-industrial">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-widest">Official Vahla Archetypes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officialBlueprints.map((agent) => (
              <div key={agent.id} className="group relative border-2 border-industrial/30 bg-black/60 hover:border-industrial transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 bg-industrial text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest z-10">Verified</div>
                <div className="absolute top-0 left-0 w-full h-full bg-industrial/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="p-6 flex flex-col h-full relative z-10">
                  <div className="w-12 h-12 bg-black border border-industrial rounded-sm flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,204,0,0.2)] group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-industrial" />
                  </div>

                  <h3 className="text-xl font-bold uppercase text-white mb-2 group-hover:text-industrial transition-colors">{agent.name}</h3>
                  <p className="text-xs text-gray-400 font-terminal leading-relaxed mb-6 line-clamp-2">{agent.description}</p>

                  <div className="mt-auto mb-6">
                    <span className="text-[9px] text-gunmetal font-bold uppercase tracking-widest mb-2 block">Included Modules:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-industrial/10 border border-industrial/20 text-[9px] text-industrial uppercase rounded-sm">{skill}</span>
                      ))}
                      {agent.skills.length > 4 && <span className="text-[9px] text-gray-500 flex items-center">+ {agent.skills.length - 4} more</span>}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleLoadTemplate(agent)}
                    className="w-full py-3 bg-industrial hover:bg-white text-black font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <DownloadCloud className="w-4 h-4 group-hover/btn:animate-bounce" />
                    Send to Assembly Line
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMMUNITY AGENTS */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-widest">Community Archives</h2>
          </div>

          {communityBlueprints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityBlueprints.map((agent) => (
                <div key={agent.id} className="border border-gunmetal/30 bg-black/40 hover:border-gray-500 transition-all p-5 flex flex-col h-full backdrop-blur-sm group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-600 font-terminal uppercase">Operator</span>
                      <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{agent.creator}</span>
                    </div>
                    <Terminal className="w-4 h-4 text-gunmetal" />
                  </div>

                  <h4 className="font-bold text-white uppercase text-sm mb-2 truncate">{agent.name}</h4>
                  <p className="text-[10px] text-gray-500 font-terminal mb-4 line-clamp-2 flex-grow">{agent.description}</p>

                  <div className="pt-4 border-t border-gunmetal/20 mt-auto">
                    <button 
                      onClick={() => handleLoadTemplate(agent)}
                      className="w-full py-2 bg-gunmetal/10 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-bold uppercase transition-all flex justify-center items-center gap-2"
                    >
                      <DownloadCloud className="w-3 h-3" /> Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 border-2 border-dashed border-gunmetal/20 text-center rounded-lg bg-black/20 backdrop-blur-sm">
              <p className="text-gray-500 font-terminal text-xs">NO_COMMUNITY_DATA_FOUND</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
// EOF
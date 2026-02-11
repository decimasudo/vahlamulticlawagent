// components/CommunityPresets.tsx
"use client";

import { CommunityAgent } from "@/types";

interface Props {
  agents: CommunityAgent[];
  onFork: (agent: CommunityAgent) => void;
}

export default function CommunityPresets({ agents, onFork }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-l-4 border-amber pl-4">
        <h3 className="text-xl font-bold uppercase tracking-tighter">Community_Presets</h3>
        <span className="text-[10px] text-gunmetal font-terminal">TOP_05_UNITS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {agents.length > 0 ? agents.map((agent) => (
          <div 
            key={agent.id}
            className="border border-gunmetal/30 bg-black/40 p-4 hover:border-industrial transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-2 -top-2 w-8 h-8 bg-industrial/10 rotate-45" />
            <span className="text-[8px] font-terminal text-gunmetal block mb-1">CREATOR: {agent.creator}</span>
            <h4 className="font-bold text-sm uppercase mb-2 truncate group-hover:text-industrial">{agent.name}</h4>
            <div className="flex flex-wrap gap-1 mb-4">
              {agent.skills.slice(0, 2).map(s => (
                <span key={s} className="text-[7px] bg-white/5 px-1 py-0.5 border border-white/10 text-gray-400">
                  {s}
                </span>
              ))}
              {agent.skills.length > 2 && <span className="text-[7px] text-gunmetal">+{agent.skills.length - 2}</span>}
            </div>
            <button 
              onClick={() => onFork(agent)}
              className="w-full py-1.5 bg-gunmetal/20 text-[9px] font-bold uppercase tracking-widest hover:bg-industrial hover:text-black transition-all"
            >
              Load_Blueprint
            </button>
          </div>
        )) : (
          <div className="col-span-5 py-10 border border-dashed border-gunmetal/20 text-center text-gunmetal text-xs font-terminal">
            NO_COMMUNITY_DATA_FOUND
          </div>
        )}
      </div>
    </div>
  );
}
// EOF
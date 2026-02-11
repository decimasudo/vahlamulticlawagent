// components/SkillDetailModal.tsx
"use client";

import { Skill } from "@/types";

interface Props {
  skill: Skill;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function SkillDetailModal({ skill, onClose, onSelect, isSelected }: Props) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl">
      <div className="max-w-3xl w-full border-2 border-industrial bg-[#111] overflow-hidden relative shadow-[0_0_50px_rgba(255,204,0,0.2)]">
        
        {/* Header Modal */}
        <div className="bg-industrial p-3 flex justify-between items-center">
          <span className="font-terminal text-black font-bold text-xs tracking-widest">SKILL_SPECIFICATION // {skill.slug}</span>
          <button onClick={onClose} className="text-black font-bold hover:scale-110 transition-transform px-2"> [ X ] </button>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          {/* Main Info */}
          <div className="space-y-2">
            <div className="text-amber font-terminal text-xs uppercase tracking-[0.3em]">Module_Classification</div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">{skill.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Side: Description */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="block text-[10px] text-gunmetal uppercase font-bold tracking-widest">Function_Log</span>
                <p className="text-gray-300 font-terminal leading-relaxed text-sm">
                  {skill.description}
                </p>
              </div>
              
              <div className="p-4 bg-industrial/5 border-l-4 border-industrial">
                <span className="block text-[10px] text-industrial uppercase font-bold mb-1">Vahla_Security_Note</span>
                <p className="text-[11px] text-gunmetal font-terminal">
                  This module has been patched with ClawSec Feed and Watchdog compatibility. Integrity is verified.
                </p>
              </div>
            </div>

            {/* Right Side: Metadata */}
            <div className="space-y-6 bg-black/40 p-6 border border-gunmetal/20">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gunmetal/20 pb-2">
                  <span className="text-[10px] text-gunmetal uppercase font-bold">Category</span>
                  <span className="text-xs text-industrial uppercase font-bold">{skill.category}</span>
                </div>
                <div className="flex justify-between border-b border-gunmetal/20 pb-2">
                  <span className="text-[10px] text-gunmetal uppercase font-bold">Author</span>
                  <span className="text-xs text-amber font-bold">{skill.author}</span>
                </div>
                <div className="flex justify-between border-b border-gunmetal/20 pb-2">
                  <span className="text-[10px] text-gunmetal uppercase font-bold">Source</span>
                  <a href={skill.github_url} target="_blank" className="text-xs text-blue-400 hover:underline">View GitHub</a>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => { onSelect(); onClose(); }}
                  className={`w-full py-3 font-bold uppercase tracking-widest transition-all ${
                    isSelected ? 'bg-gunmetal text-black' : 'bg-industrial text-black hover:bg-white'
                  }`}
                >
                  {isSelected ? "Remove_From_Agent" : "Add_To_Agent"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Decor */}
        <div className="bg-gunmetal/10 p-2 text-center text-[8px] text-gunmetal font-terminal tracking-[0.5em]">
          DATA_STREAM_SECURED // END_OF_FILE
        </div>
      </div>
    </div>
  );
}
// EOF
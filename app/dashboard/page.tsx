// app/dashboard/page.tsx
"use client";

import { useState, useMemo } from "react";
import skillsData from "@/data/skills.json"; 
import { Skill } from "@/types";
import DownloadSection from "@/components/DownloadSection";
import InteractiveBackground from "@/components/InteractiveBackground";
import SkillDetailModal from "@/components/SkillDetailModal";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 12;

export default function Dashboard() {
  const allSkills: Skill[] = skillsData.skills as unknown as Skill[];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL_MODULES");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  // Extract Categories
  const categories = useMemo(() => {
    const cats = new Set(allSkills.map(s => s.category));
    return ["ALL_MODULES", ...Array.from(cats)];
  }, [allSkills]);

  // Logic: Filter & Search
  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "ALL_MODULES" || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allSkills, searchTerm, selectedCategory]);

  // Logic: Pagination
  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSkills = filteredSkills.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleSkill = (skill: Skill) => {
    if (selectedSkills.find((s) => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col lg:flex-row overflow-hidden">
      <div className="scanline" />
      <InteractiveBackground />

      {/* --- SIDEBAR: CATEGORY NAVIGATION --- */}
      <aside className="w-full lg:w-72 bg-black/90 border-r-2 border-industrial z-30 flex flex-col h-auto lg:h-screen sticky top-0">
        <div className="p-6 border-b border-gunmetal/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-amber animate-ping" />
            <span className="font-terminal text-[10px] text-amber tracking-[0.3em]">CORE_NAVIGATOR</span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tighter">Classifications</h2>
        </div>

        <nav className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`w-full text-left px-4 py-3 font-terminal text-[11px] uppercase transition-all flex justify-between items-center group ${
                selectedCategory === cat 
                ? "bg-industrial text-black font-bold shadow-[0_0_15px_rgba(255,204,0,0.3)]" 
                : "text-gunmetal hover:text-industrial hover:bg-industrial/5"
              }`}
            >
              <span>{cat.replace(/ & /g, '_').replace(/ /g, '_')}</span>
              <div className={`w-1 h-3 ${selectedCategory === cat ? 'bg-black' : 'bg-gunmetal/30 group-hover:bg-industrial'}`} />
            </button>
          ))}
        </nav>

        <div className="p-6 bg-industrial/5 border-t border-gunmetal/30">
          <div className="text-[9px] font-terminal text-gunmetal mb-2">FOUNDRY_STATUS:</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[10px] font-bold text-gray-400">ENCRYPTED_CONNECTION</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <section className="flex-grow flex flex-col h-screen overflow-y-auto relative">
        
        {/* Top Filtering Bar */}
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b-2 border-industrial p-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="w-full md:flex-grow relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-industrial font-terminal text-xs">`{'>'}` `{'>'}` </div>
              <input
                type="text"
                placeholder="INPUT_SEARCH_QUERY_..."
                className="w-full bg-matte/50 border border-gunmetal p-4 pl-12 font-terminal text-industrial outline-none focus:border-industrial transition-all placeholder:text-gunmetal"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            <div className="flex items-center gap-6 font-terminal min-w-max">
              <div className="text-right">
                <span className="block text-[9px] text-gunmetal uppercase">Matches_Found</span>
                <span className="text-xl font-bold text-industrial">{filteredSkills.length.toString().padStart(4, '0')}</span>
              </div>
              <div className="h-8 w-px bg-gunmetal/30" />
              <div className="text-right">
                <span className="block text-[9px] text-gunmetal uppercase">Active_Category</span>
                <span className="text-sm font-bold text-amber truncate max-w-[120px] block">
                  {selectedCategory === "ALL_MODULES" ? "GLOBAL" : selectedCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 max-w-6xl mx-auto w-full flex-grow">
          {paginatedSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {paginatedSkills.map((skill) => { 
                const isSelected = selectedSkills.find((s) => s.id === skill.id);
                return (
                  <div 
                    key={skill.id}
                    className={`group relative border-2 transition-all duration-300 flex flex-col h-80 ${
                      isSelected ? "border-industrial bg-industrial/10" : "border-gunmetal bg-black/40 hover:border-amber shadow-lg"
                    }`}
                  >
                    <div className="p-6 flex flex-col h-full relative">
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-terminal text-[9px] text-gunmetal">ID_{skill.id.toString().padStart(4, '0')}</span>
                        <div className="flex gap-2">
                           <button onClick={() => setActiveSkill(skill)} className="text-[9px] text-amber border border-amber/40 px-2 py-0.5 hover:bg-amber hover:text-black transition-all font-bold">SPECS</button>
                           <button 
                             onClick={() => toggleSkill(skill)} 
                             className={`text-[9px] px-2 py-0.5 font-bold transition-all ${isSelected ? 'bg-industrial text-black' : 'bg-gunmetal/40 text-white hover:bg-industrial hover:text-black'}`}
                           >
                             {isSelected ? "DETACH" : "ATTACH"}
                           </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg uppercase mb-3 leading-tight tracking-tight group-hover:text-industrial transition-colors">
                        {skill.name}
                      </h3>
                      <p className="font-terminal text-[11px] text-gray-500 line-clamp-4 mb-4 leading-relaxed">
                        {skill.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gunmetal/10 flex justify-between items-center">
                        <span className="text-[8px] font-bold text-gunmetal px-2 py-1 bg-white/5 border border-white/10 uppercase tracking-widest">{skill.category}</span>
                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-industrial rounded-full animate-ping" />
                            <span className="text-[8px] font-bold text-industrial">SYNC_ACTIVE</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-gunmetal/20">
              <span className="text-gunmetal font-terminal animate-pulse">NO_MODULES_MATCH_CURRENT_DECODING_CRITERIA</span>
            </div>
          )}

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>

        {/* Space for DownloadSection padding */}
        <div className="h-40" />
      </section>

      {/* Global Components */}
      <DownloadSection selectedSkills={selectedSkills} />

      {activeSkill && (
        <SkillDetailModal 
          skill={activeSkill} 
          onClose={() => setActiveSkill(null)}
          onSelect={() => toggleSkill(activeSkill)}
          isSelected={!!selectedSkills.find(s => s.id === activeSkill.id)}
        />
      )}
    </main>
  );
}
// EOF
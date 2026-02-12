// app/dashboard/browse/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBuilder } from "@/context/BuilderContext"; // IMPORT CONTEXT GLOBAL
import skillsData from "@/data/skills.json"; 
import { Skill } from "@/types";
import Pagination from "@/components/Pagination";
import { Search, Info, ShieldCheck, Filter, Hash, Sparkles } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function BrowseSkillsPage() {
  const router = useRouter();
  const allSkills: Skill[] = skillsData.skills as unknown as Skill[];

  // --- MENGGUNAKAN GLOBAL STATE ---
  const { draftSkills, addSkill, removeSkill } = useBuilder();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL_MODULES");
  const [currentPage, setCurrentPage] = useState(1);

  // Logic Hitung Jumlah Skill
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "ALL_MODULES": allSkills.length };
    allSkills.forEach(skill => {
      const cat = skill.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allSkills]);

  const categories = useMemo(() => {
    const cats = Object.keys(categoryCounts).filter(c => c !== "ALL_MODULES").sort();
    return ["ALL_MODULES", ...cats];
  }, [categoryCounts]);

  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "ALL_MODULES" || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allSkills, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSkills = filteredSkills.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Fungsi Toggle sekarang memanggil fungsi dari Global Context
  const toggleSkill = (skill: Skill) => {
    if (draftSkills.find((s) => s.id === skill.id)) {
      removeSkill(skill.id);
    } else {
      addSkill(skill);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      <div className="px-8 pt-8 pb-4 shrink-0 z-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Browse Skills</h1>
          <p className="text-sm text-gray-500 font-terminal mb-6">
            Discover and install <span className="text-white font-bold">{allSkills.length}</span> AI agent skills secured by Vahla.
          </p>

          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, description, or author..."
              className="w-full bg-black/60 border border-gunmetal/40 rounded-lg py-4 pl-12 pr-4 text-base text-white focus:border-industrial focus:outline-none focus:ring-1 focus:ring-industrial/50 transition-all placeholder:text-gray-600 font-terminal backdrop-blur-sm shadow-xl"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex">
          
          <aside className="w-72 hidden lg:flex flex-col border-r border-gunmetal/10 py-4 pr-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gunmetal/20 bg-black/20 backdrop-blur-sm">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-2 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Categories
            </div>
            
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-md text-sm font-terminal transition-all group ${isActive ? "bg-industrial/10 text-industrial font-bold border-l-2 border-industrial" : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"}`}
                  >
                    <span className="truncate pr-2">{cat.replace(/ & /g, ' & ').replace(/_/g, ' ')}</span>
                    <span className={`text-[10px] py-0.5 px-1.5 rounded-sm ${isActive ? 'bg-industrial/20 text-industrial' : 'bg-gunmetal/20 text-gray-600'}`}>
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="flex-1 overflow-y-auto p-6 md:pl-10 scrollbar-thin scrollbar-thumb-industrial/20">
            <div className="flex items-center gap-2 mb-6 text-xs font-terminal text-gray-500">
              <Sparkles className="w-3 h-3 text-industrial" />
              <span>{filteredSkills.length} skills found in <span className="text-white uppercase">{selectedCategory.replace(/_/g, ' ')}</span></span>
            </div>

            {paginatedSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {paginatedSkills.map((skill) => { 
                  // CEK STATUS DARI GLOBAL DRAFT SKILLS
                  const isSelected = draftSkills.find((s) => s.id === skill.id);
                  return (
                    <div 
                      key={skill.id}
                      className={`group relative border rounded-xl transition-all duration-300 flex flex-col h-[300px] overflow-hidden ${isSelected ? "border-industrial bg-industrial/10 shadow-[0_0_30px_rgba(255,204,0,0.1)] backdrop-blur-md" : "border-gunmetal/30 hover:border-gunmetal bg-black/40 hover:bg-black/60 backdrop-blur-sm"}`}
                    >
                      <div className="px-5 py-4 border-b border-gunmetal/20 flex justify-between items-center bg-black/30">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-md bg-gunmetal/10 border border-gunmetal/30 flex items-center justify-center text-gray-400 font-mono text-xs">{'>_'}</div>
                           <div className="flex flex-col">
                             <span className="font-bold text-white text-sm truncate max-w-[120px]">{skill.name}</span>
                             <span className="text-[10px] text-gray-600 font-terminal">by {skill.author}</span>
                           </div>
                        </div>
                        {isSelected && <ShieldCheck className="w-4 h-4 text-industrial" />}
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <p className="font-terminal text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4 flex-grow">{skill.description}</p>
                        <div className="flex items-center gap-2 mb-4">
                           <span className="px-2 py-1 rounded bg-gunmetal/20 border border-gunmetal/30 text-[9px] text-gray-500 uppercase font-terminal">{skill.category}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2 mt-auto">
                          <button 
                            onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/${skill.slug}`); }}
                            className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" /> Details
                          </button>
                          
                          <button 
                            onClick={() => toggleSkill(skill)} 
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${isSelected ? 'bg-industrial text-black hover:bg-white' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                          >
                            {isSelected ? "Attached" : "Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 font-terminal border-2 border-dashed border-gunmetal/20 rounded-xl bg-black/20 backdrop-blur-sm">
                <Hash className="w-10 h-10 mb-4 opacity-20" />
                <p>NO_MODULES_MATCH_CRITERIA</p>
                <button onClick={() => {setSearchTerm(""); setSelectedCategory("ALL_MODULES");}} className="mt-4 text-industrial hover:underline text-xs uppercase">Reset Filters</button>
              </div>
            )}

            <div className="mt-10 mb-10 border-t border-gunmetal/20 pt-6">
               <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// EOF
// app/dashboard/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import skillsData from "@/data/skills.json";
import { Skill } from "@/types";
import TestDriveModal from "@/components/TestDriveModal";
import { Terminal, Github, Play, ArrowLeft, Bookmark, Zap, Shield, Copy, Check } from "lucide-react";

export default function SkillDetail() {
  const { slug } = useParams();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [securedCopied, setSecuredCopied] = useState(false);

  useEffect(() => {
    const found = (skillsData.skills as Skill[]).find(s => s.slug === slug);
    if (found) setSkill(found);
  }, [slug]);

  const copyCmd = (command: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(command);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  if (!skill) return <div className="p-20 font-terminal text-center">SCANNING_DATABASE...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 pb-20 p-6 md:p-12">
      <TestDriveModal isOpen={isTestDriveOpen} onClose={() => setIsTestDriveOpen(false)} skill={skill} />

      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Breadcrumb */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gunmetal hover:text-industrial transition-colors font-terminal text-sm">
          <ArrowLeft className="w-4 h-4" /> BACK_TO_FOUNDRY
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-gunmetal/20 pb-10">
          <div className="flex gap-6 items-center">
            <div className="p-5 bg-industrial/10 border-2 border-industrial text-industrial shadow-[0_0_20px_rgba(255,204,0,0.1)]">
              <Terminal className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold uppercase tracking-tighter">{skill.name}</h1>
              <div className="flex items-center gap-3 text-gunmetal font-terminal text-sm mt-2">
                <span>AUTHOR: {skill.author}</span>
                <span>//</span>
                <span className="text-industrial">{skill.category}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <a href={skill.github_url} target="_blank" className="flex items-center gap-2 px-6 py-3 border border-gunmetal hover:border-industrial transition-all font-terminal text-xs">
               <Github className="w-4 h-4" /> SOURCE_CODE
             </a>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Install Commands Block */}
            <div className="space-y-6">
              <h3 className="font-bold text-xl uppercase tracking-widest text-amber">Installation_Protocols</h3>
              
              {/* Basic Install */}
              <div className="border border-gunmetal/30 bg-black/50 overflow-hidden">
                <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/5">
                  <span className="text-[10px] font-terminal text-gunmetal">STANDARD_DEPLOYMENT</span>
                  <button onClick={() => copyCmd(skill.install_command, setCopied)} className="text-xs font-terminal text-industrial flex items-center gap-2">
                    {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
                <div className="p-6 font-mono text-sm bg-black">
                  <span className="text-industrial mr-3">$</span> {skill.install_command}
                </div>
              </div>

              {/* Secure Install (Branding request) */}
              <div className="border border-industrial/30 bg-industrial/5 overflow-hidden">
                <div className="bg-industrial/10 px-4 py-2 flex justify-between items-center border-b border-industrial/10">
                  <span className="text-[10px] font-terminal text-industrial">SECURED_VAHLA_DEPLOYMENT</span>
                  <button onClick={() => copyCmd(`${skill.install_command} && npx clawsec install`, setSecuredCopied)} className="text-xs font-terminal text-amber flex items-center gap-2">
                    {securedCopied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} {securedCopied ? 'COPIED' : 'COPY_WITH_ARMOR'}
                  </button>
                </div>
                <div className="p-6 font-mono text-sm bg-black text-amber">
                  <span className="text-amber mr-3">$</span> {skill.install_command} && npx clawsec install
                </div>
              </div>
            </div>

            {/* About */}
            <section className="space-y-4">
              <h3 className="font-bold text-xl uppercase tracking-widest">About_Module</h3>
              <p className="text-gray-400 leading-relaxed font-terminal">
                {skill.description}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <button 
              onClick={() => setIsTestDriveOpen(true)}
              className="w-full py-8 bg-industrial text-black font-bold flex flex-col items-center gap-3 hover:bg-white transition-all shadow-[0_10px_40px_rgba(255,204,0,0.1)] group"
            >
              <Play className="w-8 h-8 fill-current group-hover:scale-125 transition-transform" />
              <span className="text-lg tracking-[0.2em]">INITIALIZE_TEST_DRIVE</span>
            </button>

            <div className="p-6 border border-gunmetal/30 bg-white/5 font-terminal space-y-4">
               <h4 className="text-xs font-bold text-gunmetal border-b border-gunmetal/20 pb-2 uppercase">Integrity_Metadata</h4>
               <div className="space-y-3 text-[11px]">
                  <div className="flex justify-between"><span className="text-gunmetal">VERSION:</span><span>1.0.5</span></div>
                  <div className="flex justify-between"><span className="text-gunmetal">LICENSE:</span><span>MIT</span></div>
                  <div className="flex justify-between"><span className="text-gunmetal">STATUS:</span><span className="text-green-500">HARDENED</span></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
// EOF
// app/dashboard/docs/page.tsx
"use client";

import { 
  Book, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  AlertTriangle,
  ChevronRight,
  Code2,
  Server,
  FileText,
  Zap,
  Layout
} from "lucide-react";

export default function DocumentationPage() {
  
  // Fungsi Smooth Scroll
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "architecture", title: "System Architecture" },
    { id: "installation", title: "Installation & Setup" },
    { id: "clawsec", title: "ClawSec Protocols" },
    { id: "foundry", title: "Neural Foundry Usage" },
    { id: "api", title: "Developer API" },
    { id: "troubleshooting", title: "Troubleshooting" },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent text-white font-sans relative z-10">
      
      {/* Hero Header */}
      <div className="px-8 py-12 border-b border-gunmetal/20 bg-black/40 backdrop-blur-md">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
          <Book className="text-industrial w-10 h-10" />
          Vahla Documentation
        </h1>
        <p className="text-sm text-gray-500 font-terminal max-w-2xl leading-relaxed">
          The official manual for Vahla MultiClaw OS. Includes architectural overviews, API references, and security hardening guidelines for high-agency units.
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex">
          
          {/* --- LEFT SIDEBAR (Table of Contents) --- */}
          <aside className="w-72 hidden lg:flex flex-col border-r border-gunmetal/20 py-8 pr-6 overflow-y-auto bg-black/20 backdrop-blur-sm">
            <div className="p-4 border border-gunmetal/30 bg-[#0a0a0a] rounded-sm mb-6 shadow-lg">
              <h3 className="font-bold text-xs uppercase tracking-widest text-industrial mb-4 flex items-center gap-2">
                <Layout className="w-3 h-3" /> Table_of_Contents
              </h3>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button 
                      onClick={() => scrollToSection(section.id)}
                      className="w-full text-left text-[11px] font-terminal text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-sm transition-all flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 text-gunmetal group-hover:text-industrial transition-colors" />
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-industrial/5 border border-industrial/20 rounded-sm">
              <div className="flex items-center gap-2 mb-2 text-amber">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-bold text-xs uppercase">Latest Patch</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-terminal">
                Docs updated for Kernel v4.0.5. <br/>
                Includes new CVE definitions.
              </p>
            </div>
          </aside>

          {/* --- MAIN CONTENT SCROLL AREA --- */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-industrial/20 scroll-smooth">
            <article className="max-w-4xl space-y-16 pb-20">
              
              {/* 1. Introduction */}
              <section id="intro" className="scroll-mt-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-4 mb-6 flex items-center gap-3">
                  <span className="text-industrial">01.</span> Introduction
                </h2>
                <div className="prose prose-invert prose-sm max-w-none text-gray-400 font-sans leading-relaxed">
                  <p>
                    <strong>Vahla MultiClaw</strong> is not just a skill directory; it is a hardened operating environment for autonomous AI agents. Unlike standard repositories (like PyPI or NPM), Vahla enforces a strict <strong>Security-First</strong> architecture.
                  </p>
                  <p>
                    Every module listed in our 1,700+ catalogue has undergone static analysis and sandboxing tests to ensure no unauthorized shell escalations occur during runtime.
                  </p>
                </div>
              </section>

              {/* 2. System Architecture */}
              <section id="architecture" className="scroll-mt-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-4 mb-6 flex items-center gap-3">
                  <span className="text-industrial">02.</span> System Architecture
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-[#0a0a0a] border border-gunmetal/30 rounded-lg">
                    <Server className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-white font-bold uppercase text-sm mb-2">The OpenClaw Kernel</h3>
                    <p className="text-xs text-gray-500 font-terminal">
                      The base runtime that executes JavaScript/Python skills in isolated processes. Handles I/O streams and memory allocation.
                    </p>
                  </div>
                  <div className="p-6 bg-[#0a0a0a] border border-gunmetal/30 rounded-lg">
                    <ShieldCheck className="w-8 h-8 text-amber mb-4" />
                    <h3 className="text-white font-bold uppercase text-sm mb-2">ClawSec Sentinel</h3>
                    <p className="text-xs text-gray-500 font-terminal">
                      A middleware layer that intercepts every prompt and command. If a skill tries to access <code>/etc/shadow</code> or external IPs without permission, ClawSec terminates the thread.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 border-l-4 border-industrial text-xs text-gray-300 font-mono">
                  User Prompt -&gt; [ClawSec Filter] -&gt; Agent Planning -&gt; [Skill Execution] -&gt; Output
                </div>
              </section>

              {/* 3. Installation */}
              <section id="installation" className="scroll-mt-6">
                 <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-4 mb-6 flex items-center gap-3">
                  <span className="text-industrial">03.</span> Installation & Setup
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2 uppercase">Option A: The Neural Foundry (GUI)</h3>
                    <p className="text-xs text-gray-400 mb-3">Recommended for most operators. Generates a secured <code>.bat</code> file automatically.</p>
                    <ol className="list-decimal list-inside text-xs text-gray-500 space-y-1 font-terminal">
                      <li>Navigate to <span className="text-white">Agent Templates</span> or <span className="text-white">Skill Market</span>.</li>
                      <li>Assemble your unit in the cart.</li>
                      <li>Click "Initialize Deployment".</li>
                      <li>Run the downloaded installer locally.</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white mb-2 uppercase">Option B: CLI Manual Injection</h3>
                    <div className="bg-black border border-gunmetal/50 p-4 rounded-md font-mono text-xs text-gray-300">
                      <p className="text-gray-500 mb-2"># Install Core</p>
                      <p className="mb-4"><span className="text-industrial">$</span> npm install -g @vahla/core</p>
                      
                      <p className="text-gray-500 mb-2"># Add Skill</p>
                      <p><span className="text-industrial">$</span> vahla add artifacts-builder --secure</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. ClawSec Protocols */}
              <section id="clawsec" className="scroll-mt-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-4 mb-6 flex items-center gap-3">
                  <span className="text-industrial">04.</span> ClawSec Protocols
                </h2>
                
                {/* ClawSec Highlight Banner */}
                <div className="mb-6 p-6 bg-gradient-to-r from-industrial/10 to-amber/10 border border-industrial/30 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-industrial to-amber"></div>
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="w-8 h-8 text-industrial flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">ClawSec Security Framework</h3>
                      <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                        Vahla's security is powered by <strong>ClawSec</strong>, an advanced security framework designed specifically for AI agent environments. Every interaction is monitored and protected against emerging threats.
                      </p>
                      <a 
                        href="https://github.com/prompt-security/clawsec" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-industrial hover:bg-industrial/80 text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all group"
                      >
                        <Code2 className="w-4 h-4" />
                        View ClawSec Repository
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">
                  ClawSec provides real-time protection against:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Prompt Injection Attacks",
                    "Unauthorized File System Access",
                    "Data Exfiltration (DLP)",
                    "Infinite Loop Resource Exhaustion"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-sm">
                      <Zap className="w-4 h-4 text-amber" />
                      <span className="text-xs font-bold text-gray-300 uppercase">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 5. Developer API */}
              <section id="api" className="scroll-mt-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-4 mb-6 flex items-center gap-3">
                  <span className="text-industrial">05.</span> Developer API
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Want to contribute a skill? Define your capabilities using the Vahla Manifest standard.
                </p>
                <div className="bg-[#111] p-6 rounded-lg border border-gunmetal/30 relative group">
                  <div className="absolute top-2 right-2 text-[10px] text-gray-600 font-bold uppercase">manifest.json</div>
                  <pre className="font-mono text-xs text-blue-300 overflow-x-auto">
{`{
  "name": "my-custom-skill",
  "version": "1.0.0",
  "permissions": [
    "filesystem.read",
    "network.http"
  ],
  "clawsec_compliance": "strict",
  "entry_point": "src/index.js"
}`}
                  </pre>
                </div>
              </section>

              {/* 6. Troubleshooting */}
              <section id="troubleshooting" className="scroll-mt-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-4 mb-6 flex items-center gap-3">
                  <span className="text-industrial">06.</span> Troubleshooting
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-sm">
                    <h4 className="text-xs font-bold text-red-400 uppercase mb-1">Error: "ClawSec Blocked Action"</h4>
                    <p className="text-[10px] text-gray-400 font-terminal">
                      This means your agent tried to access a restricted directory. Check your <code>manifest.json</code> permissions or lower the security level in <code>vahla.config.js</code>.
                    </p>
                  </div>
                  <div className="p-4 border border-gunmetal/30 bg-white/5 rounded-sm">
                    <h4 className="text-xs font-bold text-white uppercase mb-1">Error: "Hydration Mismatch"</h4>
                    <p className="text-[10px] text-gray-400 font-terminal">
                      Clear your browser cache or reinstall the dependencies using <code>npm ci</code>.
                    </p>
                  </div>
                </div>
              </section>

            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
// EOF
// app/dashboard/docs/page.tsx
"use client";

import { 
  Book, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="flex flex-col h-full bg-[#050505] text-white font-sans">
      
      {/* Header */}
      <div className="px-8 py-10 border-b border-gunmetal/20 bg-[url('/scanline.png')] bg-opacity-5">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <Book className="text-industrial w-8 h-8" />
          Security Protocols & Docs
        </h1>
        <p className="text-sm text-gray-500 font-terminal max-w-2xl">
          Comprehensive guide to Vahla MultiClaw architecture, OpenClaw integration, and the ClawSec hardening process.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">
          
          {/* Table of Contents (Sticky) */}
          <aside className="hidden lg:block space-y-6 sticky top-0">
            <div className="p-4 border border-gunmetal/30 bg-[#0a0a0a] rounded-sm">
              <h3 className="font-bold text-xs uppercase tracking-widest text-industrial mb-4">Table_of_Contents</h3>
              <ul className="space-y-3 text-xs font-terminal text-gray-400">
                <li className="hover:text-white cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-industrial" /> Getting Started
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" /> Architecture
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" /> Installation
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" /> ClawSec Integration
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" /> API Reference
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-industrial/5 border border-industrial/20 rounded-sm">
              <div className="flex items-center gap-2 mb-2 text-amber">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-bold text-xs uppercase">Security Notice</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                All modules in this repository are scanned daily against the Prompt-Security CVE database.
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <article className="space-y-12 pb-20">
            
            {/* Section: Getting Started */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-2">
                Getting Started
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Welcome to <strong className="text-white">Vahla MultiClaw</strong>, the hardened directory for OpenClaw AI agent skills. unlike standard repositories, Vahla focuses on high-agency security. This guide will help you discover, verify, and deploy secure skills to your local environment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                  <h3 className="font-bold text-sm text-industrial mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> OpenClaw Core
                  </h3>
                  <p className="text-xs text-gray-500">The base runtime for executing modular skills.</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                  <h3 className="font-bold text-sm text-amber mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> ClawSec Layer
                  </h3>
                  <p className="text-xs text-gray-500">The security wrapper that Vahla injects into every agent.</p>
                </div>
              </div>
            </section>

            {/* Section: Installation */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-2">
                Installation Methods
              </h2>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Method A: The Neural Foundry (Recommended)</h3>
                <p className="text-gray-400 text-sm">
                  Use our GUI to build an agent and download a pre-configured <code>.bat</code> installer. This handles dependency resolution and security injection automatically.
                </p>
                <div className="bg-black border border-gunmetal/50 p-4 font-mono text-xs text-gray-300 rounded-sm">
                  1. Go to <span className="text-industrial">Neural Foundry</span>.<br/>
                  2. Select your desired skills.<br/>
                  3. Click <span className="text-industrial">DEPLOY AGENT</span>.<br/>
                  4. Run the downloaded <span className="text-amber">installer.bat</span> file.
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Method B: Manual CLI</h3>
                <p className="text-gray-400 text-sm">
                  If you prefer manual control, ensure you have Node.js (v18+) installed.
                </p>
                
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">1. Install a Skill</span>
                  <div className="bg-black border-l-2 border-industrial p-3 font-mono text-xs text-gray-300">
                    <span className="text-industrial select-none">$</span> npx clawhub@latest install &lt;skill-name&gt;
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">2. Inject Security (Vital)</span>
                  <div className="bg-black border-l-2 border-amber p-3 font-mono text-xs text-gray-300">
                    <span className="text-amber select-none">$</span> npx clawsec install
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Basic Usage */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-2">
                Basic Usage
              </h2>
              <p className="text-gray-400 text-sm">
                Once installed, skills are automatically loaded into the OpenClaw runtime.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Listing Installed Skills</h4>
                <div className="bg-black p-3 rounded-sm border border-white/10 font-mono text-xs text-gray-400">
                  <span className="text-green-500">$</span> npx clawhub@latest list
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Updating Security Definitions</h4>
                <div className="bg-black p-3 rounded-sm border border-white/10 font-mono text-xs text-gray-400">
                  <span className="text-green-500">$</span> npx clawsec update-defs
                </div>
              </div>
            </section>

            {/* Section: Configuration */}
            <section className="space-y-4">
               <h2 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-gunmetal/30 pb-2">
                Configuration
              </h2>
              <p className="text-gray-400 text-sm">
                Create a <code>clawhub.config.json</code> in your project root to customize the registry source.
              </p>
              <div className="bg-[#111] p-4 rounded-sm border border-gunmetal/30 font-mono text-xs text-blue-300 overflow-x-auto">
                <pre>{`{
  "skillsDir": "./skills",
  "autoUpdate": true,
  "registry": "https://registry.vahla.dev",
  "securityLevel": "strict"
}`}</pre>
              </div>
            </section>

          </article>
        </div>
      </div>
    </div>
  );
}
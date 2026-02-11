// components/DownloadSection.tsx
"use client";

import { useState } from "react";
import { Skill } from "@/types";

interface Props {
  selectedSkills: Skill[];
}

export default function DownloadSection({ selectedSkills }: Props) {
  const [agentName, setAgentName] = useState("");
  const [soulGuardian, setSoulGuardian] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const generateAndDownloadBat = () => {
    const name = agentName || "VAHLA_UNIT_X";
    
    // Script .bat untuk otomatisasi instalasi di laptop user
    let scriptContent = `@echo off
TITLE VAHLA AGENT FOUNDRY // ${name}
color 0E
echo ============================================================
echo   VAHLA_AGENT_INSTALLER // SECTOR: AUBURN-01
echo ============================================================
echo [STATUS] INITIALIZING DEPENDENCY RESOLUTION...
echo.

:: 1. INSTALL USER SKILLS
`;

    selectedSkills.forEach((s) => {
      scriptContent += `echo [PROCESS] INSTALLING: ${s.name}...
call ${s.install_command}
`;
    });

    scriptContent += `
:: 2. INJECT CLAWSEC SECURITY (MANDATORY)
echo.
echo [SECURE] INJECTING CLAWSEC PROTOCOLS...
echo [PROCESS] INSTALLING: clawsec-feed...
call npx clawhub@latest install clawsec-feed
echo [PROCESS] INSTALLING: audit-watchdog...
call npx clawhub@latest install openclaw-audit-watchdog
`;

    if (soulGuardian) {
      scriptContent += `echo [PROCESS] INSTALLING: soul-guardian...
call npx clawhub@latest install soul-guardian
`;
    }

    scriptContent += `
echo.
echo ============================================================
echo [SUCCESS] AGENT "${name}" IS READY AND SECURED.
echo [INFO] YOU CAN NOW RUN YOUR AGENT LOCALLY.
echo ============================================================
echo.
pause`;

    // Trigger Download .bat
    const blob = new Blob([scriptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.replace(/\s+/g, "-").toLowerCase()}_installer.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Tampilkan petunjuk selanjutnya
    setShowModal(true);
  };

  return (
    <>
      {/* Download Bar: Industrial Design */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t-4 border-industrial z-40 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Status Panel */}
          <div className="flex items-center gap-4 bg-matte p-3 border border-gunmetal">
            <div className="text-center px-4 border-r border-gunmetal">
              <span className="block text-[10px] text-gunmetal uppercase font-terminal">Selected_Skills</span>
              <span className="text-2xl font-bold text-industrial font-terminal">{selectedSkills.length.toString().padStart(2, '0')}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
                <span className="text-[10px] text-amber uppercase font-terminal tracking-widest">Security_Injection: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-[10px] text-gray-500 uppercase font-terminal tracking-widest">ClawSec_Watchdog: Attached</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-1 w-full max-w-2xl items-center gap-4">
            <div className="flex-1 relative">
              <span className="absolute -top-2 left-2 bg-black px-1 text-[8px] text-gunmetal font-terminal uppercase">Agent_Designation</span>
              <input 
                type="text" 
                placeholder="ENTER_NAME_..." 
                className="w-full bg-transparent border border-gunmetal p-3 font-terminal text-industrial focus:border-industrial outline-none"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>

            <div 
              onClick={() => setSoulGuardian(!soulGuardian)}
              className={`cursor-pointer border-2 p-2 flex items-center gap-3 transition-all ${soulGuardian ? 'border-amber bg-amber/10' : 'border-gunmetal opacity-50'}`}
            >
              <div className={`w-4 h-4 border-2 ${soulGuardian ? 'bg-amber border-black' : 'border-gunmetal'}`} />
              <div className="leading-tight">
                <span className="block text-[10px] font-bold uppercase">Soul_Guardian</span>
                <span className="block text-[8px] text-gunmetal uppercase font-terminal">Enhanced_Integrity</span>
              </div>
            </div>
          </div>

          {/* Final Action */}
          <button
            onClick={generateAndDownloadBat}
            disabled={selectedSkills.length === 0}
            className="w-full lg:w-64 py-4 bg-industrial hover:bg-amber text-black font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-20 disabled:cursor-not-allowed group relative"
          >
            <span className="relative z-10 font-bold text-lg">`{'>'}``{'>'}``{'>'}`  Build_Agent</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
        </div>
      </div>

      {/* Instruction Modal: The "Guide" to run locally */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="max-w-xl w-full border-2 border-industrial bg-matte p-8 relative">
                <div className="absolute -top-4 -right-4 bg-industrial text-black p-1 cursor-pointer font-bold hover:bg-amber" onClick={() => setShowModal(false)}>
                    [ CLOSE_X ]
                </div>
                
                <h2 className="text-2xl font-bold mb-6 text-industrial uppercase tracking-tighter">
                  Blueprint Exported Successfully
                </h2>

                <div className="space-y-6 font-terminal">
                    <p className="text-sm text-gray-400">
                        Your AI Agent has been packaged into a <span className="text-industrial">.bat</span> file. Follow these steps to install it locally on your computer:
                    </p>

                    <div className="bg-black p-4 border border-gunmetal space-y-3">
                        <div className="flex gap-3">
                            <span className="text-amber">01_</span>
                            <p className="text-sm">Open the <span className="text-industrial">Downloads</span> folder on your computer.</p>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-amber">02_</span>
                            <p className="text-sm">Right-click the <span className="text-industrial">installer.bat</span> file and select <span className="text-white">"Run as administrator"</span>.</p>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-amber">03_</span>
                            <p className="text-sm">Wait for the terminal to complete the automatic installation of skills and ClawSec.</p>
                        </div>
                    </div>

                    <div className="p-3 bg-amber/10 border border-amber/30 text-amber text-[10px] uppercase leading-relaxed">
                        IMPORTANT: Ensure you have installed "OpenClaw" globally before running this script.
                    </div>

                    <button 
                        onClick={() => setShowModal(false)}
                        className="w-full py-3 bg-industrial text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
                    >
                        Acknowledge_&_Proceed
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}
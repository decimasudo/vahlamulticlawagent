// components/TestDriveModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Skill } from "@/types";
import { X, Terminal as TerminalIcon, Send, Sparkles, ShieldAlert, Cpu } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
}

export default function TestDriveModal({ isOpen, onClose, skill }: Props) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle pengiriman pesan ke API Test Drive
  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/test-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          skillName: skill.name,
          skillDesc: skill.description,
        }),
      });

      if (!res.ok) throw new Error("NETWORK_RESPONSE_NOT_OK");

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "**CRITICAL_ERROR**: Neural Uplink Interrupted. Security protocols may have blocked the transmission.",
        },
      ]);
    } finally {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Reset chat saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultCommands = ["SIMULATE_RUN", "SHOW_CAPABILITIES", "SECURITY_AUDIT"];
  const actionButtons = skill.suggested_commands || defaultCommands;

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-5xl h-[85vh] border-2 border-industrial bg-[#050505] flex flex-col relative shadow-[0_0_100px_rgba(255,204,0,0.15)] overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black opacity-[0.02] select-none pointer-events-none tracking-tighter uppercase">
          Simulation
        </div>

        {/* Modal Header */}
        <div className="bg-industrial p-4 flex justify-between items-center shrink-0 z-20 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-black animate-pulse shadow-[0_0_8px_rgba(0,0,0,1)]" />
            <h2 className="font-terminal text-black font-black text-sm tracking-[0.2em] uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Tactical_Simulation // {skill.name}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-black hover:bg-black hover:text-industrial p-1 transition-all border border-transparent hover:border-black"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Terminal Content Area */}
        <div 
          ref={scrollRef} 
          className="flex-grow overflow-y-auto p-6 md:p-12 space-y-8 font-terminal text-sm md:text-base scrollbar-none"
        >
          {/* Initial System Message */}
          <div className="p-6 border-l-4 border-industrial bg-industrial/5 mb-10 relative animate-in fade-in duration-700">
            <div className="absolute top-0 right-0 p-1 text-[7px] bg-industrial text-black font-bold uppercase">Auth_Verified</div>
            <p className="mb-2 font-bold uppercase flex items-center gap-2 text-industrial text-xs tracking-widest">
              <Sparkles className="w-4 h-4" /> [SYSTEM_INITIALIZATION]
            </p>
            <p className="text-xs text-gunmetal leading-relaxed uppercase">
              Establishing sandbox environment for module: <span className="text-white underline">{skill.name}</span>. <br />
              Auburn-01 AI Core is active. All interactions are monitored by ClawSec protocols.
            </p>
          </div>
          
          {/* Chat Messages */}
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`max-w-[90%] p-6 border relative transition-all ${
                m.role === 'user' 
                ? 'border-gunmetal bg-black/40 text-gray-300' 
                : 'border-industrial/20 bg-[#080808] text-gray-200 shadow-[20px_20px_60px_rgba(0,0,0,0.8)]'
              }`}>
                {/* Message Label */}
                <div className={`flex items-center gap-2 mb-4 text-[9px] font-bold uppercase tracking-[0.3em] ${
                  m.role === 'user' ? 'text-gunmetal' : 'text-amber'
                }`}>
                  {m.role === 'user' ? '>> OPERATOR_INPUT' : ':: DECODED_OUTPUT'}
                </div>
                
                {/* PARSED CONTENT WITH REACT-MARKDOWN */}
                <div className="prose prose-invert max-w-none font-terminal leading-relaxed">
                  <ReactMarkdown
                    components={{
                      // Custom Bold (Strong)
                      strong: ({ ...props }) => (
                        <strong className="text-industrial font-black uppercase tracking-tighter" {...props} />
                      ),
                      // Custom Unordered List
                      ul: ({ ...props }) => (
                        <ul className="space-y-4 my-6 list-none p-0" {...props} />
                      ),
                      // Custom List Item (Modular Design)
                      li: ({ ...props }) => (
                        <li className="flex items-start gap-4 bg-white/[0.03] p-4 border-l-2 border-industrial/30 hover:bg-white/[0.07] transition-colors group">
                          <span className="text-industrial mt-1 group-hover:scale-125 transition-transform">▶</span>
                          <span className="text-gray-300" {...props} />
                        </li>
                      ),
                      // Paragraph spacing
                      p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                      // Inline Code
                      code: ({ ...props }) => (
                        <code className="bg-black text-amber px-2 py-0.5 border border-amber/20 rounded font-mono text-xs" {...props} />
                      )
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>

                {/* Corner Accents for Assistant */}
                {m.role !== 'user' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-industrial" />
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="p-4 border border-industrial/10 bg-industrial/5 text-industrial animate-pulse font-terminal text-xs">
                [ DECODING_NEURAL_STREAM_IN_PROGRESS... ]
              </div>
            </div>
          )}
        </div>

        {/* Input & Command Center */}
        <div className="p-8 border-t-2 border-industrial/10 bg-black/95 space-y-6 shrink-0 z-20">
          
          {/* Dynamic Suggested Commands */}
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-gunmetal font-terminal uppercase flex items-center gap-2 mr-2">
              <ShieldAlert className="w-3 h-3" /> Quick_Ops:
            </span>
            {actionButtons.map((cmd) => (
              <button 
                key={cmd}
                onClick={() => handleSend(cmd)}
                disabled={isLoading}
                className="text-[9px] font-bold border border-gunmetal/40 px-3 py-1.5 text-gunmetal hover:border-industrial hover:text-industrial transition-all uppercase tracking-tighter bg-black hover:bg-industrial/5 disabled:opacity-20 group"
              >
                <span className="group-hover:mr-1 transition-all inline-block">{`[`}</span>
                {cmd}
                <span className="group-hover:ml-1 transition-all inline-block">{`]`}</span>
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="flex gap-4 items-center bg-[#080808] p-1 border border-gunmetal/50 focus-within:border-industrial transition-all group shadow-2xl">
            <span className="pl-4 text-industrial font-bold text-xl select-none group-focus-within:animate-pulse">$</span>
            <input 
              className="flex-grow bg-transparent p-4 font-terminal text-industrial outline-none placeholder:text-gunmetal/20 text-sm"
              placeholder={`CMD_QUERY_${skill.name.toUpperCase().replace(/-/g, '_')}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              className="p-4 bg-industrial text-black hover:bg-white transition-all disabled:opacity-30 disabled:grayscale"
              disabled={isLoading || !input.trim()}
              title="Execute Command"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Footer Security Note */}
          <div className="flex justify-between items-center text-[8px] font-terminal text-gunmetal uppercase tracking-[0.2em] opacity-30">
             <span>Simulation_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
             <span>Status: Enforced_by_ClawSec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// EOF
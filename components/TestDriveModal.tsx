// components/TestDriveModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Skill } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
}

export default function TestDriveModal({ isOpen, onClose, skill }: Props) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/test-drive", {
        method: "POST",
        body: JSON.stringify({ 
          messages: newMessages, 
          skillName: skill.name, 
          skillDesc: skill.description 
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, data]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "CRITICAL_ERROR: Connection to Neural Link severed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] border-2 border-industrial bg-[#0a0a0a] flex flex-col relative shadow-[0_0_100px_rgba(255,204,0,0.1)]">
        
        {/* Header */}
        <div className="bg-industrial p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-black animate-pulse" />
            <span className="font-terminal text-black font-bold text-xs tracking-widest uppercase">
              SIMULATION_ENVIRONMENT // {skill.name}
            </span>
          </div>
          <button onClick={onClose} className="text-black font-bold hover:scale-110"> [ SHUTDOWN_X ] </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 font-terminal text-sm scrollbar-thin scrollbar-thumb-gunmetal">
          <div className="text-gunmetal italic border-b border-gunmetal/20 pb-2">
            [SYS] Initializing virtual environment for ${skill.name}... <br />
            [SYS] Core Auburn-01 online. Awaiting command.
          </div>
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'text-industrial' : 'text-amber'}`}>
              <span className="shrink-0">{m.role === 'user' ? '>>' : '::'}</span>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}

          {isLoading && <div className="text-industrial animate-pulse">:: ANALYZING_DATA...</div>}
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gunmetal/30 space-y-4">
          <div className="flex gap-2">
            {["RUN_DIAGNOSTIC", "GENERATE_SAMPLE", "HELP"].map(cmd => (
              <button 
                key={cmd}
                onClick={() => handleSend(cmd)}
                className="text-[10px] border border-gunmetal px-2 py-1 text-gunmetal hover:border-industrial hover:text-industrial transition-all"
              >
                [{cmd}]
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <span className="text-industrial font-bold py-3">$</span>
            <input 
              className="flex-grow bg-transparent border-b border-gunmetal focus:border-industrial outline-none py-2 text-industrial font-terminal"
              placeholder="ENTER_SIMULATION_COMMAND..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
// EOF
// context/BuilderContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Skill } from "@/types";
import { toast } from "sonner";

interface BuilderContextType {
  draftSkills: Skill[];
  agentName: string;
  setAgentName: (name: string) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (id: number) => void;
  loadBlueprint: (skills: Skill[], name: string) => void;
  clearCart: () => void;
  isHydrated: boolean; // Mencegah error hydration SSR
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [draftSkills, setDraftSkills] = useState<Skill[]>([]);
  const [agentName, setAgentName] = useState<string>("Custom Unit");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load dari localStorage saat pertama kali aplikasi dibuka
  useEffect(() => {
    const savedSkills = localStorage.getItem("vahla_draft_skills");
    const savedName = localStorage.getItem("vahla_agent_name");
    
    if (savedSkills) setDraftSkills(JSON.parse(savedSkills));
    if (savedName) setAgentName(savedName);
    
    setIsHydrated(true);
  }, []);

  // Simpan ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("vahla_draft_skills", JSON.stringify(draftSkills));
      localStorage.setItem("vahla_agent_name", agentName);
    }
  }, [draftSkills, agentName, isHydrated]);

  const addSkill = (skill: Skill) => {
    if (!draftSkills.find((s) => s.id === skill.id)) {
      setDraftSkills((prev) => [...prev, skill]);
      toast.success(`MODULE INJECTED: ${skill.name}`);
    }
  };

  const removeSkill = (id: number) => {
    setDraftSkills((prev) => prev.filter((s) => s.id !== id));
    toast.error("MODULE EJECTED");
  };

  // Fungsi untuk fitur "Deploy Template" dari halaman Agents
  const loadBlueprint = (skills: Skill[], name: string) => {
    setDraftSkills(skills);
    setAgentName(name);
    toast.success(`BLUEPRINT [${name}] LOADED TO ASSEMBLY LINE`);
  };

  const clearCart = () => {
    setDraftSkills([]);
    setAgentName("Custom Unit");
  };

  return (
    <BuilderContext.Provider
      value={{ draftSkills, agentName, setAgentName, addSkill, removeSkill, loadBlueprint, clearCart, isHydrated }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
// EOF
// components/DownloadSection.tsx
"use client";

import { useRouter } from "next/navigation";
import { Skill } from "@/types";

interface Props {
  selectedSkills: Skill[];
}

export default function DownloadSection({ selectedSkills }: Props) {
  const router = useRouter();

  const handleProceedToBuilder = () => {
    // Simpan skill pilihan ke localStorage agar bisa diakses di page /builder
    localStorage.setItem("vahla_draft_skills", JSON.stringify(selectedSkills));
    router.push("/builder");
  };

  if (selectedSkills.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-4 border-industrial z-40 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-industrial text-black px-4 py-2 font-black">
            {selectedSkills.length.toString().padStart(2, '0')} MODULES_SELECTED
          </div>
          <p className="hidden md:block text-[10px] font-terminal text-gunmetal uppercase tracking-widest">
            Ready for neural assembly in the Foundry.
          </p>
        </div>

        <button
          onClick={handleProceedToBuilder}
          className="bg-industrial hover:bg-white text-black font-bold px-8 py-3 uppercase tracking-widest transition-all flex items-center gap-3 group"
        >
          <span>`{'>'}``{'>'}`  Open_Neural_Foundry</span>
          <div className="w-2 h-2 bg-black group-hover:animate-ping" />
        </button>
      </div>
    </div>
  );
}
// components/Pagination.tsx
"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-20 font-terminal">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gunmetal bg-black hover:border-industrial disabled:opacity-30 disabled:hover:border-gunmetal transition-all text-xs"
      >
        {"<< PREV_SEGMENT"}
      </button>

      <div className="flex items-center gap-1 px-4 py-2 bg-matte border border-gunmetal">
        <span className="text-industrial font-bold">{currentPage.toString().padStart(2, '0')}</span>
        <span className="text-gunmetal">/</span>
        <span className="text-gunmetal">{totalPages.toString().padStart(2, '0')}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gunmetal bg-black hover:border-industrial disabled:opacity-30 disabled:hover:border-gunmetal transition-all text-xs"
      >
        {"NEXT_SEGMENT >>"}
      </button>
    </div>
  );
}
// EOF
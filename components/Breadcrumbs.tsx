import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  program: string | null;
  level: string | null;
}

export function Breadcrumbs({ program, level }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
      <span>Curriculum</span>
      {program && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-300">{program.replace(/B2C_|B2B_|B2S_/g, "").replace(/_/g, " ")}</span>
        </>
      )}
      {level && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium">{level}</span>
        </>
      )}
    </div>
  );
}

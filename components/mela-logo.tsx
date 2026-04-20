import { cn } from "@/lib/utils";

interface MelaLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  subtle?: boolean;
}

export function MelaLogo({ className, markClassName, textClassName, subtle = false }: MelaLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[-0.04em]",
          subtle ? "border-current/20 text-current/52" : "border-current/30 text-current/72",
          markClassName
        )}
        aria-hidden="true"
      >
        M
      </span>
      <span
        className={cn(
          "text-[11px] uppercase tracking-[0.26em]",
          subtle ? "text-current/45" : "text-current/70",
          textClassName
        )}
      >
        Mela
      </span>
    </div>
  );
}

import type { ReactNode } from "react";
import { ArrowDownRight } from "lucide-react";
import { Reveal, SplitWords } from "../motion";
import { cn } from "@/lib/utils";

/** Editorial section header: hairline rule with label, giant headline, side copy. */
export default function SectionHead({
  eyebrow,
  title,
  italic,
  text,
  action,
  className,
  dark,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  text?: string;
  action?: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={className}>
      <Reveal y={12}>
        <div className={cn("flex items-center justify-between border-t pt-4 text-[13px] font-medium", dark ? "border-white/15 text-white/70" : "border-ink/15 text-ink/70")}>
          <span className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-accent" />
            {eyebrow}
          </span>
          <ArrowDownRight className="size-4 opacity-60" />
        </div>
      </Reveal>
      <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
        <h2 className={cn("display text-[2.7rem] md:text-[4.9rem]", text || action ? "md:col-span-8" : "md:col-span-12")}>
          <SplitWords text={title} />
          {italic && (
            <>
              {" "}
              <SplitWords text={italic} wordClassName="thin-word text-accent" delay={0.12} />
            </>
          )}
        </h2>
        {(text || action) && (
          <div className="flex flex-col items-start gap-6 md:col-span-4 md:pb-3">
            {text && (
              <Reveal delay={0.1}>
                <p className={cn("text-[16px] leading-relaxed", dark ? "text-white/60" : "text-muted")}>{text}</p>
              </Reveal>
            )}
            {action && <Reveal delay={0.15}>{action}</Reveal>}
          </div>
        )}
      </div>
    </div>
  );
}

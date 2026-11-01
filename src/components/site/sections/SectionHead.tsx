import type { ReactNode } from "react";
import { Reveal, SplitWords } from "../motion";
import { cn } from "@/lib/utils";

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
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <Reveal>
          <p className={cn("eyebrow flex items-center gap-3", dark && "!text-white/50")}>
            <span className={cn("h-px w-10", dark ? "bg-white/30" : "bg-ink/30")} />
            {eyebrow}
          </p>
        </Reveal>
        <h2 className="display mt-5 text-[2.6rem] md:text-[4.6rem]">
          <SplitWords text={title} />
          {italic && (
            <>
              {" "}
              <SplitWords text={italic} wordClassName="serif-i text-accent" delay={0.12} />
            </>
          )}
        </h2>
        {text && (
          <Reveal delay={0.1}>
            <p className={cn("mt-5 max-w-xl text-[17px] leading-relaxed", dark ? "text-white/60" : "text-muted")}>{text}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.15}>{action}</Reveal>}
    </div>
  );
}

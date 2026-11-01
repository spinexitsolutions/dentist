import type { ReactNode } from "react";
import { Reveal, SplitWords } from "../motion";
import { Pill, SmileLine } from "../Orbit";
import { cn } from "@/lib/utils";

/** Orbit-style section header: pill label, headline with a drawn smile under the light word. */
export default function SectionHead({
  eyebrow,
  title,
  italic,
  text,
  action,
  className,
  dark,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  text?: string;
  action?: ReactNode;
  className?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={cn("flex flex-col", center ? "mx-auto max-w-3xl items-center text-center" : "items-start text-left", className)}>
      <Reveal y={12}>
        <Pill dark={dark}>{eyebrow}</Pill>
      </Reveal>
      <h2 className="display mt-6 text-[2.7rem] md:text-[4.6rem]">
        <SplitWords text={title} />
        {italic && (
          <>
            {" "}
            <SmileLine delay={0.6}>
              <SplitWords text={italic} wordClassName="thin-word text-accent" delay={0.12} />
            </SmileLine>
          </>
        )}
      </h2>
      {text && (
        <Reveal delay={0.1}>
          <p className={cn("mt-6 max-w-xl text-[16.5px] leading-relaxed", dark ? "text-white/60" : "text-ink/60")}>{text}</p>
        </Reveal>
      )}
      {action && (
        <Reveal delay={0.15} className="mt-7">
          {action}
        </Reveal>
      )}
    </div>
  );
}

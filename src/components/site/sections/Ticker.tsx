import type { Service } from "@/lib/types";
import { TOOTH_PATH } from "../icons";

export default function Ticker({ services }: { services: Service[] }) {
  return (
    <div className="relative overflow-hidden bg-ink py-5 text-paper">
      <div className="flex [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10" style={{ ["--marquee-speed" as string]: "45s" }}>
          {[...services, ...services].map((s, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap text-2xl md:text-4xl">
              <span className={i % 2 ? "thin-word text-paper/60" : "display"}>{s.title}</span>
              <svg viewBox="0 0 100 100" className="size-5 fill-pop">
                <path d={TOOTH_PATH} />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
/* eslint-disable react-hooks/refs -- rect is read inside motion-value transformers, not for rendering */

import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Settings, Testimonial } from "@/lib/types";
import { EASE, Magnetic, SplitWords, useIntroDone } from "../motion";
import { ToothMark } from "../icons";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * "Capsule" hero: a pill-shaped photo sits inside the headline like a word.
 * As you scroll, the pill grows into a full-screen window into the studio.
 */
export default function Hero({ hero, avatars, serviceTitles }: { hero: Settings["hero"]; avatars: Testimonial[]; serviceTitles: string[] }) {
  const play = useIntroDone();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const rect = useRef({ x: 0, y: 0, w: 0, h: 0, W: 1, H: 1 });
  const tick = useMotionValue(0);

  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  // measure the placeholder slot inside the headline (offsets ignore transforms)
  useEffect(() => {
    const measure = () => {
      const s = slot.current;
      const st = stage.current;
      if (!s || !st) return;
      let x = 0;
      let y = 0;
      let el: HTMLElement | null = s;
      while (el && el !== st) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      rect.current = { x, y, w: s.offsetWidth, h: s.offsetHeight, W: st.clientWidth, H: st.clientHeight };
      tick.set(tick.get() + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    if (slot.current) ro.observe(slot.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [tick]);

  const pick = (i: number) => ([v]: number[]) => {
    const r = rect.current;
    const k = ease(clamp(v / 0.55));
    return [lerp(r.x, 0, k), lerp(r.y, 0, k), lerp(r.w, r.W, k), lerp(r.h, r.H, k), lerp(r.h / 2, 0, k)][i];
  };
  const left = useTransform([p, tick], pick(0));
  const top = useTransform([p, tick], pick(1));
  const width = useTransform([p, tick], pick(2));
  const height = useTransform([p, tick], pick(3));
  const radius = useTransform([p, tick], pick(4));

  const stickerX = useTransform([p, tick], () => rect.current.x + rect.current.w - 34);
  const stickerY = useTransform([p, tick], () => rect.current.y - 46);

  const uiOpacity = useTransform(p, [0, 0.22], [1, 0]);
  const uiY = useTransform(p, [0, 0.3], [0, -90]);
  const line2Y = useTransform(p, [0, 0.3], [0, 60]);
  const portraitScale = useTransform(p, [0, 0.55], [1.12, 1]);
  const wideOpacity = useTransform(p, [0.28, 0.52], [0, 1]);
  const wideScale = useTransform(p, [0.28, 1], [1.25, 1]);
  const shade = useTransform(p, [0.45, 0.8], [0, 0.55]);
  const capOpacity = useTransform(p, [0.6, 0.78], [0, 1]);
  const capY = useTransform(p, [0.6, 0.85], [50, 0]);
  const hint = useTransform(p, [0, 0.08], [1, 0]);

  // subtle pointer depth on desktop
  const mx = useSpring(0, { stiffness: 60, damping: 20 });
  const l1x = useTransform(mx, (v) => v * -14);
  const l2x = useTransform(mx, (v) => v * 14);

  const caption = hero.caption || "Step inside the calmest dental studio in the city.";
  const capWords = caption.split(" ");

  return (
    <>
      <section ref={section} className="relative h-[260vh]">
        <div
          ref={stage}
          className="sticky top-0 h-dvh overflow-hidden"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            mx.set((e.clientX / window.innerWidth - 0.5) * 2);
          }}
        >
          {/* backdrop: soft accent glow + fine grid */}
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-60" />
          <div className="pointer-events-none absolute -bottom-1/3 left-1/2 size-[70vmax] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

          <motion.div style={{ opacity: uiOpacity }} className="container-x relative flex h-full flex-col justify-center gap-7 pb-28 pt-6 md:justify-between md:gap-0 md:pb-20 md:pt-24">
            {/* top meta row */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={play ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              className="flex items-center justify-between text-[13px] text-muted"
            >
              <span className="flex items-center gap-2.5">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                  <span className="relative size-2 rounded-full bg-accent" />
                </span>
                {hero.eyebrow}
              </span>
              <motion.span style={{ opacity: hint }} className="hidden items-center gap-3 md:flex">
                Scroll to step inside
                <span className="relative h-8 w-px overflow-hidden bg-ink/15">
                  <motion.span className="absolute inset-x-0 top-0 h-3 bg-ink" animate={{ y: [-12, 32] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
                </span>
              </motion.span>
            </motion.div>

            {/* headline with the capsule slot */}
            <h1 className="display relative text-[21vw] leading-[0.86] md:text-[13.2vw] xl:text-[12.4rem]">
              <motion.span style={{ y: uiY, x: l1x }} className="flex items-center whitespace-nowrap">
                <SplitWords text={hero.title} play={play} delay={0.05} />
                <span ref={slot} className="ml-[0.12em] inline-block h-[0.74em] w-[1.55em] shrink-0 rounded-full" aria-hidden />
              </motion.span>
              <motion.span style={{ y: line2Y, x: l2x }} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <SplitWords text={hero.highlight} play={play} delay={0.2} wordClassName="thin-word text-accent" />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={play ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 1, ease: EASE, delay: 0.55 }}
                  className="max-w-[17rem] pb-[0.12em] font-sans text-[15px] font-medium leading-snug tracking-normal text-ink md:text-[17px]"
                >
                  <span className="mb-3 block h-px w-10 bg-ink" />
                  {hero.titleEnd}
                </motion.span>
              </motion.span>
            </h1>

            {/* bottom row */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={play ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 0.7 }}
              className="grid items-end gap-6 md:grid-cols-12"
            >
              <div className="md:col-span-6 lg:col-span-5">
                <p className="hidden max-w-md text-[16px] leading-relaxed text-muted md:block">{hero.subtitle}</p>
                <div className="flex flex-wrap items-center gap-2 md:mt-6">
                  <Magnetic>
                    <Link href="/book" className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white">
                      <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                      <span className="relative">{hero.ctaPrimary}</span>
                      <span className="relative grid size-10 place-items-center rounded-full bg-pop text-ink transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </Link>
                  </Magnetic>
                  <Link href="/services" className="rounded-full px-5 py-4 text-[15px] font-medium ring-1 ring-ink/15 transition hover:bg-ink hover:text-white">
                    {hero.ctaSecondary}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-6 md:justify-end lg:col-span-7">
                <div className="flex items-center gap-3 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 ring-1 ring-line backdrop-blur">
                  <div className="flex -space-x-2.5">
                    {avatars.slice(0, 3).map((a) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={a.id} src={a.avatar} alt="" className="size-9 rounded-full border-2 border-white object-cover" />
                    ))}
                  </div>
                  <div className="text-[13px] leading-tight">
                    <span className="flex items-center gap-1 font-semibold">
                      <Star className="size-3.5 fill-current text-ink" /> {hero.rating}
                    </span>
                    <span className="text-muted">{hero.reviews}</span>
                  </div>
                </div>
                <div className="hidden items-center gap-3 rounded-full bg-ink py-1.5 pl-4 pr-1.5 text-white sm:flex">
                  <span className="text-[13px] leading-tight">
                    <span className="block text-white/50">Next available</span>
                    Today · 4:30 PM
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-pop text-ink">
                    <ArrowDown className="size-4 -rotate-90" />
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* the capsule — lives above the text, grows to fill the viewport */}
          <motion.div style={{ left, top, width, height, borderRadius: radius }} className="pointer-events-none absolute z-10 overflow-hidden will-change-[width,height]">
            <motion.div
              className="absolute inset-0 overflow-hidden bg-accent"
              style={{ borderRadius: "inherit" }}
              initial={{ clipPath: "inset(0 50% 0 50% round 999px)" }}
              animate={play ? { clipPath: "inset(0 0% 0 0% round 0px)" } : undefined}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
            >
              <motion.img src={hero.image} alt="Smiling patient" style={{ scale: portraitScale }} className="absolute inset-0 size-full object-cover object-[50%_30%]" />
              <motion.img src={hero.wideImage} alt="Inside the studio" style={{ opacity: wideOpacity, scale: wideScale }} className="absolute inset-0 size-full object-cover" />
              <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
            </motion.div>
          </motion.div>

          {/* lime sticker riding on the capsule */}
          <motion.div style={{ x: stickerX, y: stickerY, opacity: uiOpacity }} className="absolute left-0 top-0 z-20">
            <Link href="/book" aria-label="Book a free 3D scan" className="pointer-events-auto relative grid size-[76px] place-items-center md:size-24">
              <motion.div initial={{ scale: 0, rotate: -120 }} animate={play ? { scale: 1, rotate: 0 } : undefined} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.1 }} className="absolute inset-0">
                <motion.svg viewBox="0 0 100 100" className="size-full" animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}>
                  <defs>
                    <path id="hero-circ" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1 -74 0" />
                  </defs>
                  <circle cx="50" cy="50" r="49" fill="var(--pop)" />
                  <text fontSize="10" fontWeight="600" letterSpacing="1.6" fill="var(--ink)" fontFamily="var(--font-onest)">
                    <textPath href="#hero-circ">FREE 3D SCAN • BOOK TODAY • </textPath>
                  </text>
                </motion.svg>
              </motion.div>
              <ToothMark className="relative size-6 text-ink md:size-7" />
            </Link>
          </motion.div>

          {/* caption once the capsule fills the screen */}
          <motion.div style={{ opacity: capOpacity, y: capY }} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-28 text-white md:pb-16">
            <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="display max-w-4xl text-[2.6rem] md:text-[5.2rem]">
                {capWords.map((w, i) => (
                  <span key={i} className={i % 3 === 2 ? "thin-word" : undefined}>
                    {w}{" "}
                  </span>
                ))}
              </p>
              <div className="flex shrink-0 gap-2 text-sm">
                {["Private suites", "Laser care", "3D scans"].map((t) => (
                  <span key={t} className="rounded-full bg-white/10 px-3.5 py-2 backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* treatment ticker */}
      <div className="relative overflow-hidden bg-ink py-5 text-white">
        <div className="flex [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10" style={{ ["--marquee-speed" as string]: "45s" }}>
            {[...serviceTitles, ...serviceTitles].map((t, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap font-[family-name:var(--font-bricolage)] text-2xl font-semibold tracking-[-0.03em] md:text-4xl">
                <span className={i % 2 ? "thin-word text-white/60" : ""}>{t}</span>
                <span className="size-2.5 rounded-full bg-pop" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 });
    const w = window as unknown as { __lenis?: Lenis; __introDone?: boolean };
    w.__lenis = lenis;
    if (document.querySelector("[data-intro]") && !w.__introDone && document.documentElement.dataset.introSeen !== "1") lenis.stop();
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      w.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    const w = window as unknown as { __lenis?: Lenis };
    if (!window.location.hash) {
      w.__lenis?.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}

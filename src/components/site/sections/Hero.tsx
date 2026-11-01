"use client";

import type { HeroProps, HeroVariant } from "../heroes/types";
import HeroArch from "../heroes/HeroArch";
import HeroBento from "../heroes/HeroBento";
import HeroCinematic from "../heroes/HeroCinematic";
import HeroOrbit from "../heroes/HeroOrbit";
import HeroReveal from "../heroes/HeroReveal";

const MAP: Record<HeroVariant, (p: HeroProps) => React.ReactNode> = {
  bento: HeroBento,
  reveal: HeroReveal,
  cinematic: HeroCinematic,
  orbit: HeroOrbit,
  arch: HeroArch,
};

export default function Hero({ variant, ...props }: HeroProps & { variant: string }) {
  const C = MAP[variant as HeroVariant] ?? HeroBento;
  return <C {...props} />;
}

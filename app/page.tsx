import React from "react";
import { HeroSection } from "@/src/components/home/HeroSection";
import { CtaSection } from "@/src/components/home/CtaSection";
import { Description } from "@/src/components/home/Description";

export default function Home() {
  return (
    <div className=" mx-auto">
      <HeroSection />

      <div className="max-w-7xl mx-auto">
        <CtaSection />
        <Description />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Particles from "@/components/Particles";
import { useLanguage } from "./i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const showButton = searchParams.get("button") === "show";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <Particles
          particleCount={200}
          particleColors={["#0BFFFF", "#ffffff"]}
          particleSpread={15}
          speed={0.15}
          moveParticlesOnHover={false}
          particleHoverFactor={2}
          particleBaseSize={100}
          sizeRandomness={0.8}
          cameraDistance={25}
          alphaParticles={true}
          className="opacity-70"
        />
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-[5.5rem] font-extrabold mb-5 text-white tracking-tight leading-none border-2 border-[#0BFFFF] px-6 py-3 inline-block shadow-[0_0_15px_rgba(11,255,255,0.5)] backdrop-blur-sm transition-all hover:scale-105 duration-300">
            VICE
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t("homeTitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-black/40 border border-[#0BFFFF]/30 p-8 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t("vibeAndIntuitionTitle")}
            </h2>
            <p className="text-white/80">{t("vibeAndIntuitionDesc")}</p>
          </div>

          <div className="bg-black/40 border border-[#0BFFFF]/30 p-8 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t("dataAndLogicTitle")}
            </h2>
            <p className="text-white/80">{t("dataAndLogicDesc")}</p>
          </div>

          <div className="bg-black/40 border border-[#0BFFFF]/30 p-8 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t("easyToUseTitle")}
            </h2>
            <p className="text-white/80">{t("easyToUseDesc")}</p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/my-battles">
              <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                {t("myBattles")}
              </Button>
            </Link>
            <Link href="/battle/new">
              <Button className="bg-[#0BFFFF] text-black hover:bg-white transition-all px-8 py-6 text-lg font-medium shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                {t("createBattle")}
              </Button>
            </Link>
            {showButton && (
              <Link href="/add-features">
                <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                  {t("prioritizeFeatures")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import Particles from "@/components/Particles";
import { useTranslations } from "@/app/i18n/client";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <Particles
          particleCount={180}
          particleColors={["#0BFFFF", "#ffffff", "#1e90ff"]}
          particleSpread={25}
          speed={0.3}
          moveParticlesOnHover={true}
          particleHoverFactor={4}
          particleBaseSize={130}
          sizeRandomness={0.8}
          cameraDistance={25}
          alphaParticles={true}
          className="opacity-80"
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-start relative z-10 px-4 sm:px-6 pt-10 sm:pt-14">
        <div className="text-center mb-10 sm:mb-12 max-w-3xl mx-auto animate-fadeIn">
          <h1 className="text-5xl sm:text-[5.5rem] font-extrabold mb-6 text-white tracking-tight leading-none border-2 border-[#0BFFFF] px-6 py-3 inline-block shadow-[0_0_15px_rgba(11,255,255,0.5)] backdrop-blur-sm transition-all hover:scale-105 duration-300">
            VICE
          </h1>
          <p className="text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
            {t("homeTitle")}
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-[1200px] gap-8 flex flex-col">
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 p-6 sm:p-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl shadow-[#0BFFFF]/20 transition-all hover:shadow-[#0BFFFF]/30 hover:scale-[1.02] duration-300">
              <div className="mb-4 bg-[#0BFFFF]/10 p-3 rounded-full w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#0BFFFF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#0BFFFF] to-white mb-3">
                {t("vibeAndIntuitionTitle")}
              </h3>
              <p className="text-white/80 font-light">
                {t("vibeAndIntuitionDesc")}
              </p>
            </div>

            <div className="bg-black/50 p-6 sm:p-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl shadow-[#0BFFFF]/20 transition-all hover:shadow-[#0BFFFF]/30 hover:scale-[1.02] duration-300">
              <div className="mb-4 bg-[#0BFFFF]/10 p-3 rounded-full w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#0BFFFF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#0BFFFF] to-white mb-3">
                {t("dataAndLogicTitle")}
              </h3>
              <p className="text-white/80 font-light">
                {t("dataAndLogicDesc")}
              </p>
            </div>

            <div className="bg-black/50 p-6 sm:p-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl shadow-[#0BFFFF]/20 transition-all hover:shadow-[#0BFFFF]/30 hover:scale-[1.02] duration-300">
              <div className="mb-4 bg-[#0BFFFF]/10 p-3 rounded-full w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#0BFFFF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#0BFFFF] to-white mb-3">
                {t("easyToUseTitle")}
              </h3>
              <p className="text-white/80 font-light">{t("easyToUseDesc")}</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-10">
            <div className="bg-black/70 rounded-2xl p-10 text-center border border-[#0BFFFF]/30 shadow-[0_0_20px_rgba(11,255,255,0.2)] transition-all hover:shadow-[0_0_30px_rgba(11,255,255,0.3)] duration-300">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0BFFFF] to-white">
                {t("getStartedTitle")}
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-white/80 font-light">
                {t("getStartedDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/add-features"
                  className="bg-gradient-to-r from-[#0BFFFF] to-[#1e90ff] text-black font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-[#0BFFFF]/50 hover:scale-[1.02] transition-all duration-300"
                >
                  {t("prioritizeFeatures")}
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 py-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              &copy; {new Date().getFullYear()} VICE: Vibe, Impact, Confidence,
              Effort. {t("allRightsReserved")}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

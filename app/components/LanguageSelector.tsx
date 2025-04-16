"use client";

import { useLanguage } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setLanguage(language === "en" ? "pt" : "en")}
        className="bg-black/40 border border-[#0BFFFF]/30 hover:bg-black/60 transition-all p-2 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105 backdrop-blur-sm flex items-center justify-center w-12 h-12 rounded-full"
      >
        <div className="relative w-6 h-6">
          {language === "en" ? (
            <Image
              src="https://flagcdn.com/br.svg"
              alt="Bandeira do Brasil"
              fill
              className="object-contain"
            />
          ) : (
            <Image
              src="https://flagcdn.com/us.svg"
              alt="United States flag"
              fill
              className="object-contain"
            />
          )}
        </div>
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Battle } from "@/types/battle";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/i18n/LanguageContext";
import PixelCard from "../battle/components/PixelCard";

export default function MyBattles() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const loadBattles = () => {
      const storedBattles = localStorage.getItem("user_battles");
      if (storedBattles) {
        setBattles(JSON.parse(storedBattles));
      }
    };

    loadBattles();
    // Adicionar um listener para atualizar a lista quando o localStorage mudar
    window.addEventListener("storage", loadBattles);
    return () => window.removeEventListener("storage", loadBattles);
  }, []);

  const handleDelete = async (battleId: string) => {
    if (confirm("Tem certeza que deseja excluir esta batalha?")) {
      try {
        const response = await fetch(`/api/battles/${battleId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir batalha");
        }

        const updatedBattles = battles.filter(
          (battle) => battle.id !== battleId
        );
        localStorage.setItem("user_battles", JSON.stringify(updatedBattles));
        setBattles(updatedBattles);
      } catch (error) {
        console.error("Erro ao excluir batalha:", error);
        alert("Erro ao excluir batalha. Por favor, tente novamente.");
      }
    }
  };

  const handleEdit = (battleId: string) => {
    router.push(`/edit-battle/${battleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Link href="/">
            <h1 className="text-5xl sm:text-[5.5rem] font-extrabold mb-5 text-white tracking-tight leading-none border-2 border-[#0BFFFF] px-6 py-3 inline-block shadow-[0_0_15px_rgba(11,255,255,0.5)] backdrop-blur-sm transition-all hover:scale-105 duration-300 cursor-pointer">
              VICE
            </h1>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">{t("myBattles")}</h2>
            <Link href="/battle/new">
              <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20">
                {t("createBattle")}
              </Button>
            </Link>
          </div>

          {battles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-6">{t("noBattlesYet")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {battles.map((battle) => (
                <div
                  key={battle.id}
                  className="relative group transition-all duration-300"
                >
                  <Link href={`/battle/${battle.id}`}>
                    <PixelCard
                      variant="blue"
                      className="w-full cursor-pointer h-32"
                      gap={4}
                      speed={40}
                      colors="#0BFFFF,#0ea5e9,#e0f2fe"
                    >
                      <div className="absolute inset-0 flex flex-col justify-center p-4 z-20">
                        <h3 className="text-xl font-bold text-white mb-1 truncate">
                          {battle.title}
                        </h3>
                        {battle.description && (
                          <p className="text-gray-400 text-sm truncate">
                            {battle.description}
                          </p>
                        )}
                        <div className="mt-2">
                          <span className="text-[#0BFFFF] text-xs">
                            {battle.features.length} {t("features")}
                          </span>
                        </div>
                      </div>
                    </PixelCard>
                  </Link>

                  <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link href={`/battle/${battle.id}/results`}>
                      <Button className="bg-[#0BFFFF]/20 text-[#0BFFFF] hover:bg-[#0BFFFF]/30">
                        {t("viewResults")}
                      </Button>
                    </Link>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(battle.id);
                      }}
                      className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    >
                      {t("editBattle")}
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(battle.id);
                      }}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      {t("deleteBattle")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

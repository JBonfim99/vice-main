"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Battle } from "@/types/battle";
import Particles from "@/components/Particles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { createPairs } from "@/app/(main)/utils/feature-storage";

export default function BattlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPair, setCurrentPair] = useState<[string, string] | null>(null);
  const [pairIndex, setPairIndex] = useState(0);
  const [featurePairs, setFeaturePairs] = useState<Array<[string, string]>>([]);
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  const [comparisonType, setComparisonType] = useState<
    "impact" | "ease" | "confidence"
  >("impact");

  // Carregar batalha
  useEffect(() => {
    const loadBattle = async () => {
      try {
        const response = await fetch(`/api/battles?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Batalha não encontrada");
        }
        const data = await response.json();
        setBattle(data);

        // Criar pares de features
        const pairs = createPairs(data.features);
        setFeaturePairs(pairs);

        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar batalha"
        );
        setIsLoading(false);
      }
    };

    loadBattle();
  }, [params.id]);

  // Atualizar par atual
  useEffect(() => {
    if (featurePairs.length > 0) {
      const currentIndex = pairIndex % featurePairs.length;
      setCurrentPair(featurePairs[currentIndex]);
    }
  }, [pairIndex, featurePairs]);

  // Determinar tipo de comparação
  useEffect(() => {
    if (!battle) return;

    const types: ("impact" | "ease" | "confidence")[] = [];
    if (battle.settings.compareImpact) types.push("impact");
    if (battle.settings.compareEase) types.push("ease");
    if (battle.settings.compareConfidence) types.push("confidence");

    setComparisonType(types[pairIndex % types.length]);
  }, [pairIndex, battle]);

  const handleSelection = async (selectedFeature: string) => {
    if (!currentPair || !battle) return;

    setCurrentSelection(selectedFeature);
    const rejectedFeature =
      currentPair[0] === selectedFeature ? currentPair[1] : currentPair[0];

    try {
      await fetch(`/api/battles/${battle.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          winner: selectedFeature,
          loser: rejectedFeature,
          type: comparisonType,
        }),
      });

      // Limpar seleção e avançar
      setCurrentSelection(null);
      setPairIndex((prev) => prev + 1);

      // Se completou todos os pares, criar novos pares
      if (pairIndex % featurePairs.length === featurePairs.length - 1) {
        const newPairs = createPairs(battle.features);
        setFeaturePairs(newPairs);
      }
    } catch (err) {
      console.error("Error saving vote:", err);
      setCurrentSelection(null);
    }
  };

  const getComparisonQuestion = (type: "impact" | "ease" | "confidence") => {
    switch (type) {
      case "impact":
        return t("impactQuestion");
      case "ease":
        return t("easeQuestion");
      case "confidence":
        return t("confidenceQuestion");
      default:
        return "Qual feature você prefere?";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-[#0BFFFF]">Carregando...</div>
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="mb-4">{error || "Batalha não encontrada"}</p>
          <Link href="/">
            <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <Link href="/">
            <h1 className="text-5xl sm:text-[5.5rem] font-extrabold mb-5 text-white tracking-tight leading-none border-2 border-[#0BFFFF] px-6 py-3 inline-block shadow-[0_0_15px_rgba(11,255,255,0.5)] backdrop-blur-sm transition-all hover:scale-105 duration-300 cursor-pointer">
              VICE
            </h1>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">{battle.title}</h2>
          {battle.description && (
            <p className="text-white/80 text-lg">{battle.description}</p>
          )}
        </div>

        {currentPair && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-medium text-[#0BFFFF]">
                {getComparisonQuestion(comparisonType)}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto px-4 md:px-8 place-items-center">
              {currentPair.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (!currentSelection) {
                      handleSelection(feature);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-300 w-full ${
                    currentSelection === feature
                      ? "scale-105"
                      : currentSelection && currentSelection !== feature
                      ? "opacity-50 scale-95"
                      : ""
                  }`}
                >
                  <div className="w-full aspect-[4/3] bg-black/40 border border-[#0BFFFF]/30 rounded-lg shadow-lg shadow-[#0BFFFF]/10 backdrop-blur-sm hover:shadow-[#0BFFFF]/20 hover:scale-[1.02] transition-all flex items-center justify-center p-8">
                    <p className="text-gray-400 text-4xl font-medium text-center tracking-tight">
                      {feature}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-center mt-12">
          <Link href={`/battle/${battle.id}/results`}>
            <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
              Ver Resultados
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

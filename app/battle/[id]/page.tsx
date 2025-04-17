"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Battle } from "@/types/battle";
import Particles from "@/components/Particles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { createPairs } from "@/app/(main)/utils/feature-storage";
import PixelCard from "../components/PixelCard";

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
  const [hasVoted, setHasVoted] = useState(false);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const [userVoteCount, setUserVoteCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  // Carregar batalha e verificar se já votou
  useEffect(() => {
    const loadBattle = async () => {
      try {
        const response = await fetch(`/api/battles?id=${params.id}`);
        if (!response.ok) {
          throw new Error(t("battleNotFound"));
        }
        const data = await response.json();
        setBattle(data);

        // Verificar se é o dono da batalha
        const storedBattles = JSON.parse(
          localStorage.getItem("user_battles") || "[]"
        );
        setIsOwner(storedBattles.some((b: Battle) => b.id === params.id));

        // Registrar visitante
        await fetch(`/api/battles/${params.id}/visitor`, {
          method: "POST",
        });

        // Calcular número total de comparações possíveis
        const n = data.features.length;
        const totalPossibleComparisons = (n * (n - 1)) / 2;
        setTotalComparisons(totalPossibleComparisons);

        // Carregar contagem de votos do usuário
        const userVotes = JSON.parse(
          localStorage.getItem(`votes_${params.id}`) || "0"
        );
        setUserVoteCount(userVotes);

        // Verificar se já completou todas as comparações
        setHasVoted(userVotes >= totalPossibleComparisons);

        // Criar pares de features
        const pairs = createPairs(data.features) as [string, string][];
        setFeaturePairs(pairs);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errorLoadingBattle"));
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

    // Se não permite votos múltiplos e já completou todas as comparações
    if (!battle.settings.allowMultipleVotes && hasVoted) {
      router.push(`/battle/${battle.id}/results`);
      return;
    }

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

      // Atualizar contagem de votos do usuário
      const newVoteCount = userVoteCount + 1;
      localStorage.setItem(`votes_${battle.id}`, JSON.stringify(newVoteCount));
      setUserVoteCount(newVoteCount);

      // Verificar se completou todas as comparações
      if (newVoteCount >= totalComparisons) {
        setHasVoted(true);
        if (!battle.settings.allowMultipleVotes) {
          router.push(`/battle/${battle.id}/results`);
          return;
        }
      }

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
      <style jsx global>{`
        @keyframes scanAnimation {
          0% {
            left: -25%;
          }
          100% {
            left: 100%;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>

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
              <h3
                className={`text-2xl font-medium ${
                  comparisonType === "impact"
                    ? "text-[#FF5757]"
                    : comparisonType === "ease"
                    ? "text-[#4CAF50]"
                    : "text-[#0BFFFF]"
                }`}
              >
                {getComparisonQuestion(comparisonType)}
              </h3>
              {!battle.settings.allowMultipleVotes && hasVoted && (
                <p className="text-emerald-400 mt-2 flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("allComparisonsCompleted")}
                </p>
              )}

              {/* Barra de Progresso */}
              <div className="mt-4 max-w-md mx-auto">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#0BFFFF] mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-[#0BFFFF] uppercase tracking-widest">
                      Progresso
                    </span>
                  </div>
                  <div className="bg-black/60 px-3 py-1 rounded-md border border-[#0BFFFF]/40 text-sm font-mono">
                    <span className="text-white">{userVoteCount}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#0BFFFF]">{totalComparisons}</span>
                  </div>
                </div>

                <div className="w-full bg-black/40 border border-[#0BFFFF]/30 rounded-md h-5 relative overflow-hidden backdrop-blur-sm shadow-[0_0_10px_rgba(11,255,255,0.2)]">
                  <div
                    className="h-full bg-gradient-to-r from-[#0BFFFF] via-[#00BFFF] to-[#0BFFFF] rounded-sm transition-all duration-500 ease-out relative overflow-hidden"
                    style={{
                      width: `${Math.min(
                        (userVoteCount / totalComparisons) * 100,
                        100
                      )}%`,
                    }}
                  >
                    {/* Scan line animation */}
                    <div
                      className="absolute h-full w-1/4 bg-[#5CFFFF] opacity-40 blur-sm"
                      style={{
                        animation: "scanAnimation 2s linear infinite",
                        transform: "skewX(45deg)",
                      }}
                    />
                  </div>

                  {/* Edge reflections */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0BFFFF]/40"></div>
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#0BFFFF]/40"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto px-4 md:px-8 place-items-center">
              {currentPair.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (
                      !currentSelection &&
                      (!hasVoted || battle.settings.allowMultipleVotes)
                    ) {
                      handleSelection(feature);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-300 w-full ${
                    currentSelection === feature
                      ? "scale-105"
                      : currentSelection && currentSelection !== feature
                      ? "opacity-50 scale-95"
                      : !battle.settings.allowMultipleVotes && hasVoted
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <PixelCard
                    variant="blue"
                    gap={6}
                    speed={40}
                    colors="#0BFFFF,#0ea5e9,#e0f2fe"
                    className="w-full"
                    tabIndex={-1}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                      <p className="text-gray-400 text-4xl font-medium text-center tracking-tight">
                        {feature}
                      </p>
                    </div>
                  </PixelCard>
                </div>
              ))}
            </div>
          </>
        )}

        {(battle.settings.showResults ||
          (!battle.settings.showResults && isOwner)) && (
          <div className="flex justify-center mt-12">
            <Link href={`/battle/${battle.id}/results`}>
              <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                {t("viewResults")}
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

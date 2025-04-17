"use client";

import { useEffect, useState } from "react";
import { Battle } from "@/types/battle";
import Particles from "@/components/Particles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface FeatureScore {
  name: string;
  impact: number;
  ease: number;
  confidence: number;
  total: number;
}

export default function BattleResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const { t } = useLanguage();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<FeatureScore[]>([]);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  useEffect(() => {
    const loadBattle = async () => {
      try {
        const response = await fetch(`/api/battles?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Batalha não encontrada");
        }
        const data: Battle = await response.json();
        setBattle(data);

        // Se não permitir ver resultados, redirecionar para a página da batalha
        if (!data.settings.showResults) {
          window.location.href = `/battle/${params.id}`;
          return;
        }

        // Calcular scores
        const featureScores: FeatureScore[] = Object.entries(data.votes).map(
          ([name, votes]) => ({
            name,
            impact: votes.impact,
            ease: votes.ease,
            confidence: votes.confidence,
            total: votes.total,
          })
        );

        // Ordenar por total de votos
        featureScores.sort((a, b) => b.total - a.total);
        setScores(featureScores);

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

  const handleShare = () => {
    const url = window.location.href.replace(/\/results$/, "");
    navigator.clipboard.writeText(url);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 3000);
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
            <p className="text-white/80 text-lg mb-8">{battle.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div className="bg-black/40 border border-[#0BFFFF]/30 rounded-lg p-4">
              <p className="text-[#0BFFFF] text-sm">Total de Comparações</p>
              <p className="text-white text-2xl font-bold">
                {battle.comparison_count}
              </p>
            </div>
            <div className="bg-black/40 border border-[#0BFFFF]/30 rounded-lg p-4">
              <p className="text-[#0BFFFF] text-sm">Visitantes</p>
              <p className="text-white text-2xl font-bold">
                {battle.total_visitors}
              </p>
            </div>
            <div className="bg-black/40 border border-[#0BFFFF]/30 rounded-lg p-4">
              <p className="text-[#0BFFFF] text-sm">Features</p>
              <p className="text-white text-2xl font-bold">
                {battle.features.length}
              </p>
            </div>
            <div className="bg-black/40 border border-[#0BFFFF]/30 rounded-lg p-4">
              <p className="text-[#0BFFFF] text-sm">Critérios</p>
              <p className="text-white text-2xl font-bold">
                {Object.values(battle.settings).filter(Boolean).length}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-black/40 border border-[#0BFFFF]/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg shadow-[#0BFFFF]/10">
            <div className="grid grid-cols-16 py-4 px-4 border-b border-[#0BFFFF]/30 text-sm font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-4">Feature</div>
              <div className="col-span-2 text-center">Total</div>
              {battle.settings.compareImpact && (
                <div className="col-span-2 text-center">Impacto</div>
              )}
              {battle.settings.compareEase && (
                <div className="col-span-2 text-center">Facilidade</div>
              )}
              {battle.settings.compareConfidence && (
                <div className="col-span-2 text-center">Confiança</div>
              )}
            </div>

            {scores.map((score, index) => (
              <div
                key={score.name}
                className="grid grid-cols-16 py-4 px-4 items-center hover:bg-white/5 transition-colors"
              >
                <div className="col-span-1 text-center font-medium text-[#0BFFFF]">
                  {index + 1}
                </div>
                <div className="col-span-4 text-white font-medium">
                  {score.name}
                </div>
                <div className="col-span-2 text-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0BFFFF]/20 text-[#0BFFFF] font-medium">
                    {score.total}
                  </div>
                </div>
                {battle.settings.compareImpact && (
                  <div className="col-span-2 text-center">
                    <div className="inline-block px-2 py-1 rounded-full bg-[#FF5757]/20 text-[#FF5757] font-medium">
                      {score.impact}
                    </div>
                  </div>
                )}
                {battle.settings.compareEase && (
                  <div className="col-span-2 text-center">
                    <div className="inline-block px-2 py-1 rounded-full bg-[#4CAF50]/20 text-[#4CAF50] font-medium">
                      {score.ease}
                    </div>
                  </div>
                )}
                {battle.settings.compareConfidence && (
                  <div className="col-span-2 text-center">
                    <div className="inline-block px-2 py-1 rounded-full bg-[#0BFFFF]/20 text-[#0BFFFF] font-medium">
                      {score.confidence}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {!battle.settings.allowMultipleVotes &&
              JSON.parse(localStorage.getItem(`votes_${battle.id}`) || "0") <
                (battle.features.length * (battle.features.length - 1)) / 2 && (
                <Link href={`/battle/${battle.id}`}>
                  <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                    Continuar Votando
                  </Button>
                </Link>
              )}

            <div className="relative">
              <Button
                onClick={handleShare}
                className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105"
              >
                Compartilhar
              </Button>
              {showCopyMessage && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#0BFFFF]/20 text-[#0BFFFF] px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-[#0BFFFF]/30">
                  Link copiado!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

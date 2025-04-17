"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Particles from "@/components/Particles";
import Link from "next/link";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { Battle } from "@/types/battle";

export default function EditBattlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    settings: {
      compareImpact: true,
      compareEase: true,
      compareConfidence: true,
      allowMultipleVotes: false,
      showResults: true,
    },
  });

  useEffect(() => {
    // Carregar dados da batalha do localStorage
    const storedBattles = JSON.parse(
      localStorage.getItem("user_battles") || "[]"
    );
    const battle = storedBattles.find((b: Battle) => b.id === params.id);

    if (battle) {
      setFormData({
        title: battle.title,
        description: battle.description || "",
        features: battle.features.join("\n"),
        settings: {
          compareImpact: battle.settings.compareImpact,
          compareEase: battle.settings.compareEase,
          compareConfidence: battle.settings.compareConfidence,
          allowMultipleVotes: battle.settings.allowMultipleVotes || false,
          showResults: battle.settings.showResults || true,
        },
      });
    } else {
      setError("Batalha não encontrada");
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Extrair features do texto (uma por linha)
      const features = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (features.length < 2) {
        throw new Error(
          "Por favor, adicione pelo menos 2 features para comparação"
        );
      }

      const response = await fetch(`/api/battles/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          features,
          settings: formData.settings,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao atualizar batalha");
      }

      const updatedBattle = await response.json();

      // Atualizar no localStorage
      const storedBattles = JSON.parse(
        localStorage.getItem("user_battles") || "[]"
      );
      const battleIndex = storedBattles.findIndex(
        (b: Battle) => b.id === params.id
      );

      if (battleIndex !== -1) {
        storedBattles[battleIndex] = updatedBattle;
        localStorage.setItem("user_battles", JSON.stringify(storedBattles));
      }

      router.push(`/battle/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Label htmlFor="title" className="text-xl text-white mb-4 block">
                Título da Batalha
              </Label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: Qual feature você prefere para o novo app?"
                className="w-full p-4 bg-black/40 border border-[#0BFFFF]/30 text-white placeholder-gray-500 rounded-lg shadow-lg shadow-[#0BFFFF]/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#0BFFFF]/50 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-xl text-white mb-4 block"
              >
                Descrição (opcional)
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Explique o contexto para os participantes..."
                className="w-full p-4 bg-black/40 border border-[#0BFFFF]/30 text-white placeholder-gray-500 rounded-lg shadow-lg shadow-[#0BFFFF]/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#0BFFFF]/50 focus:border-transparent transition-all resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label
                htmlFor="features"
                className="text-xl text-white mb-4 block"
              >
                Features para Comparação
              </Label>
              <textarea
                id="features"
                value={formData.features}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, features: e.target.value }))
                }
                placeholder="Digite uma feature por linha..."
                className="w-full p-4 bg-black/40 border border-[#0BFFFF]/30 text-white placeholder-gray-500 rounded-lg shadow-lg shadow-[#0BFFFF]/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#0BFFFF]/50 focus:border-transparent transition-all resize-none"
                rows={10}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xl text-white mb-4 block">
                Critérios de Comparação
              </Label>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.compareImpact}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          compareImpact: e.target.checked,
                        },
                      }))
                    }
                    className="form-checkbox text-[#0BFFFF] rounded border-[#0BFFFF]/30 bg-black/40"
                  />
                  <span>Impacto</span>
                </label>

                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.compareEase}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          compareEase: e.target.checked,
                        },
                      }))
                    }
                    className="form-checkbox text-[#0BFFFF] rounded border-[#0BFFFF]/30 bg-black/40"
                  />
                  <span>Facilidade</span>
                </label>

                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.compareConfidence}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          compareConfidence: e.target.checked,
                        },
                      }))
                    }
                    className="form-checkbox text-[#0BFFFF] rounded border-[#0BFFFF]/30 bg-black/40"
                  />
                  <span>Confiança</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.allowMultipleVotes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          allowMultipleVotes: e.target.checked,
                        },
                      }))
                    }
                    className="form-checkbox text-[#0BFFFF] rounded border-[#0BFFFF]/30 bg-black/40"
                  />
                  <span>Permitir votos múltiplos</span>
                </label>

                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.showResults}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          showResults: e.target.checked,
                        },
                      }))
                    }
                    className="form-checkbox text-[#0BFFFF] rounded border-[#0BFFFF]/30 bg-black/40"
                  />
                  <span>Mostrar resultados</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Link href="/my-battles">
                <Button
                  type="button"
                  className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105"
                >
                  Cancelar
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#0BFFFF] text-black hover:bg-white transition-all px-8 py-6 text-lg font-medium shadow-lg shadow-[#0BFFFF]/20 hover:scale-105 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

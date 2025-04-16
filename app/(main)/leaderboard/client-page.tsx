"use client";

import { useState, useEffect } from "react";
import Particles from "@/components/Particles";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureItem } from "./components/feature-item";
import {
  deleteFeatureFromStorage,
  loadFeatureRatings,
  loadFeaturesFromStorage,
  resetScoresAndComparisons,
} from "@/app/(main)/utils/feature-storage";
import { calculateViceScore } from "@/app/(main)/utils/elo";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface Feature {
  name: string;
  viceScore: number;
  impactScore: number;
  easeScore: number;
  confidenceScore: number;
  impactRating: number;
  easeRating: number;
  confidenceRating: number;
  totalMatches: number;
}

export function LeaderboardClient() {
  const router = useRouter();
  const { t } = useLanguage();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Load features and their Elo ratings from localStorage
    const loadFeatures = () => {
      setIsLoading(true);

      // Get feature list from localStorage
      const featureList = loadFeaturesFromStorage();

      if (featureList.length === 0) {
        router.push("/add-features");
        return;
      }

      // Get feature ratings
      const featureRatings = loadFeatureRatings();

      // Convert to Feature objects with calculated scores
      const featureObjects: Feature[] = featureList.map((featureName) => {
        const rating = featureRatings[featureName] || {
          name: featureName,
          ratings: { impact: 1400, ease: 1400, confidence: 1400 },
          matches: { impact: 0, ease: 0, confidence: 0, total: 0 },
        };

        // Normalize each rating to a 0-100 scale
        const normalizeRating = (ratingValue: number) => {
          const min = 1000;
          const max = 2000;
          return Math.min(
            100,
            Math.max(0, ((ratingValue - min) / (max - min)) * 100)
          );
        };

        const impactScore = Math.round(normalizeRating(rating.ratings.impact));
        const easeScore = Math.round(normalizeRating(rating.ratings.ease));
        const confidenceScore = Math.round(
          normalizeRating(rating.ratings.confidence)
        );

        // Calculate overall VICE score using the utility function
        const viceScore = calculateViceScore(rating);

        return {
          name: featureName,
          viceScore,
          impactScore,
          easeScore,
          confidenceScore,
          impactRating: rating.ratings.impact,
          easeRating: rating.ratings.ease,
          confidenceRating: rating.ratings.confidence,
          totalMatches: rating.matches.total,
        };
      });

      // Sort features by vice score in descending order
      const sortedFeatures = featureObjects.sort(
        (a, b) => b.viceScore - a.viceScore
      );

      setFeatures(sortedFeatures);
      setIsLoading(false);
    };

    loadFeatures();
  }, [router]);

  // If no selection data exists yet, simulate some scores for demo purposes
  const handleDeleteFeature = (featureName: string) => {
    try {
      // Attempt to delete from localStorage
      deleteFeatureFromStorage(featureName);

      // Update state by removing the deleted feature regardless of the reported success
      // This ensures UI consistency with localStorage
      setFeatures((prevFeatures) =>
        prevFeatures.filter((f) => f.name !== featureName)
      );

      setDeleteMessage({
        message: `Feature "${featureName}" was successfully deleted.`,
        type: "success",
      });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setDeleteMessage(null);
      }, 3000);

      // If no features left after deletion, redirect to add features
      if (features.length === 1) {
        setTimeout(() => {
          router.push("/add-features");
        }, 1000);
      }
    } catch (error: unknown) {
      console.error("Error handling feature deletion:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      setDeleteMessage({
        message: `Error deleting feature "${featureName}": ${errorMessage}`,
        type: "error",
      });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setDeleteMessage(null);
      }, 3000);
    }
  };

  const handleResetScores = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all scores and clear comparison history? This action cannot be undone."
      )
    ) {
      setIsResetting(true);
      try {
        // Reset all scores and comparisons
        resetScoresAndComparisons();

        // Reload features with reset scores
        const featureList = loadFeaturesFromStorage();
        const resetFeatureObjects: Feature[] = featureList.map(
          (featureName) => {
            return {
              name: featureName,
              viceScore: 50, // Default vice score
              impactScore: 50, // Default scores (normalized from initial 1400 rating)
              easeScore: 50,
              confidenceScore: 50,
              impactRating: 1400, // Initial Elo ratings
              easeRating: 1400,
              confidenceRating: 1400,
              totalMatches: 0,
            };
          }
        );

        setFeatures(resetFeatureObjects);

        setDeleteMessage({
          message:
            "All scores have been reset and comparison history has been cleared.",
          type: "success",
        });
      } catch (error: unknown) {
        console.error("Error resetting scores:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        setDeleteMessage({
          message: `Error resetting scores: ${errorMessage}`,
          type: "error",
        });
      } finally {
        setIsResetting(false);

        // Clear the message after 3 seconds
        setTimeout(() => {
          setDeleteMessage(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
          <h2 className="text-4xl font-bold text-[#0BFFFF] mt-8">
            {t("featureLeaderboard")}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-[#0BFFFF]">{t("loading")}</div>
            </div>
          ) : features.length > 0 ? (
            <>
              <div className="bg-black/40 border border-[#0BFFFF]/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg shadow-[#0BFFFF]/10">
                <div className="grid grid-cols-16 py-4 px-4 border-b border-[#0BFFFF]/30 text-sm font-medium text-gray-400 uppercase tracking-wider">
                  <div className="col-span-1 text-center">{t("rank")}</div>
                  <div className="col-span-4">{t("feature")}</div>
                  <div className="col-span-2 text-center">{t("viceScore")}</div>
                  <div className="col-span-2 text-center">{t("impact")}</div>
                  <div className="col-span-2 text-center">{t("ease")}</div>
                  <div className="col-span-2 text-center">
                    {t("confidence")}
                  </div>
                </div>

                {features.map((feature, index) => (
                  <FeatureItem
                    key={feature.name}
                    feature={feature}
                    rank={index + 1}
                    onDelete={handleDeleteFeature}
                  />
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Link href="/choose">
                  <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                    {t("goToSelection")}
                  </Button>
                </Link>

                <Link href="/add-features">
                  <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                    {t("addFeatures")}
                  </Button>
                </Link>

                <Button
                  onClick={handleResetScores}
                  disabled={isResetting}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all px-8 py-6 text-lg font-medium border border-red-500/40 shadow-lg shadow-red-500/20 hover:scale-105"
                >
                  {isResetting ? t("resetting") : t("resetScores")}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-white/70">
              {t("noFeaturesFound")}
            </div>
          )}

          {deleteMessage && (
            <div
              className={`mt-4 p-4 rounded-lg text-center ${
                deleteMessage.type === "success"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {deleteMessage.message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

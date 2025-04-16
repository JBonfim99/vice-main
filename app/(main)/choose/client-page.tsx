"use client";
import { useState, useMemo, useEffect } from "react";
import PixelCard from "./components/PixelCard";
import Particles from "@/components/Particles";
import { useRouter } from "next/navigation";
import { saveChoice, ComparisonType } from "./actions/save-choice";
import {
  loadFeaturesFromStorage,
  createPairs,
  saveFeatureComparison,
  getCompletedComparisonsCount,
} from "@/app/(main)/utils/feature-storage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/i18n/LanguageContext";

export function VicePageClient() {
  const router = useRouter();
  const { t } = useLanguage();
  const [features, setFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featurePairs, setFeaturePairs] = useState<Array<[string, string]>>([]);
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);

  const [pairIndex, setPairIndex] = useState(0);
  const [completedComparisons, setCompletedComparisons] = useState(0);
  const [comparisonType, setComparisonType] =
    useState<ComparisonType>("impact");

  // Wrap comparisonTypes in useMemo to prevent recreation on each render
  const comparisonTypes = useMemo<ComparisonType[]>(
    () => ["impact", "ease", "confidence"],
    []
  );

  useEffect(() => {
    // Load features from localStorage
    const loadFeatures = () => {
      setIsLoading(true);
      const featureArray = loadFeaturesFromStorage();

      if (featureArray.length >= 2) {
        setFeatures(featureArray);
        const pairs = createPairs(featureArray);
        setFeaturePairs(pairs);

        // Load completed comparisons from localStorage
        const savedCompletedCount = getCompletedComparisonsCount();
        setCompletedComparisons(savedCompletedCount);

        setIsLoading(false);
      } else if (featureArray.length === 1) {
        setFeatures(featureArray);
        setCompletedComparisons(0); // Reset comparisons when only one feature
        setIsLoading(false);
      } else {
        console.error("Not enough features for comparison (need at least 2)");
        router.push("/add-features");
      }
    };

    loadFeatures();
  }, [router]);

  // Add effect to update completed comparisons when features change
  useEffect(() => {
    if (features.length >= 2) {
      const savedCompletedCount = getCompletedComparisonsCount();
      setCompletedComparisons(savedCompletedCount);
    } else {
      setCompletedComparisons(0);
    }
  }, [features]);

  // Calculate total number of comparisons needed (n choose 2) * 3 types
  // For 6 features, this gives 15 unique pairs (6 choose 2) * 3 types = 45 total comparisons
  // Each pair needs to be compared for impact, ease, and confidence
  const totalPossibleComparisons = useMemo(() => {
    const pairsCount = (features.length * (features.length - 1)) / 2; // n choose 2 formula
    return pairsCount * comparisonTypes.length;
  }, [features.length, comparisonTypes.length]);

  const currentPair = useMemo(() => {
    if (featurePairs.length === 0) return [];
    // Get the current pair based on the pairIndex
    const currentIndex = pairIndex % featurePairs.length;
    return featurePairs[currentIndex];
  }, [pairIndex, featurePairs]);

  const currentComparisonType = useMemo(() => {
    // Mix question types by using pairIndex directly
    // This way we rotate through comparison types with each question
    return comparisonTypes[pairIndex % comparisonTypes.length];
  }, [pairIndex, comparisonTypes]);

  // Update comparisonType when it changes
  useEffect(() => {
    setComparisonType(currentComparisonType);
  }, [currentComparisonType]);

  const handleSelection = async (selectedFeature: string) => {
    if (
      currentPair.length !== 2 ||
      completedComparisons >= totalPossibleComparisons
    )
      return;

    // Store the selected feature - temporarily highlight for visual feedback
    setCurrentSelection(selectedFeature);

    // Increment the completed comparisons counter
    const newCount = completedComparisons + 1;
    setCompletedComparisons(newCount);

    // The completed count will be updated in localStorage by saveFeatureComparison

    // Get the rejected feature (the other one in the pair)
    const rejectedFeature =
      currentPair[0] === selectedFeature ? currentPair[1] : currentPair[0];

    try {
      // Save the choice using the server action
      await saveChoice(selectedFeature, rejectedFeature, comparisonType, false);

      // Also save to localStorage for client-side calculations
      saveFeatureComparison({
        selectedFeature,
        rejectedFeature,
        comparisonType,
        isDraw: false,
      });

      // Clear the highlight immediately and move to next pair
      setCurrentSelection(null);

      // Only move to next pair if we haven't completed all comparisons
      if (newCount < totalPossibleComparisons) {
        // Short delay before moving to next pair to allow user to see the result
        setTimeout(() => {
          setPairIndex((prev) => prev + 1);

          // If we've gone through all pairs (one full cycle), create new shuffled pairs
          if (pairIndex % featurePairs.length === featurePairs.length - 1) {
            const newPairs = createPairs(features);
            setFeaturePairs(newPairs);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error saving choice:", error);
      // Make sure to clear selection even if there's an error
      setCurrentSelection(null);
    }
  };

  // This function is defined for future use but not currently used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getComparisonTypeLabel = (type: ComparisonType) => {
    switch (type) {
      case "impact":
        return "Impact";
      case "ease":
        return "Ease";
      case "confidence":
        return "Confidence";
      default:
        return "Unknown";
    }
  };

  const getComparisonTypeColor = (type: ComparisonType) => {
    switch (type) {
      case "impact":
        return "text-[#FF5757]";
      case "ease":
        return "text-[#4CAF50]";
      case "confidence":
        return "text-[#0BFFFF]";
      default:
        return "text-white";
    }
  };

  const getComparisonQuestion = (type: ComparisonType) => {
    switch (type) {
      case "impact":
        return t("impactQuestion");
      case "ease":
        return t("easeQuestion");
      case "confidence":
        return t("confidenceQuestion");
      default:
        return "Which feature do you prefer?";
    }
  };

  return (
    <>
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
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Link href="/">
              <h1 className="text-5xl sm:text-[5.5rem] font-extrabold mb-5 text-white tracking-tight leading-none border-2 border-[#0BFFFF] px-6 py-3 inline-block shadow-[0_0_15px_rgba(11,255,255,0.5)] backdrop-blur-sm transition-all hover:scale-105 duration-300 cursor-pointer">
                VICE
              </h1>
            </Link>
            <p
              className={`text-3xl ${getComparisonTypeColor(
                comparisonType
              )} font-medium mt-12 px-6 py-2 rounded-full bg-black/50 backdrop-blur-sm inline-block`}
            >
              {getComparisonQuestion(comparisonType)}
            </p>
            <div className="mt-8 max-w-md mx-auto px-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#0BFFFF] mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-[#0BFFFF] uppercase tracking-widest">
                    {t("progress")}
                  </span>
                </div>
                <div className="bg-black/60 px-3 py-1 rounded-md border border-[#0BFFFF]/40 text-sm font-mono">
                  <span className="text-white">{completedComparisons}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-[#0BFFFF]">
                    {totalPossibleComparisons}
                  </span>
                </div>
              </div>

              <div className="w-full bg-black/40 border border-[#0BFFFF]/30 rounded-md h-5 relative overflow-hidden backdrop-blur-sm shadow-[0_0_10px_rgba(11,255,255,0.2)]">
                {/* Progress indicator */}
                <div
                  className="h-full bg-gradient-to-r from-[#0BFFFF] via-[#00BFFF] to-[#0BFFFF] rounded-sm transition-all duration-500 ease-out relative overflow-hidden"
                  style={{
                    width: `${Math.min(
                      (completedComparisons / totalPossibleComparisons) * 100,
                      100
                    )}%`,
                  }}
                >
                  {/* Scan line animation - using a blue tint instead of white */}
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

              {/* Text label */}
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400 font-mono">
                  {t("totalComparisons")}
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-[#0BFFFF]">
                {t("loadingFeatures")}
              </div>
            </div>
          ) : completedComparisons >= totalPossibleComparisons ? (
            <div className="text-center">
              <div className="max-w-2xl mx-auto p-8 bg-black/40 border border-[#0BFFFF]/30 backdrop-blur-sm rounded-xl shadow-lg shadow-[#0BFFFF]/10">
                <h2 className="text-3xl font-bold text-[#0BFFFF] mb-4">
                  {t("comparisonsCompleted")}
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  {t("comparisonsCompletedDesc")}
                </p>

                <Link href="/leaderboard">
                  <Button className="bg-[#0BFFFF] text-black hover:bg-white transition-all px-8 py-6 text-lg font-medium shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                    {t("goToLeaderboard")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : currentPair.length === 2 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto px-4 md:px-8 place-items-center">
                {currentPair.map((feature, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      if (!currentSelection) {
                        e.preventDefault();
                        handleSelection(feature);
                      }
                    }}
                    onMouseLeave={(e) => {
                      // Force any active/focus state to be removed when mouse leaves
                      e.currentTarget.blur();
                    }}
                    className={`cursor-pointer transition-all duration-300 flex justify-center items-center w-full ${
                      currentSelection === feature
                        ? "scale-105"
                        : currentSelection && currentSelection !== feature
                        ? "opacity-50 scale-95"
                        : ""
                    }`}
                  >
                    <PixelCard
                      variant="blue"
                      gap={6}
                      speed={40}
                      colors="#0BFFFF,#0ea5e9,#e0f2fe"
                      className="w-[400px]"
                      tabIndex={-1}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                        <p className="text-gray-400 text-5xl font-medium text-center tracking-tight">
                          {feature}
                        </p>
                      </div>
                    </PixelCard>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-20">
                <Link href="/leaderboard">
                  <Button className="bg-[#0BFFFF]/10 text-[#0BFFFF] hover:bg-[#0BFFFF]/20 transition-all px-8 py-6 text-lg font-medium border border-[#0BFFFF]/40 shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                    {t("viewLeaderboard")}
                  </Button>
                </Link>
              </div>
            </>
          ) : features.length === 1 ? (
            <div className="text-center">
              <div className="max-w-2xl mx-auto p-8 bg-black/40 border border-[#0BFFFF]/30 backdrop-blur-sm rounded-xl shadow-lg shadow-[#0BFFFF]/10">
                <div className="mb-6">
                  <PixelCard
                    variant="blue"
                    gap={6}
                    speed={40}
                    colors="#0BFFFF,#0ea5e9,#e0f2fe"
                    className="w-full max-w-md mx-auto"
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                      <p className="text-gray-400 text-4xl font-medium text-center tracking-tight">
                        {features[0]}
                      </p>
                    </div>
                  </PixelCard>
                </div>

                <h2 className="text-2xl font-bold text-[#0BFFFF] mb-4">
                  {t("oneMoreFeature")}
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  {t("needTwoFeatures")}
                </p>

                <Link href="/add-features">
                  <Button className="bg-[#0BFFFF] text-black hover:bg-white transition-all px-8 py-6 text-lg font-medium shadow-lg shadow-[#0BFFFF]/20 hover:scale-105">
                    {t("addAnotherFeature")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/70">{t("noFeatures")}</div>
          )}
        </main>
      </div>
    </>
  );
}

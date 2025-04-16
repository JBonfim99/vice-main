"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import Particles from "@/components/Particles";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  loadFeaturesFromStorage,
  saveFeaturesToStorage,
} from "../utils/feature-storage";
import Link from "next/link";
import { useLanguage } from "@/app/i18n/LanguageContext";

// Define the state type for better type safety
type ActionState =
  | { error: string; success?: undefined; redirect?: undefined }
  | { success: boolean; redirect: string; error?: undefined }
  | { error?: undefined; success: boolean; redirect?: undefined };

// Function to save feature list data
async function saveFeatureList(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const featureList = formData.get("featureList") as string;

  // Validate input
  if (!featureList || featureList.trim() === "") {
    return { error: "Please provide at least one feature." };
  }

  try {
    // We'll handle actual storage in the client component
    // using saveFeaturesToStorage from feature-storage.ts
    return {
      success: true,
      redirect: "/choose", // Redirect to the features page after saving
    };
  } catch (e) {
    console.error("Error saving features:", e);
    return { error: "Failed to save your features. Please try again." };
  }
}

// Function to extract feature names from text
const extractFeatures = (text: string): string[] => {
  if (!text) return [];

  // Split the text by newlines - each line is a feature
  const rawFeatures = text.split(/\n/);

  // Process each potential feature
  return rawFeatures
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0); // Filter out empty strings
};

export default function AddFeaturesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [extractedFeatures, setExtractedFeatures] = useState<string[]>([]);
  const [currentFeatures, setCurrentFeatures] = useState<string>("");
  const [savedFeatureCount, setSavedFeatureCount] = useState<number>(0);
  const [hasExistingFeatures, setHasExistingFeatures] =
    useState<boolean>(false);

  const [state, formAction] = useActionState(saveFeatureList, {
    error: undefined,
    success: false,
  });

  // Load existing features when the component mounts
  useEffect(() => {
    const existingFeatures = loadFeaturesFromStorage();
    if (existingFeatures.length > 0) {
      // Join features with newlines for textarea display
      setCurrentFeatures(existingFeatures.join("\n"));
      setSavedFeatureCount(existingFeatures.length);
      setHasExistingFeatures(true);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Extract and save features to localStorage
    const featureList = formData.get("featureList") as string;
    const features = extractFeatures(featureList);

    if (features.length > 0) {
      // Use the utility function from feature-storage.ts to save features
      // This ensures ELO ratings are preserved for existing features
      saveFeaturesToStorage(features);
      setExtractedFeatures(features);
      setSavedFeatureCount(features.length);
      console.log("Saved features to localStorage:", features);
    }

    // Submit the form data to the server action
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state.redirect, router]);

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
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Label
                htmlFor="featureList"
                className="text-xl text-white mb-4 block text-center"
              >
                {t("defineFeatures")}
              </Label>

              <div className="relative">
                <textarea
                  id="featureList"
                  name="featureList"
                  rows={10}
                  value={currentFeatures}
                  onChange={(e) => setCurrentFeatures(e.target.value)}
                  placeholder={t("featureExamples")}
                  className="w-full p-4 bg-black/40 border border-[#0BFFFF]/30 text-white placeholder-gray-500 rounded-lg shadow-lg shadow-[#0BFFFF]/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#0BFFFF]/50 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isPending}
                className={`bg-[#0BFFFF] text-black hover:bg-white transition-all px-8 py-6 text-lg font-medium shadow-lg shadow-[#0BFFFF]/20 hover:scale-105 ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isPending
                  ? t("saving")
                  : hasExistingFeatures
                  ? t("updateAndContinue")
                  : t("saveAndContinue")}
              </Button>
            </div>

            {savedFeatureCount > 0 && (
              <div className="text-center text-[#0BFFFF] mt-4">
                <p>
                  {savedFeatureCount} {t("featuresSaved")}
                </p>
              </div>
            )}

            {state?.error && (
              <div className="text-red-500 text-center mt-4">
                {t("saveFailed")}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

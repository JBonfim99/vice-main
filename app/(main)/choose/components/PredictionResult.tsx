'use client';

import { useState, useEffect } from 'react';
import { type ChoiceResult } from '../actions/save-choice';

interface PredictionResultProps {
  result: ChoiceResult | null;
  onContinue: () => void;
}

export function PredictionResult({ result, onContinue }: PredictionResultProps) {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    if (result) {
      setAnimateIn(true);
    }
  }, [result]);

  if (!result) return null;

  const { selectedConcept, rejectedConcept, aiPrediction, isMatch } = result;
  const aiChoiceId = aiPrediction.predictedConceptId;
  const isFirstOptionAiChoice = selectedConcept.id === aiChoiceId;
  const isSecondOptionAiChoice = rejectedConcept.id === aiChoiceId;

  return (
    <div 
      className={`fixed inset-0 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onContinue} />
      
      <div className="relative w-full max-w-2xl bg-black/90 border border-[#0BFFFF]/30 rounded-xl p-8 z-50 flex flex-col gap-6 shadow-[0_0_15px_rgba(11,255,255,0.2)]">
        <div className="text-center mb-4">
          <h3 className="text-4xl font-bold text-white mb-2">   {isMatch ? "The AI prediction was correct" : "The AI prediction was wrong"}</h3>

        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* First Option */}
          <div className={`p-4 rounded-lg border ${isFirstOptionAiChoice 
            ? isMatch 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-red-500 bg-red-500/10' 
            : 'border-white/20 bg-white/5'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-white/90 font-medium">{selectedConcept.name}</p>

            </div>
          </div>
          
          {/* Second Option */}
          <div className={`p-4 rounded-lg border ${isSecondOptionAiChoice 
            ? isMatch 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-red-500 bg-red-500/10' 
            : 'border-white/20 bg-white/5'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-white/90 font-medium">{rejectedConcept.name}</p>

            </div>
          </div>
        </div>
        
        <div className="p-2 rounded-lg border border-white/20 bg-white/5">

          <div className="text-s text-white/70 p-3 rounded bg-white/5 max-h-24 overflow-y-auto"> 
            {aiPrediction.reasoning}
          </div>
        </div>
        
        <button
          onClick={onContinue}
          className="self-center px-8 py-2 bg-[#0BFFFF] text-black font-medium rounded-full hover:bg-white transition-colors mt-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Battle } from "../types/Battle";

interface BattleVotingProps {
  battle: Battle;
  onVote: (optionIndex: number) => void;
}

export const BattleVoting: React.FC<BattleVotingProps> = ({
  battle,
  onVote,
}) => {
  const { t } = useLanguage();
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionIndex: number) => {
    onVote(optionIndex);
    setHasVoted(true);
  };

  if (hasVoted) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-medium">{t("thankYouForVoting")}</p>
        <button
          onClick={() => setHasVoted(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t("voteAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {battle.options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleVote(index)}
          className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

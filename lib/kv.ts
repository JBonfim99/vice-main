import { redis } from "./redis";
import { Battle, BattleCreation, BattleVote } from "../types/battle";

export async function createBattle(battle: BattleCreation): Promise<Battle> {
  const id = crypto.randomUUID();
  const now = Date.now();

  const newBattle: Battle = {
    id,
    title: battle.title,
    description: battle.description,
    features: battle.features,
    votes: battle.features.reduce(
      (acc, feature) => ({
        ...acc,
        [feature]: {
          impact: 0,
          ease: 0,
          confidence: 0,
          total: 0,
        },
      }),
      {}
    ),
    created_at: now,
    comparison_count: 0,
    total_visitors: 0,
    settings: {
      compareImpact: battle.settings?.compareImpact ?? true,
      compareEase: battle.settings?.compareEase ?? true,
      compareConfidence: battle.settings?.compareConfidence ?? true,
      allowMultipleVotes: battle.settings?.allowMultipleVotes ?? false,
      showResults: battle.settings?.showResults ?? true,
    },
  };

  await redis.set(`battle:${id}`, JSON.stringify(newBattle));
  return newBattle;
}

export async function getBattle(id: string): Promise<Battle | null> {
  const battle = await redis.get(`battle:${id}`);
  return battle ? JSON.parse(battle) : null;
}

export async function recordVote(vote: BattleVote): Promise<void> {
  const battle = await getBattle(vote.battleId);
  if (!battle) throw new Error("Battle not found");

  // Incrementar votos para o vencedor
  const winnerVotes = battle.votes[vote.winner];
  winnerVotes[vote.type]++;
  winnerVotes.total++;

  // Atualizar contadores
  battle.comparison_count++;

  await redis.set(`battle:${vote.battleId}`, JSON.stringify(battle));
}

export async function incrementVisitor(battleId: string): Promise<void> {
  const battle = await getBattle(battleId);
  if (!battle) throw new Error("Battle not found");

  battle.total_visitors++;
  await redis.set(`battle:${battleId}`, JSON.stringify(battle));
}

export async function updateBattle(
  id: string,
  battle: BattleCreation
): Promise<Battle> {
  const existingBattle = await getBattle(id);
  if (!existingBattle) throw new Error("Battle not found");

  const updatedBattle: Battle = {
    ...existingBattle,
    title: battle.title,
    description: battle.description,
    features: battle.features,
    votes: battle.features.reduce(
      (acc, feature) => ({
        ...acc,
        [feature]: existingBattle.votes[feature] || {
          impact: 0,
          ease: 0,
          confidence: 0,
          total: 0,
        },
      }),
      {}
    ),
    settings: {
      compareImpact: battle.settings?.compareImpact ?? true,
      compareEase: battle.settings?.compareEase ?? true,
      compareConfidence: battle.settings?.compareConfidence ?? true,
      allowMultipleVotes: battle.settings?.allowMultipleVotes ?? false,
      showResults: battle.settings?.showResults ?? true,
    },
  };

  await redis.set(`battle:${id}`, JSON.stringify(updatedBattle));
  return updatedBattle;
}

export async function deleteBattle(id: string): Promise<void> {
  const exists = await redis.exists(`battle:${id}`);
  if (!exists) throw new Error("Battle not found");

  await redis.del(`battle:${id}`);
}

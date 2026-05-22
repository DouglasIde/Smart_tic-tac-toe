import type { Difficulty } from "./ai";
import type { GameRecord } from "./storage";

// Define o tipo de Rank
export type Rank = "Noob" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "GOD";

export interface RankInfo {
    rank: Rank;
    color: string;
    description: string;
}

interface DiffStat { 
    wins: number;
    losses: number;
    draws: number;
    total: number;
    diff: number;
}

// Contrutor inicial das estatísticas da pontuação
function emptyStat(): DiffStat {
    return {
        wins: 0,
        losses: 0,
        draws: 0,
        total: 0,
        diff: 0,
    };
}

// Pega o histórico de jogos e gera as estatísticas de cada dificuldade, bem como os totais gerais de vitórias, derrotas, empates e jogos jogados.
export function aggregate(history: GameRecord[]) {
    const by: Record<Difficulty, DiffStat> = {
        "very-easy": emptyStat(),
        "easy": emptyStat(),
        "medium": emptyStat(),
        "hard": emptyStat(),
        "impossible": emptyStat(),
    };
    for (const g of history) {
        const s = by[g.difficulty];
        if (g.outcome === "vitória") s.wins++;
        else if (g.outcome === "derrota") s.losses++;
        else s.draws++;
        s.total++;
        s.diff = s.wins - s.losses;
    }
    const totals = {
        wins: history.filter(h => h.outcome === "vitória").length,
        losses: history.filter(h => h.outcome === "derrota").length,
        draws: history.filter(h => h.outcome === "empate").length,
        total: history.length,
    };
    return { by, totals };
}
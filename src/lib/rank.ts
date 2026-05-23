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

// Calcula a porcentagem de vitórias em relação ao total de jogos, ou seja, a taxa de vitória.
function pct(a: number, b: number) {
    return b === 0 ? 0 : (a - b) / Math.max(b, 1);
}

// Com base nas estatísticas agregadas, a função computeRank determina o rank do jogador. 
// A lógica de classificação é baseada na quantidade total de jogos, na taxa de vitória e na dificuldade enfrentada. Por exemplo, para alcançar o rank "GOD", 
// o jogador deve ter jogado pelo menos 10 jogos na dificuldade "impossible" e ter uma taxa de vitória de pelo menos 50%.
export function computeRank(history: GameRecord[]): RankInfo {
    const {by, totals} = aggregate(history);

    for (const d of ["very-easy", "easy", "medium", "hard", "impossible"] as Difficulty[]) {
        const s = by[d];
        if (s.total >= 10 && pct(s.wins, s.losses) >= 0.5 && d === "impossible") {
            return {
                rank: "GOD",
                color: "from-amber-300 via fuchsia-400 to-cyan-300",
                description: "O mestre do impossível!"
            }
        }
    }
    // Diamante - Dificuldade: Impossible
    if (by.impossible.diff > 0 && by.impossible.total >= 5) {
        return {
            rank: "Diamond",
            color: "from-cyan-200 to-blue-400",
            description: "O diamante é a pedra mais dura, mas você é mais duro que ela!"
        }
    }
    // Platina - +50% wins no Dificil
    if (by.hard.total >= 0 && pct(by.hard.wins, by.hard.losses) >= 0.5) {
        return {
            rank: "Platinum",
            color: "from-slate-200 to-cyan-300",
            description: "Você é tão resistente quanto a platina!"
        }
    }
    // Ouro - Diferença maior no Dificil
    if (by.hard.diff > 0){
        return {
            rank: "Gold",
            color: "from-yellow-200 to-amber-400",
            description: "O ouro é valioso, mas sua habilidade é ainda mais!"
        }
    }
    // Prata - +40% diferença no Médio OU +10 vítórias de diferença no Difícil
    if (by.medium.diff > 0 || by.hard.diff >= 10) {
        return {
            rank: "Silver",
            color: "from-zinc-200 to-slate-400",
            description: "Você é Prata!"
        }
    }
    // Bronze - Mais vitórias no Médio OU +40 de diferença vitorias no Fácil/Muito Fácil
    if (by.medium.diff > 0 || (by.easy.diff + by["very-easy"].diff) >= 40) {
        return {
            rank: "Bronze",
            color: "from-orange-200 to-amber-600",
            description: "Você é Bronze, Aceita!"
        }
    }
    // Noob - Default
    return {
        rank: "Noob",
        color: "from-emerald-200 to-teal-400",
        description: totals.total === 0 ? "Comece a sua jornada!!!" : "Continue treinando, uma hora VOCE TEM QUE MELHORAR!!!"
    };
}

// Mapeamento de rótulos para cada dificuldade, utilizado para exibir as dificuldades de forma mais amigável na interface do usuário.
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
    "very-easy": "Muito Fácil",
    "easy": "Fácil",
    "medium": "Médio",
    "hard": "Difícil",
    "impossible": "Impossível",
};

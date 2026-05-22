import type { Difficulty } from "./ai";

// Define o tipo Outcome, que representa o resultado de um jogo, podendo ser "vitória", "derrota" ou "empate".
export type Outcome = "vitória" | "derrota" | "empate"; 

// Interface para um registro de jogo, contendo um ID único, a dificuldade do jogo, o resultado (outcome) e a data em que o jogo foi jogado.
export interface GameRecord {
    id: string;
    difficulty: Difficulty;
    outcome: Outcome;
    date: number;
}

// Interface para as estatísticas do usuário, incluindo o nickname e um histórico de jogos. 
// O histórico é um array de GameRecord, que contém informações sobre cada jogo jogado pelo usuário, como a dificuldade, o resultado e a data do jogo.
export interface UserStats {
    nickname: string;
    history: GameRecord[];
}

// Chaves de armazenamento para localStorage, prefixadas com "ttt:" para evitar conflitos com outros dados armazenados no navegador
const KEY_USER = 'ttt:nickname';
const KEY_LAST_USER = 'ttt:last-nickname';
const KEY_THEME = 'ttt:theme';

// Retorna o nickname atual do usuário, ou null se não houver um nickname
export function getNickname(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY_USER);
}

// Atualiza o nickname do usuário e também o armazena como o último nickname usado
export function setNickname(n: string) {
    localStorage.setItem(KEY_USER, n);
    localStorage.setItem(KEY_LAST_USER, n);
}

// Retorna o último nickname usado, ou null se não houver um nickname armazenado
export function getLastNickname(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY_LAST_USER);
}

// Limpa o nickname atual do usuário, mas mantém o último nickname usado para referência futura
export function clearLastNickname() {
    localStorage.removeItem(KEY_LAST_USER);
}

// Gera a chave de armazenamento para as estatísticas do usuário com base no nickname, garantindo que seja case-insensitive
function statsKey(nick: string) {
    return `ttt:stats:${nick.toLowerCase()}`;
}

// Retorna as estatísticas do usuário com base no nickname, ou um objeto vazio se não houver estatísticas armazenadas
export function getStats(nick: string): UserStats {
    if (typeof window === "undefined") return { nickname: nick, history: [] };
    const raw = localStorage.getItem(statsKey(nick));
    if (!raw) return { nickname: nick, history: []};
    try {
        return JSON.parse(raw);
    } catch {
        return { nickname: nick, history: []};
    }
}

// Adiciona um novo jogo ao histórico do usuário, garantindo que o histórico seja limitado a 500 registros para evitar crescimento excessivo do armazenamento
export function addGame(nick: string, difficulty: Difficulty, outcome: Outcome) {
    const s = getStats(nick);
    s.history.unshift({
        id: crypto.randomUUID(),
        difficulty,
        outcome,
        date: Date.now(),
    });
    s.history = s.history.slice(0, 500);
    localStorage.setItem(statsKey(nick), JSON.stringify(s));
}

// Limpa as estatísticas do usuário, removendo o item correspondente do localStorage, mas mantendo o nickname e o último nickname para referência futura
export function clearStats(nick: string) {
    localStorage.removeItem(statsKey(nick));
}

// Retorna a preferência de tema do usuário, que pode ser "light", "dark" ou "system". Se o código estiver sendo executado em um ambiente sem acesso ao localStorage 
// (como durante a renderização no servidor), retorna "system" como valor padrão. 
export type ThemePref = "light" | "dark" | "system";
export function getTheme(): ThemePref {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(KEY_THEME) as ThemePref) || "system";
}

// Define a preferência de tema do usuário, armazenando-a no localStorage para persistência. O valor deve ser "light", "dark" ou "system".
export function setTheme(t: ThemePref) {
    localStorage.setItem(KEY_THEME, t);
}
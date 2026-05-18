import type { Difficulty } from "./ai";

export type Outcome = "vitória" | "derrota" | "empate"; 

export interface GameRecord {
    id: string;
    difficulty: Difficulty;
    outcome: Outcome;
    date: number;
}

export interface UserStats {
    nickname: string;
    history: GameRecord[];
}

const KEY_USER = 'ttt:nickname';
const KEY_LAST_USER = 'ttt:last-nickname';
const KEY_THEME = 'ttt:theme';

export function getNickname(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY_USER);
}

export function setNickname(n: string) {
    localStorage.setItem(KEY_USER, n);
    localStorage.setItem(KEY_LAST_USER, n);
}

export function getLastNickname(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY_LAST_USER);
}

export function clearLastNickname() {
    localStorage.removeItem(KEY_LAST_USER);
}

function statsKey(nick: string) {
    return `ttt:stats:${nick.toLowerCase()}`;
}

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

export function clearStats(nick: string) {
    localStorage.removeItem(statsKey(nick));
}

export type ThemePref = "light" | "dark" | "system";
export function getTheme(): ThemePref {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(KEY_THEME) as ThemePref) || "system";
}

export function setTheme(t: ThemePref) {
    localStorage.setItem(KEY_THEME, t);
}
import { Link, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getNickname, clearNickname } from '../lib/storage';
import { Moon, Sun, Monitor, LogOut, BarChart3 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";


export function Header() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [nick, setNick] = useState<string | null>(null);
    useEffect(() => { setNick(getNickname()); }, []);

    const cycle = () => {
        const next = theme === "light" ? "dark": theme === "dark" ? "system" : "light";
        setTheme(next);
    };
    
    const Icon = theme === "light" ?
        Sun : theme === "dark" ?
        Moon : Monitor;

    return (
        <header className="w-full">
            <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="size-9 rounded-xl bg-gradient-zero shadow-[var(--shadow-aero)] grid place-items-center text-white font-bold animate-float">
                        X
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-bold tracking-tight">
                            Jogo da Velha
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Jogar
                        </p>
                    </div>
                </Link>
                <nav className="flex items-center gap-2">
                    {nick && (
                        <Link to="/profile"
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium glass hover:scale-[1.02] transition">
                                <BarChart3 className="size-3.5" /> 
                                Histórico
                            </Link>
                    )}
                    <button onClick={cycle}
                        arial-label="Alterar o tema"
                        className="size-9 rounded-lg glass place-items-center hover:scale-105 transition"
                        title={`Tema: ${theme}`}
                    >
                        <Icon className="size-4" />
                    </button>
                    {nick && (
                        <button 
                            onClick={() => { clearNickname(); 
                            router.navigate({ to: "/"});
                            router.invalidate(); }}
                            arial-label="Sair"
                            className="size-9 rounded-lg glass grid place-items-center hover:scale-105 transition"
                            title="Sair"
                        >
                            <LogOut className="size-4" />
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
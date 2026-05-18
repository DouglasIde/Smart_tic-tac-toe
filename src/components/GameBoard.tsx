import { useEffect, useState, useCallback } from "react";
import { aiMove, checkWinner, isDraw, type Board, type Cell, type Difficulty } from '@/lib/ai';
import { addGame } from "@/lib/storage";
import { DIFFICULTY_LABEL } from "@/lib/rank";

interface Props {
    nickname: string;
    difficulty: Difficulty;
    onResult?: () => void;
}

const empty = (): Board => Array(9).fill(null);
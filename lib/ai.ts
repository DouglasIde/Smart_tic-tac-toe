export type Cell = 'X' | 'O' | null;
export type Board = Cell[];
export type Difficulty = 'very-easy' |'easy' | 'medium' | 'hard' | 'impossible';

// Array com as Linhas vencedoras
const Lines: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Verifica se já existe um vencedor no tabuleiro
export function checkWinner(b: Board):
  { winner: Cell; line: number[] | null } {
    for (const l of Lines) {
      const [a, b1, c] = l;
      if (b[a] && b[a] === b[b1] && b[a] === b[c])
        return { winner: b[a], line: l};
    }
    return { winner: null, line: null };
  }

// Verifica se o jogo terminou empatado
export function isDraw(b: Board) {
  return !checkWinner(b).winner && b.every((c) => c !== null);
}

// Retorna os índices dos espaços vazios no tabuleiro
function emptyIndices(b: Board) {
  return b.map((c, i) => (c === null ? i: -1))
  .filter((i) => i >= 0);
}

// Utilizando o ALGORITMO MINIMAX
function minimax(b: Board, isAI: boolean): number {
  const { winner } = checkWinner(b);
  if (winner === 'X') return -10;
  if (winner === 'O') return 10;
  if (isDraw(b)) return 0;

  const moves = emptyIndices(b);
  let best = isAI ? -Infinity : Infinity;
  for (const i of moves) {
    b[i] = isAI ? "O" : "X";
    const score = minimax(b, !isAI);
    b[i] = null;
    best = isAI ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

// Função para o AI escolher a melhor jogada
function bestMove(b: Board): number {
  const moves = emptyIndices(b);
  let best = -Infinity;
  let move = moves[0];
  for (const i of moves) {
    b[i] = "O";
    const score = minimax(b, false);
    b[i] = null;
    if (score > best) {
      best = score;
      move = i;
    }
  }
  return move;
}

// Fazendo a IA escolher as piores jogadas para as dificuldades inferiores
function worstMove(b: Board): number {
  const moves = emptyIndices(b);
  let worst = Infinity;
  let move = moves[0];
  for (const i of moves){
    b[i] = "O";
    const score = minimax(b, false);
    b[i] = null;
    if (score < worst) {
      worst = score;
      move = i;
    }
  }
  return move;
}

// Fazendo a IA jogar aleatoriamente
function randomMove(b: Board): number {
  const moves = emptyIndices(b);
  return moves[Math.floor(Math.random() * moves.length)];
}

// Qual a jogada que a IA irá realizar
export function aiMove(board: Board, d: Difficulty): number {
  const b = [...board];
  switch (d) {
    case "very-easy":
      return Math.random() < 0.85 ? worstMove(b) : randomMove(b);
    case "easy":
      return Math.random() < 0.2 ? bestMove(b) : randomMove(b);
    case "medium":
      return Math.random() < 0.5 ? bestMove(b) : randomMove(b);
    case "hard":
      return Math.random() < 0.25 ? randomMove(b) : bestMove(b);
    case "impossible":
    default:
      return bestMove(b);
  }
} 
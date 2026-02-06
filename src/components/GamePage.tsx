import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { MatchRecord } from '@/pages/Index';

interface GamePageProps {
  player1: string;
  player2: string;
  onGameEnd: (match: MatchRecord) => void;
  isAIMode?: boolean;
}

interface Cell {
  x: number;
  y: number;
  value: 'X' | 'O';
}

const GamePage = ({ player1, player2, onGameEnd, isAIMode = false }: GamePageProps) => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<Cell[]>([]);
  const [moves, setMoves] = useState<Array<{ x: number; y: number; player: 'X' | 'O' }>>([]);

  const CELL_SIZE = 100;
  const GRID_SIZE = 5;

  const checkWinner = (newCells: Cell[], lastMove: Cell): boolean => {
    const directions = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
    ];

    for (const { dx, dy } of directions) {
      const line: Cell[] = [lastMove];

      for (let i = 1; i < 5; i++) {
        const cell = newCells.find(
          c => c.x === lastMove.x + dx * i && c.y === lastMove.y + dy * i && c.value === lastMove.value
        );
        if (cell) line.push(cell);
        else break;
      }

      for (let i = 1; i < 5; i++) {
        const cell = newCells.find(
          c => c.x === lastMove.x - dx * i && c.y === lastMove.y - dy * i && c.value === lastMove.value
        );
        if (cell) line.unshift(cell);
        else break;
      }

      if (line.length >= 5) {
        setWinningLine(line);
        const winnerName = lastMove.value === 'X' ? player1 : player2;
        setWinner(winnerName);
        
        const match: MatchRecord = {
          id: Date.now().toString(),
          player1,
          player2,
          winner: winnerName,
          date: new Date().toISOString(),
          board: new Map(newCells.map(c => [`${c.x},${c.y}`, c.value])),
          moves: [...moves, { x: lastMove.x, y: lastMove.y, player: lastMove.value }],
        };
        
        setTimeout(() => onGameEnd(match), 2000);
        return true;
      }
    }
    return false;
  };

  const makeAIMove = (currentCells: Cell[]) => {
    const calculateScore = (cells: Cell[], move: Cell, depth: number): number => {
      const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
      ];

      let maxScore = 0;
      for (const { dx, dy } of directions) {
        let count = 1;
        let openEnds = 0;

        for (let i = 1; i < 5; i++) {
          const cell = cells.find(c => c.x === move.x + dx * i && c.y === move.y + dy * i);
          if (!cell) {
            openEnds++;
            break;
          }
          if (cell.value === move.value) count++;
          else break;
        }

        for (let i = 1; i < 5; i++) {
          const cell = cells.find(c => c.x === move.x - dx * i && c.y === move.y - dy * i);
          if (!cell) {
            openEnds++;
            break;
          }
          if (cell.value === move.value) count++;
          else break;
        }

        const lineScore = count >= 5 ? 10000 : count === 4 ? 1000 : count === 3 ? 100 : count === 2 ? 10 : 1;
        maxScore = Math.max(maxScore, lineScore * (openEnds + 1));
      }

      return maxScore;
    };

    const existingCells = currentCells.length > 0 ? currentCells : [{ x: 0, y: 0, value: 'X' }];
    const allX = existingCells.map(c => c.x);
    const allY = existingCells.map(c => c.y);
    const minX = Math.min(...allX) - 2;
    const maxX = Math.max(...allX) + 2;
    const minY = Math.min(...allY) - 2;
    const maxY = Math.max(...allY) + 2;

    const candidates: Array<{ x: number; y: number; score: number }> = [];

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (currentCells.some(c => c.x === x && c.y === y)) continue;

        const hasNeighbor = currentCells.some(
          c => Math.abs(c.x - x) <= 2 && Math.abs(c.y - y) <= 2
        );
        if (!hasNeighbor && currentCells.length > 0) continue;

        const aiMove: Cell = { x, y, value: 'O' };
        const playerMove: Cell = { x, y, value: 'X' };

        const aiScore = calculateScore([...currentCells, aiMove], aiMove, 0);
        const blockScore = calculateScore([...currentCells, playerMove], playerMove, 0);

        candidates.push({ x, y, score: aiScore * 1.2 + blockScore });
      }
    }

    if (candidates.length === 0) {
      return { x: 0, y: 0 };
    }

    candidates.sort((a, b) => b.score - a.score);
    const topCandidates = candidates.slice(0, Math.min(3, candidates.length));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)];
  };

  const handleCellClick = (x: number, y: number) => {
    if (winner) return;
    if (isAIMode && currentPlayer === 'O') return;
    if (cells.some(c => c.x === x && c.y === y)) return;

    const newCell: Cell = { x, y, value: currentPlayer };
    const newCells = [...cells, newCell];
    setCells(newCells);
    setMoves(prev => [...prev, { x, y, player: currentPlayer }]);

    if (!checkWinner(newCells, newCell)) {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  useEffect(() => {
    if (isAIMode && currentPlayer === 'O' && !winner) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(cells);
        handleCellClick(aiMove.x, aiMove.y);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, isAIMode, winner]);

  const handleReset = () => {
    setCells([]);
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setMoves([]);
    setViewportOffset({ x: 0, y: 0 });
  };

  const renderGrid = () => {
    const gridCells = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cellData = cells.find(c => c.x === x && c.y === y);
        const isWinning = winningLine.some(c => c.x === x && c.y === y);

        gridCells.push(
          <div
            key={`${x},${y}`}
            className={`border border-purple-200 flex items-center justify-center text-4xl font-bold cursor-pointer transition-all hover:bg-purple-50 ${
              isWinning ? 'bg-gradient-to-br from-yellow-200 to-orange-200 animate-pulse-soft' : 'bg-white'
            }`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
            onClick={() => handleCellClick(x, y)}
          >
            {cellData && (
              <span className={`animate-scale-in ${cellData.value === 'X' ? 'text-purple-600' : 'text-blue-600'}`}>
                {cellData.value === 'X' ? '❌' : '⭕'}
              </span>
            )}
          </div>
        );
      }
    }
    return gridCells;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6 flex-col lg:flex-row">
        <Card className="flex-1 p-6 shadow-xl border-0">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Игровое поле</h2>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPlayer === 'X' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <span className="text-xl">❌</span>
                  <span className="font-semibold">{player1}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPlayer === 'O' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-xl">⭕</span>
                  <span className="font-semibold">{player2}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <Icon name="RotateCcw" size={18} />
              Новая игра
            </Button>
          </div>

          {winner && (
            <div className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-400 animate-scale-in">
              <p className="text-xl font-bold text-center">
                🎉 Победитель: {winner}! 🎉
              </p>
            </div>
          )}

          <div className="grid grid-cols-5 gap-0 w-fit mx-auto rounded-lg overflow-hidden border-4 border-purple-200">
            {renderGrid()}
          </div>
        </Card>

        <Card className="lg:w-80 p-6 shadow-xl border-0">
          <h3 className="text-xl font-bold mb-4">История ходов</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {moves.map((move, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 animate-slide-up"
              >
                <span className="text-xl">{move.player === 'X' ? '❌' : '⭕'}</span>
                <div className="flex-1">
                  <p className="font-semibold">{move.player === 'X' ? player1 : player2}</p>
                  <p className="text-sm text-gray-500">
                    Ход {index + 1}: ({move.x}, {move.y})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GamePage;
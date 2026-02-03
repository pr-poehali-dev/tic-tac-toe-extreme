import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { MatchRecord } from '@/pages/Index';

interface GamePageProps {
  player1: string;
  player2: string;
  onGameEnd: (match: MatchRecord) => void;
}

interface Cell {
  x: number;
  y: number;
  value: 'X' | 'O';
}

const GamePage = ({ player1, player2, onGameEnd }: GamePageProps) => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<Cell[]>([]);
  const [moves, setMoves] = useState<Array<{ x: number; y: number; player: 'X' | 'O' }>>([]);

  const CELL_SIZE = 80;
  const GRID_SIZE = 15;

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

  const handleCellClick = (x: number, y: number) => {
    if (winner) return;
    if (cells.some(c => c.x === x && c.y === y)) return;

    const newCell: Cell = { x, y, value: currentPlayer };
    const newCells = [...cells, newCell];
    setCells(newCells);
    setMoves(prev => [...prev, { x, y, player: currentPlayer }]);

    if (!checkWinner(newCells, newCell)) {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

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
    const startX = Math.floor(viewportOffset.x / CELL_SIZE) - GRID_SIZE;
    const startY = Math.floor(viewportOffset.y / CELL_SIZE) - GRID_SIZE;

    for (let y = startY; y < startY + GRID_SIZE * 2; y++) {
      for (let x = startX; x < startX + GRID_SIZE * 2; x++) {
        const cellData = cells.find(c => c.x === x && c.y === y);
        const isWinning = winningLine.some(c => c.x === x && c.y === y);

        gridCells.push(
          <div
            key={`${x},${y}`}
            className={`absolute border border-purple-200 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all hover:bg-purple-50 ${
              isWinning ? 'bg-gradient-to-br from-yellow-200 to-orange-200 animate-pulse-soft' : 'bg-white'
            }`}
            style={{
              left: x * CELL_SIZE - viewportOffset.x,
              top: y * CELL_SIZE - viewportOffset.y,
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

          <div className="relative w-full h-[600px] overflow-hidden rounded-lg border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            {renderGrid()}
          </div>

          <div className="mt-4 flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => setViewportOffset(p => ({ x: p.x - CELL_SIZE * 3, y: p.y }))}
            >
              <Icon name="ChevronLeft" size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewportOffset(p => ({ x: p.x, y: p.y - CELL_SIZE * 3 }))}
            >
              <Icon name="ChevronUp" size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewportOffset(p => ({ x: p.x, y: p.y + CELL_SIZE * 3 }))}
            >
              <Icon name="ChevronDown" size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewportOffset(p => ({ x: p.x + CELL_SIZE * 3, y: p.y }))}
            >
              <Icon name="ChevronRight" size={18} />
            </Button>
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

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { MatchRecord } from '@/pages/Index';

interface HistoryPageProps {
  matches: MatchRecord[];
}

const HistoryPage = ({ matches }: HistoryPageProps) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMatchBoard = (match: MatchRecord) => {
    const cells = Array.from(match.board.entries()).map(([key, value]) => {
      const [x, y] = key.split(',').map(Number);
      return { x, y, value };
    });

    const minX = Math.min(...cells.map(c => c.x));
    const maxX = Math.max(...cells.map(c => c.x));
    const minY = Math.min(...cells.map(c => c.y));
    const maxY = Math.max(...cells.map(c => c.y));

    const grid = [];
    for (let y = minY; y <= maxY; y++) {
      const row = [];
      for (let x = minX; x <= maxX; x++) {
        const cell = cells.find(c => c.x === x && c.y === y);
        row.push(
          <div
            key={`${x},${y}`}
            className="w-12 h-12 border border-gray-300 flex items-center justify-center text-xl bg-white"
          >
            {cell && (cell.value === 'X' ? '❌' : '⭕')}
          </div>
        );
      }
      grid.push(
        <div key={y} className="flex">
          {row}
        </div>
      );
    }

    return <div className="inline-block">{grid}</div>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border-0 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            История матчей
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📜</div>
              <p className="text-xl text-gray-500">История матчей пуста</p>
              <p className="text-sm text-gray-400 mt-2">Сыграйте первую игру!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {matches.map((match, index) => (
                <Card
                  key={match.id}
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedMatch(match)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎮</span>
                        <span className="font-bold text-lg">Матч #{matches.length - index}</span>
                      </div>
                      {match.winner && (
                        <span className="text-xl">🏆</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">❌</span>
                        <span className={match.winner === match.player1 ? 'font-bold text-purple-600' : ''}>
                          {match.player1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⭕</span>
                        <span className={match.winner === match.player2 ? 'font-bold text-blue-600' : ''}>
                          {match.player2}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <p className="text-sm text-gray-500">{formatDate(match.date)}</p>
                      <Icon name="ChevronRight" size={18} className="text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Просмотр матча</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedMatch(null)}>
                <Icon name="X" size={24} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Игрок X</p>
                    <p className="text-xl font-bold flex items-center gap-2">
                      <span>❌</span> {selectedMatch.player1}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Игрок O</p>
                    <p className="text-xl font-bold flex items-center gap-2">
                      <span>⭕</span> {selectedMatch.player2}
                    </p>
                  </div>
                </div>

                {selectedMatch.winner && (
                  <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-400">
                    <p className="text-xl font-bold text-center">
                      🏆 Победитель: {selectedMatch.winner}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-4">Игровое поле</h3>
                  <div className="overflow-x-auto pb-4">
                    <div className="flex justify-center">
                      {renderMatchBoard(selectedMatch)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">История ходов</h3>
                  <div className="grid sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {selectedMatch.moves.map((move, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded flex items-center gap-3">
                        <span className="text-xl">{move.player === 'X' ? '❌' : '⭕'}</span>
                        <div>
                          <p className="font-medium">Ход {index + 1}</p>
                          <p className="text-sm text-gray-500">
                            {move.player === 'X' ? selectedMatch.player1 : selectedMatch.player2}: ({move.x}, {move.y})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                  {formatDate(selectedMatch.date)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

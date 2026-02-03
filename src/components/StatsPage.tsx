import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchRecord } from '@/pages/Index';

interface StatsPageProps {
  matches: MatchRecord[];
  player1: string;
  player2: string;
}

const StatsPage = ({ matches, player1, player2 }: StatsPageProps) => {
  const player1Wins = matches.filter(m => m.winner === player1).length;
  const player2Wins = matches.filter(m => m.winner === player2).length;
  const totalGames = matches.length;

  const player1WinRate = totalGames > 0 ? ((player1Wins / totalGames) * 100).toFixed(1) : '0';
  const player2WinRate = totalGames > 0 ? ((player2Wins / totalGames) * 100).toFixed(1) : '0';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border-0 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Статистика
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-200 animate-slide-up">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-2">🎮</div>
                <p className="text-3xl font-bold text-purple-600">{totalGames}</p>
                <p className="text-sm text-gray-600 mt-1">Всего игр</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-2">⚡</div>
                <p className="text-3xl font-bold text-blue-600">{matches.length > 0 ? matches[0].moves.length : 0}</p>
                <p className="text-sm text-gray-600 mt-1">Ходов в последней игре</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-100 to-pink-50 border-2 border-pink-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-2">🏆</div>
                <p className="text-3xl font-bold text-pink-600">
                  {player1Wins > player2Wins ? player1 : player2Wins > player1Wins ? player2 : '—'}
                </p>
                <p className="text-sm text-gray-600 mt-1">Лидер</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-purple-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  {player1}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Побед</span>
                      <span className="text-2xl font-bold text-purple-600">{player1Wins}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000"
                        style={{ width: `${player1WinRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{player1WinRate}%</p>
                      <p className="text-xs text-gray-600">Винрейт</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-600">{totalGames - player1Wins}</p>
                      <p className="text-xs text-gray-600">Поражений</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⭕</span>
                  {player2}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Побед</span>
                      <span className="text-2xl font-bold text-blue-600">{player2Wins}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
                        style={{ width: `${player2WinRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{player2WinRate}%</p>
                      <p className="text-xs text-gray-600">Винрейт</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-600">{totalGames - player2Wins}</p>
                      <p className="text-xs text-gray-600">Поражений</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {totalGames === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-xl text-gray-500">Статистика появится после первой игры</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;

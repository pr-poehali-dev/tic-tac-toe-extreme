import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface LoginPageProps {
  onLogin: (player1: string, player2: string, isAIMode: boolean) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('pvp');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameMode === 'ai') {
      if (player1.trim()) {
        onLogin(player1.trim(), 'ИИ Бот 🤖', true);
      }
    } else {
      if (player1.trim() && player2.trim()) {
        onLogin(player1.trim(), player2.trim(), false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg animate-pulse-soft">
              🎮
            </div>
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Крестики-Нолики ∞
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Выберите режим и начните матч
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              type="button"
              variant={gameMode === 'pvp' ? 'default' : 'outline'}
              onClick={() => setGameMode('pvp')}
              className="h-20 flex flex-col gap-2"
            >
              <span className="text-2xl">👥</span>
              <span className="text-sm font-semibold">Игрок vs Игрок</span>
            </Button>
            <Button
              type="button"
              variant={gameMode === 'ai' ? 'default' : 'outline'}
              onClick={() => setGameMode('ai')}
              className="h-20 flex flex-col gap-2"
            >
              <span className="text-2xl">🤖</span>
              <span className="text-sm font-semibold">Игрок vs ИИ</span>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span className="text-2xl">❌</span>
                <span>Игрок 1 (X)</span>
              </label>
              <Input
                type="text"
                placeholder="Имя первого игрока"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="h-12 text-base border-2 focus:border-purple-400 transition-all"
                required
              />
            </div>

            {gameMode === 'pvp' && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="text-2xl">⭕</span>
                  <span>Игрок 2 (O)</span>
                </label>
                <Input
                  type="text"
                  placeholder="Имя второго игрока"
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  className="h-12 text-base border-2 focus:border-blue-400 transition-all"
                  required
                />
              </div>
            )}

            {gameMode === 'ai' && (
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 flex items-center gap-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <p className="font-semibold text-blue-900">Соперник: ИИ Бот</p>
                  <p className="text-sm text-blue-700">Умный противник с продвинутой стратегией</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Icon name="Play" size={20} className="mr-2" />
              Начать игру
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
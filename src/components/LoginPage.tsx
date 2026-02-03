import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface LoginPageProps {
  onLogin: (player1: string, player2: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      onLogin(player1.trim(), player2.trim());
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
            Введите имена игроков для начала матча
          </CardDescription>
        </CardHeader>
        <CardContent>
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

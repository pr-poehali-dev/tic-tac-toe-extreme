import { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage';
import GamePage from '@/components/GamePage';
import HistoryPage from '@/components/HistoryPage';
import StatsPage from '@/components/StatsPage';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface Player {
  name: string;
}

export interface GameState {
  board: Map<string, 'X' | 'O'>;
  currentPlayer: 'X' | 'O';
  player1: string;
  player2: string;
}

export interface MatchRecord {
  id: string;
  player1: string;
  player2: string;
  winner: string | null;
  date: string;
  board: Map<string, 'X' | 'O'>;
  moves: Array<{ x: number; y: number; player: 'X' | 'O' }>;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'game' | 'history' | 'stats'>('login');
  const [players, setPlayers] = useState<{ player1: string; player2: string } | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);

  useEffect(() => {
    const savedMatches = localStorage.getItem('tictactoe_matches');
    if (savedMatches) {
      try {
        const parsed = JSON.parse(savedMatches);
        const converted = parsed.map((m: any) => ({
          ...m,
          board: new Map(Object.entries(m.board || {})),
        }));
        setMatches(converted);
      } catch (e) {
        console.error('Failed to load matches', e);
      }
    }
  }, []);

  const handleLogin = (player1: string, player2: string) => {
    setPlayers({ player1, player2 });
    setCurrentPage('game');
  };

  const handleGameEnd = (match: MatchRecord) => {
    const newMatches = [match, ...matches];
    setMatches(newMatches);
    
    const serialized = newMatches.map(m => ({
      ...m,
      board: Object.fromEntries(m.board),
    }));
    localStorage.setItem('tictactoe_matches', JSON.stringify(serialized));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {currentPage !== 'login' && players && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Крестики-Нолики ∞
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={currentPage === 'game' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('game')}
                className="gap-2"
                size="sm"
              >
                <Icon name="Gamepad2" size={18} />
                <span className="hidden sm:inline">Игра</span>
              </Button>
              <Button
                variant={currentPage === 'history' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('history')}
                className="gap-2"
                size="sm"
              >
                <Icon name="History" size={18} />
                <span className="hidden sm:inline">История</span>
              </Button>
              <Button
                variant={currentPage === 'stats' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('stats')}
                className="gap-2"
                size="sm"
              >
                <Icon name="BarChart3" size={18} />
                <span className="hidden sm:inline">Статистика</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage('login');
                  setPlayers(null);
                }}
                className="gap-2"
                size="sm"
              >
                <Icon name="LogOut" size={18} />
                <span className="hidden sm:inline">Выход</span>
              </Button>
            </div>
          </div>
        </nav>
      )}

      <div className={currentPage !== 'login' ? 'pt-20' : ''}>
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        {currentPage === 'game' && players && (
          <GamePage
            player1={players.player1}
            player2={players.player2}
            onGameEnd={handleGameEnd}
          />
        )}
        {currentPage === 'history' && (
          <HistoryPage matches={matches} />
        )}
        {currentPage === 'stats' && players && (
          <StatsPage matches={matches} player1={players.player1} player2={players.player2} />
        )}
      </div>
    </div>
  );
};

export default Index;

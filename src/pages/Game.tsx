import { useState } from 'react';
import Board from '../components/Board';
import { useLocation, Link } from 'react-router-dom';
import { SquareValue } from '../types';
import '../styles/Game.scss';

interface LocationState {
    username: string;
  }

const Game = () => {
    const location = useLocation();
    const state = location.state as LocationState; // Typowanie stanu przekazanego z Home
  
    const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState<number>(0);
    const [xIsNext, setXIsNext] = useState<boolean>(true);
    const [isWaitingForOpponent, setIsWaitingForOpponent] = useState<boolean>(true);

    const handleClick = (i: number) => {
        const historyPoint = history.slice(0, stepNumber + 1);
        const current = historyPoint[stepNumber];
        const squares = [...current];

        if (calculateWinner(squares) || squares[i])
            return;

        squares[i] = xIsNext ? 'X' : 'O';
        setHistory([...historyPoint, squares]);
        setStepNumber(historyPoint.length);
        setXIsNext(!xIsNext);
    };

    const current = history[stepNumber];
    const winner = calculateWinner(current);

    let status: string;
    if (winner) {
        status = `Winner: ${winner}`;
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

  return (
        <div className="game-container">
        <div className="game-header">
            <Link to="/" className="back-link">Powrót do strony głównej</Link>
            <div className="username">Gracz: {state?.username || 'Anonim'}</div>
        </div>
        {isWaitingForOpponent ? (
            <div className="waiting-screen">
            Oczekiwanie na dołączenie drugiego gracza...
            </div>
        ) : (
            <div className="game">
            <div className="game-board">
                <Board squares={current} onClick={handleClick} />
            </div>
            <div className="game-info">
                <div>{status}</div>
            </div>
            </div>
        )}
        </div>
    );
};

function calculateWinner(squares: SquareValue[]): SquareValue {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
        }
    }
    return null;
}

export default Game;

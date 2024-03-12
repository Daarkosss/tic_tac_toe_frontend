import { useState } from 'react';
import Board from '../components/Board';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { SquareValue } from '../types';
import { store } from '../store/Store';
import '../styles/Game.scss';


const Game = observer(() => {  
    const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState<number>(0);
    const [xIsNext, setXIsNext] = useState<boolean>(true);

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

    const deletePlayerFromRoom = () => {
        if (store.room)
            store.deletePlayerFromRoom(store.room.roomName, store.username);
    };

    return (
        <div className="game-container">
        <div className="game-header">
            <Link to="/" className="back-link" onClick={deletePlayerFromRoom}>Powrót do strony głównej</Link>
            <div className="username">Gracz: {store.username || 'Anonim'}</div>
        </div>
        {!store.gameStarted ? (
            <div className="waiting-screen">
            Oczekiwanie na dołączenie drugiego gracza...
            </div>
        ) : (
            <div className="game">
            <div className="game-board">
                <Board squares={current} onClick={handleClick} />
            </div>
            <div className="game-info">
                <div>{store.room?.roomName}</div>
                <div>{store.room?.player1} vs {store.room?.player2}</div>
                <div>{status}</div>
            </div>
            </div>
        )}
        </div>
    );
});

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

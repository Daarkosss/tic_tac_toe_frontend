import Board from '../components/Board';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { SquareValue } from '../types';
import { store } from '../store/Store';
import '../styles/Game.scss';


const Game = observer(() => { 
    const handleClick = (i: number) => {
        if (!store.isYourTurn || store.board[i] || calculateWinner(store.board)) 
            return;

        store.sendMove(i);
    };

    const current = Array(9).fill(null);
    store.moves.forEach(move => {
        current[move.position] = move.value;
    });

    const deletePlayerFromRoom = () => {
        if (store.room)
            store.deletePlayerFromRoom(store.room.roomName, store.username);
    };

    return (
        <div className="game-container">
        <div className="game-header">
            <Link to="/" className="back-link" onClick={deletePlayerFromRoom}>Powrót do strony głównej</Link>
            <div className="username">Grasz jako: {store.username || 'Anonim'}</div>
        </div>
        {!store.gameStarted ? (
            <div className="waiting-screen">
            Oczekiwanie na dołączenie drugiego gracza...
            </div>
        ) : (
            <div className="game">
            <div className="game-board">
                <Board onClick={handleClick} />
            </div>
            <div className="game-info">
                <div>{store.room?.roomName}</div>
                <div>{store.room?.player1} vs {store.room?.player2}</div>
                {/* <div>{status}</div> */}
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

import Board from '../components/Board';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { store } from '../store/Store';
import '../styles/Game.scss';
import { useEffect } from 'react';


const Game = observer(() => {

    useEffect(() => {
        store.restoreRoom();
        if (!store.room) {
            store.chooseRoomForGame();
        }
    }, []);

    const handleClick = (i: number, j: number) => {
        if (store.isGameOver || !store.isYourTurn || store.board[i][j]) {
            return;
        }

        store.sendMove(i, j);
    };

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
        {store.isGameOver && <div className="game-over">{store.isWinner ? 'Wygrałes!' : 'Przegrales'}</div>}
        {!store.gameInProgress && !store.isGameOver ? (
            <div className="waiting-screen">
            Oczekiwanie na dołączenie drugiego gracza...
            </div>
        ) : (
            <div className="game">
                {!store.isGameOver && <div>{store.isYourTurn ? 'Your turn' : 'Opponent turn'}</div>}
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

export default Game;

import Board from '../components/Board';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { store } from '../store/Store';
import '../styles/Game.scss';
import { useEffect } from 'react';


const Game = observer(() => {
    const navigate = useNavigate();

    useEffect(() => {
        store.chooseRoom();
    }, []);

    const handleClick = (i: number, j: number) => {
        if (store.isGameOver || !store.isYourTurn || store.board[i][j]) {
            return;
        }

        store.sendMove(i, j);
    };

    const deletePlayerFromRoom = () => {
        if (store.room) {
            store.deletePlayerFromRoom(store.room.roomName, store.username);
            navigate("/");
        }
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <button className="btn btn-warning" onClick={deletePlayerFromRoom}>Powrót do strony głównej</button>
                <div className="username">Grasz jako: {store.username || 'Anonim'}</div>
            </div>
            {store.isGameOver && <div className="game-over">{store.isWinner ? 'You won!' : store.isWinner === false ? 'You lost!' : 'Draw!'}</div>}
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
                        <div>{store.room?.player1.name} vs {store.room?.player2.name}</div>
                        {/* <div>{status}</div> */}
                    </div>
                </div>
            )}
        </div>
    );
});

export default Game;

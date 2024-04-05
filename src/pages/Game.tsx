import Board from '../components/Board';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { store } from '../store/Store';
import '../styles/Game.scss';
import { useEffect } from 'react';


const Game = observer(() => {
    const navigate = useNavigate();

    useEffect(() => {
        async function chooseRoomForGame() {
            const userRoom = store.getRoomDataFromStorage();
            if (userRoom && !store.username) {
                await store.restoreRoom(userRoom);
            }
            if (store.username && !store.room) {
                await store.chooseRoom();
            }
            if (!store.username) {
                navigate("/");
            }
        }

        chooseRoomForGame();
    }, [navigate]);

    const handleClick = (i: number, j: number) => {
        if (store.canMove && !store.board[i][j]) {
            store.sendMove(i, j);
        }
    };

    const deletePlayerFromRoom = () => {
        navigate("/");
        store.leaveRoom();
        
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <button className="btn btn-warning" onClick={deletePlayerFromRoom}>Go back to homepage</button>
                <div className="username">You play as: {store.username || 'Anonim'}</div>
            </div>
            {store.isGameOver && <div className="game-over">{store.isWinner ? 'You won!' : store.isWinner === false ? 'You lost!' : 'Draw!'}</div>}
            {!store.gameInProgress && !store.isGameOver ? (
                <div className="waiting-screen">
                    Waiting for opponent...
                </div>
            ) : (
                <div className="game">
                    {!store.isGameOver && <div>{store.isYourTurn ? 'Your turn' : 'Opponent turn'}</div>}
                    <div className="game-board">
                        <Board onClick={handleClick} />
                    </div>
                    <div className="game-info">
                        <div>{store.room?.roomName}</div>
                        <div>{store.room?.player1?.name} vs {store.room?.player2?.name}</div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Game;

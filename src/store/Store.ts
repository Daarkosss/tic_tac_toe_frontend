import { makeAutoObservable, runInAction } from "mobx";
import { api, Room, BoardOfNumbers } from "../api";
import { SquareValue } from "../components/Square";


export type UserRoom = {
    username: string,
    room: Room
}

class Store {
    username = '';
    gameInProgress = false;
    room: Room | null = null;
    isYourTurn = false;
    board: SquareValue[][] = this.resetBoard();
    isGameOver = false;
    isWinner: boolean | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    saveRoomDataToSessionStorage() {
        const dataToStore = {
            username: this.username,
            room: this.room
        }
        sessionStorage.setItem('roomData', JSON.stringify(dataToStore));
    }
    
    getRoomDataFromSessionStorage() {
        const roomData = sessionStorage.getItem('roomData');
        if (roomData) {
            return JSON.parse(roomData);
        } else {
            return null;
        }
    }

    async restoreRoom(userRoom: UserRoom) {
        if (userRoom && !this.username) {
            this.username = userRoom.username;
            try {
                const response = await api.getRoom(userRoom.room.roomName);
                this.startWebSocketConnection();
                this.updateAfterOpponentMove(response.fields);
                runInAction(() => {
                    const room: Room = {
                        roomName: response.roomName,
                        freeSlots: response.freeSlots,
                        player1: response.player1,
                        player2: response.player2
                    };
                    this.updateRoom(room);
                    this.updatePlayerTurnFromRoom();
                    console.log('is your turn?', this.isYourTurn);
                });
            } catch (error) {
                console.error("Nie udało się przywrócić pokoju:", error);
            }
        }
    }

    updateRoom(room: Room) {
        this.room = room;
        this.updatePlayerTurnFromRoom();
        this.startGame();
    }

    updatePlayerTurnFromRoom() {
        if (this.username === this.room?.player1.name) {
            this.isYourTurn = this.room.player1.starting;
        } else if (this.username === this.room?.player2.name) {
            this.isYourTurn = this.room.player2.starting;
        } else {
            this.isYourTurn = false;
        }
    }

    setGameOver(winner: boolean, draw: boolean) {
        this.isGameOver = true;
        this.gameInProgress = false;
        this.isWinner = draw ? null : winner;
    }

    resetBoard() {
        const board = Array(3).fill(null);
        for (let i = 0; i < 3; i++) {
            board[i] = Array(3).fill(null);
        }
        return board
    }

    get yourSymbol() {
        if (this.username === this.room?.player1.name) {
            return 'X';
        } else if (this.username === this.room?.player2.name) {
            return 'O';
        } else {
            return null;
        }
    }

    get opponentSymbol() {
        if (this.yourSymbol === null) {
            return null;
        }
        return this.yourSymbol === 'X' ? 'O' : 'X';
    }

    updateAfterOpponentMove(board: BoardOfNumbers) {
        console.log(board);
        this.updateEntireBoard(board);
        this.isYourTurn = true;
    }

    startWebSocketConnection() {
        api.webSocket.startConnection();
    }

    sendMove(i: number, j: number) {
        this.isYourTurn = false;
        this.board[i][j] = this.yourSymbol;
        api.webSocket.sendMove(i, j);
    }

    updateEntireBoard(board: BoardOfNumbers) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = board[i][j] === 1 ? "X" : board[i][j] === 2 ? "O" : null;
            }
        }
    }

    startGame() {
        this.gameInProgress = true;
    }

    async chooseRoomForGame() {
        try {
            await this.startWebSocketConnection();
            await new Promise(resolve => setTimeout(resolve, 500));
    
            const response = await api.chooseRoomForPlayer(this.username);
            runInAction(() => {
                this.room = response;
                this.saveRoomDataToSessionStorage();
            });
            return true;
        } catch (error) {
            console.error('Error:', error);
            return error;
        }
    }

    deletePlayerFromRoom(roomName: string, username: string) {
        try {
            api.deletePlayerFromRoom(roomName, username);
            this.resetStore()
            return true;
        } catch (error) {
            return error;
        }
    }

    resetStore() {
        this.username = '';
        store.resetRoom();
        api.webSocket.disconnect();
    }

    resetRoom() {
        this.gameInProgress = false;
        this.room = null;
        this.isYourTurn = false;
        this.board = this.resetBoard();
        this.isGameOver = false;
        this.isWinner = null;
    }
}

export const store = new Store();

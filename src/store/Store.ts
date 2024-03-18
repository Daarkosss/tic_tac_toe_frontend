import { makeAutoObservable, runInAction } from "mobx";
import { toast } from 'react-toastify';
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

    saveRoomDataFromStorage() {
        const dataToStore = {
            username: this.username,
            room: this.room
        }
        sessionStorage.setItem('roomData', JSON.stringify(dataToStore));
    }
    
    getRoomDataFromStorage() {
        const roomData = sessionStorage.getItem('roomData');
        if (roomData) {
            return JSON.parse(roomData);
        } else {
            return null;
        }
    }

    async restoreRoom(userRoom: UserRoom) {
        if (!userRoom.username || this.username) return;

        this.username = userRoom.username;
        try {
            const response = await api.getRoom(userRoom.room.roomName);
            runInAction(() => {
                const room: Room = {
                    roomName: response.roomName,
                    freeSlots: response.freeSlots,
                    player1: response.player1,
                    player2: response.player2
                };
                this.updateRoom(room);
                this.setGameStart(response.fields);
                console.log('Is it your turn?', this.isYourTurn);
            });
        } catch (error) {
            console.error("Failed to restore room:", error);
        }
    }

    setGameStart(board: BoardOfNumbers) {
        this.startWebSocketConnection();
        this.updateBoard(board);
        this.updateTurnBasedOnRoom();
        this.startGame();
    }

    updateRoom(room: Room) {
        this.room = room;
        this.updateTurnBasedOnRoom();
        this.startGame();
    }

    updateTurnBasedOnRoom() {
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

    get canMove() {
        return !store.isGameOver && store.isYourTurn;
    }

    updateAfterOpponentMove(board: BoardOfNumbers) {
        console.log(board);
        this.updateBoard(board);
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

    updateBoard(board: BoardOfNumbers) {
        this.board = board.map(row => 
            row.map(cell => cell === 1 ? 'X' : cell === 2 ? 'O' : null)
        );
    }

    startGame() {
        this.gameInProgress = true;
    }

    async chooseRoom() {
        try {
            await this.startWebSocketConnection();
            await new Promise(resolve => setTimeout(resolve, 500));
    
            const response = await api.chooseRoomForPlayer(this.username);
            runInAction(() => {
                this.room = response;
                this.saveRoomDataFromStorage();
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.error(
                errorMessage,
                { theme: "colored" }
            );
            store.resetStore();
        }
    }

    async leaveRoom(roomName: string, username: string) {
        try {
            await api.deletePlayerFromRoom(roomName, username);
            this.resetStore()
        } catch (error) {
            console.error('Error while leaving room:', error);
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

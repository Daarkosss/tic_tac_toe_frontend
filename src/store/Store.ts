import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../api";
import { Room, SquareValue } from "../types";


class Store {
    username = '';
    gameInProgress = false;
    room: Room | null = null;
    isYourTurn = false;
    board: SquareValue[][] = this.resetBoard()

    constructor() {
        makeAutoObservable(this);
    }

    saveRoomDataToLocalStorage() {
        const dataToStore = {
            username: this.username,
            room: this.room
        }
        localStorage.setItem('roomData', JSON.stringify(dataToStore));
    }

    getRoomDataFromLocalStorage() {
        const roomData = localStorage.getItem('roomData');
        if (roomData) {
            return JSON.parse(roomData);
        } else {
            return null
        }
    }

    async restoreRoom() {
        const userRoom = this.getRoomDataFromLocalStorage();
        if (userRoom) {
            this.username = userRoom.username;
            const board = await api.getRoom(userRoom.roomName);
            this.updateEntireBoard(board);
        }
    }

    resetBoard() {
        const board = Array(3).fill(null);
        for (let i = 0; i < 3; i++) {
            board[i] = Array(3).fill(null);
        }
        return board
    }

    get yourSymbol() {
        if (this.username === this.room?.player1) {
            return 'X';
        } else if (this.username === this.room?.player2) {
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

    restoreBoard(board: number[][]) {
        this.updateEntireBoard(board);
        this.startGame(true);
    }

    startWebSocketConnection() {
        api.webSocket.startConnection();
    }

    sendMove(i: number, j: number) {
        this.isYourTurn = false;
        this.board[i][j] = this.yourSymbol;
        api.webSocket.sendMove(i, j);
    }

    updateBoardSquare(i: number, j: number, value: SquareValue) {
        this.board[i][j] = value;
    }

    updateEntireBoard(board: number[][]) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = board[i][j] === 1 ? "X" : board[i][j] === 2 ? "O" : null;
            }
        }
    }

    startGame(isStarting: boolean) {
        this.isYourTurn = isStarting;
        this.gameInProgress = true;
    }

    async chooseRoomForGame() {
        this.startWebSocketConnection();
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const response = await api.chooseRoomForPlayer(this.username);
            runInAction(() => {
                this.room = response;
                this.saveRoomDataToLocalStorage();
            });
            return true;
        } catch (error) {
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
        this.gameInProgress = false;
        this.room = null;
        this.isYourTurn = false;
        this.board = this.resetBoard();
        api.webSocket.disconnect();
    }
}

export const store = new Store();

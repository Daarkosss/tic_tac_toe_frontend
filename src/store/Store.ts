import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../api";
import { Room, SquareValue } from "../types";


class Store {
    username = '';
    gameStarted = false;
    room: Room | null = null;
    isYourTurn = true; // Just for testing
    yourSymbol: SquareValue | null = null;
    board: SquareValue[] = this.resetBoard()

    constructor() {
        makeAutoObservable(this);
    }

    resetBoard() {
        return Array(9).fill(null);
    }

    get opponentSymbol() {
        if (this.yourSymbol === null) {
            return null;
        }
        return this.yourSymbol === 'X' ? 'O' : 'X';
    }

    startWebSocketConnection() {
        api.webSocket.startConnection();
    }

    sendMove(position: number) {
        this.yourSymbol = 'X'; // Just for testing
        // this.isYourTurn = false; Commented for testing
        this.board[position] = this.yourSymbol;
        api.webSocket.sendMove(position);
    }

    updateBoardState(position: number, value: SquareValue) {
        this.board[position] = value;
    }

    updateOpponentMove(position: number) {
        this.board[position] = this.opponentSymbol;
        this.isYourTurn = true;
    }

    async startGame(username: string) {
        this.username = username;
        this.startWebSocketConnection();

        try {
            const response = await api.chooseRoomForPlayer(this.username);
            runInAction(() => {
                this.room = response;
                // Do usuniecia - potrzeba bedzie dostac webSocketem kto zaczyna gre
                if (this.room.player2 !== null) {
                    this.gameStarted = true;
                }
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
        this.gameStarted = false;
        this.room = null;
        this.isYourTurn = false;
        this.board = this.resetBoard();
        api.webSocket.disconnect();
    }
}

export const store = new Store();

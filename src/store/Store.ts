import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../api";
import { Room } from "../types";

class Store {
    username = '';
    gameStarted = false;
    room: Room | null = null;
    isYourTurn = false;

    constructor() {
        makeAutoObservable(this);
    }

    startWebSocketConnection() {
        api.webSocket.startConnection();
    }

    async startGame(username: string) {
        this.username = username;
        this.startWebSocketConnection();

        try {
            const response = await api.chooseRoomForPlayer(this.username);
            runInAction(() => {
                this.room = response;
                console.log('player2 is not null');
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
            this.gameStarted = false;
            api.deletePlayerFromRoom(roomName, username);
            this.room = null;
            return true;
        } catch (error) {
            return error;
        }
    }
}

export const store = new Store();

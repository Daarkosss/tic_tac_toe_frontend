import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../api";
import { Room } from "../types";

class Store {
    username = '';
    gameStarted = false;
    room: Room | null = null;


    constructor() {
        makeAutoObservable(this);
    }

    async startGame(username: string) {
        this.username = username;
        try {
            const response = await api.chooseRoomForPlayer(this.username);
            runInAction(() => {
              this.room = response;
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
            this.room = null;
            return true;
        } catch (error) {
            return error;
        }
    }
}

export const store = new Store();

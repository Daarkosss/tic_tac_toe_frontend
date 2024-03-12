import { makeAutoObservable } from "mobx";

class Store {
    isConnected = false;
    gameStarted = false;

    constructor() {
        makeAutoObservable(this);
    }

    connectUser() {
        this.isConnected = true;
    }
        
    startGame() {
        this.gameStarted = true;
    }
}

export const store = new Store();

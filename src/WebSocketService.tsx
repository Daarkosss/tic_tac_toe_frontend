import SockJS from 'sockjs-client';
import Stomp, { Client } from 'webstomp-client';
import { store } from './store/Store';
import { runInAction } from 'mobx';

interface ReceivedMessage {
    message: string;
}

export class WebSocketService {
    private stompClient: Client | null = null;

    public startConnection(): void {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.connect({}, () => {
        console.log('Połączono z WebSocket.');

        this.stompClient?.subscribe(`/topic/${store.username}`, (message) => {
            const receivedMessage: ReceivedMessage = JSON.parse(message.body);
            if (receivedMessage.message === "Game starting") {
                runInAction(() => {
                    store.gameStarted = true;
                })
            } else {
                const position = +receivedMessage.message;
                if (!isNaN(position)) {
                    console.log('Opponent move:', position);
                    store.updateOpponentMove(position);
                }
            }
            console.log(receivedMessage);
        });

        // Możliwość wysyłania wiadomości do serwera
        // this.sendMessage("/app/someEndpoint", { yourMessage: "Hello" });
        });
    }

    public sendMove(position: number): void {
        if (this.stompClient && this.stompClient.connected) {
            const move = { position};
            this.stompClient.send(`/topic/${store.username}`, JSON.stringify(move));
            console.log('Sent move:', move);
        } else {
            console.log("Stomp client is not connected.");
        }
    }

    public disconnect(): void {
        if (this.stompClient && this.stompClient.connected) {
        this.stompClient.disconnect(() => {
            console.log('WebSocket disconnected.');
        });
        this.stompClient = null;
        }
    }
}

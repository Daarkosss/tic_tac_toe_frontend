import SockJS from 'sockjs-client';
import Stomp, { Client } from 'webstomp-client';
import { store } from './store/Store';


export class WebSocketService {
    private stompClient: Client | null = null;

    public startConnection(): void {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.connect({}, () => {
        console.log('Połączono z WebSocket.');

        this.stompClient?.subscribe(`/topic/${store.username}`, (message) => {
            try {
                const data = JSON.parse(message.body);
                console.log(data, typeof data.isStarting, data.isStarting);

                if (Array.isArray(data.fields)) {
                    console.log("Otrzymano Boarda", data.fields);
                    store.restoreBoard(data.fields);
                } else if (typeof data.isStarting === 'boolean') {
                    console.log("Otrzymano Boolean", data);
                    store.startGame(data.isStarting);
                } else {
                    console.log("Nieznany format danych", data);
                }
            } catch (error) {
                console.error("Błąd przetwarzania wiadomości:", error);
            }
        });

        // Możliwość wysyłania wiadomości do serwera
        // this.sendMessage("/app/someEndpoint", { yourMessage: "Hello" });
        });
    }

    public sendMove(i: number, j: number): void {
        if (this.stompClient && this.stompClient.connected) {
            const move = { 
                roomName: store.room?.roomName,
                x: i,
                y: j,
                playerName: store.username
            };
            this.stompClient.send(`/app/move`, JSON.stringify(move));
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

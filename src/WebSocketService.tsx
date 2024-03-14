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
                console.log("Otrzymano wiadomość:", data);
                const messageType = data.dtype;
                
                switch(messageType) {
                    case "Board":
                        console.log("Otrzymano Board", data.fields);
                        store.restoreBoard(data.fields);
                        break;
                    case "StartGameMessage":
                        console.log("Otrzymano StartGameMessage", data.isStarting);
                        store.startGame(data.isStarting);
                        break;
                    case "Room":
                        console.log("Otrzymano Room", data.fields, data.roomName, data.player1, data.player2);
                        store.restoreBoard(data.fields);
                        store.updateRoom({roomName: data.roomName, player1: data.player1, player2: data.player2, freeSlots: data.freeSlots});
                        break;
                    case "GameOverMessage":
                        console.log("Otrzymano GameOverMessage", data.winner, data.draw);
                        store.setGameOver(data.winner, data.draw);
                        break;
                    default:
                        console.error("Nieznany typ wiadomości:", messageType);
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

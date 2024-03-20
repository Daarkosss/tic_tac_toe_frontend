import SockJS from 'sockjs-client';
import Stomp, { Client } from 'webstomp-client';
import { store } from '../store/Store';
import { toast } from 'react-toastify';

export class WebSocketService {
    private stompClient: Client | null = null;

    public startConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            const socket = new SockJS('http://localhost:8080/ws');
            this.stompClient = Stomp.over(socket);

            this.stompClient.connect({}, (frame) => {
                console.log('Connected with webSocket:', frame);
                this.subscribeToQueue();
                resolve();
            }, (error) => {
                console.error('Error while connecting with webSocket:', error);
                reject(error);
            });
        });
    }

    private subscribeToQueue() {
        if (!this.stompClient) return;

        this.stompClient.subscribe(`/queue/${store.username}`, (message) => {
            try {
                const data = JSON.parse(message.body);
                console.log("Get data:", data);
                this.handleMessage(data);
            } catch (error) {
                console.error("Error while parsing message:", error);
            }
        });
    }

    private handleMessage(data: any) {
        const messageType = data.type;
        
        switch(messageType) {
            case "Board":
                console.log("Get Board", data.board);
                store.updateAfterOpponentMove(data.board);
                break;
            case "Room":
                console.log("Get Room", data.board, data.roomName, data.player1, data.player2);
                store.updateAfterOpponentMove(data.board);
                store.updateRoom({
                    roomName: data.roomName,
                    player1: data.player1,
                    player2: data.player2,
                    freeSlots: data.freeSlots
                });
                break;
            case "GameOverMessage":
                console.log("Get GameOverMessage", data.winner, data.draw);
                store.setGameOver(data.winner, data.draw);
                break;
            case "OpponentLeftGameMessage":
                store.stopGame();
                toast.info(
                    "Your opponent has left the room, wait for the next one",
                    { theme: "colored" }
                );
                break;
            default:
                console.error("Unknown message type:", messageType);
        }
    }

    public sendMove(i: number, j: number): void {
        if (!this.stompClient || !this.stompClient.connected) {
            console.log("Stomp client is not connected.");
            return;
        }

        const move = { 
            roomName: store.room?.roomName,
            i: i,
            j: j,
            playerName: store.username
        };
        this.stompClient.send(`/app/move`, JSON.stringify(move));
        console.log('Sent move:', move);
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

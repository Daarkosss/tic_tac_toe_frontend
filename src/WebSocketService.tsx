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
        }
        console.log(receivedMessage);
      });

      // Możliwość wysyłania wiadomości do serwera
      // this.sendMessage("/app/someEndpoint", { yourMessage: "Hello" });
    });
  }

  public sendMessage(destination: string, payload: object): void {
    if (this.stompClient && this.stompClient.connected) {
      const message = JSON.stringify(payload);
      this.stompClient.send(destination, message);
    } else {
      console.error("Stomp client is not connected.");
    }
  }

  public disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('Rozłączono z WebSocket.');
      });
      this.stompClient = null;
    }
  }
}

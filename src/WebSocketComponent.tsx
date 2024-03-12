import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

function WebSocketComponent() {
    useEffect(() => {
        // Ustanowienie połączenia z serwerem używając SockJS i STOMP
        const socket = new SockJS('http://localhost:8080/ws'); // Adres serwera, dostosuj do swojego środowiska
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, frame => {
            console.log('Połączono z Websocket: ' + frame);

            // Subskrypcja na topic, na który serwer będzie wysyłał wiadomości
            stompClient.subscribe('/topic/user', message => {
                // Otrzymanie wiadomości od serwera
                const receivedMessage = JSON.parse(message.body);
                console.log(receivedMessage);
            });

            // Możesz również wysyłać wiadomości do serwera
            // stompClient.send("/app/someEndpoint", JSON.stringify({yourMessage: "Hello"}));
            return () => socket.close();
        });
    }, []);

    return (
        <div>
        WebSocketComponent - Sprawdź konsolę, aby zobaczyć wiadomości.
        </div>
    );
}

export default WebSocketComponent;

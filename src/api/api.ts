import { WebSocketService } from './WebSocketService';

const PATH_PREFIX = 'http://localhost:8080/';
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';


export type Player = {
    name: string,
    starting: boolean
}

export type BoardOfNumbers = number[][]

export type Room = {
    roomName: string,
    freeSlots: number,
    player1: Player,
    player2: Player
}

export interface GetRoomResponse extends Room {
    type: string,
    board: BoardOfNumbers,
}

class API {

    async fetch<T>(
        method: Method,
        path: string,
        body?: unknown,
        headers: HeadersInit = {},
    ): Promise<T> {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
        } as RequestInit

        const response = await fetch(`${PATH_PREFIX}${path}`, options)
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errorMessage || 'Wrong server response!');
        } else {
            return data;
        }
    }
    webSocket = new WebSocketService();

    async chooseRoomForPlayer(username: string): Promise<Room> {
        const response = await this.fetch<Room>(
            'POST', 
            `rooms/findRoomForPlayer?playerName=${username}`, 
        );
        console.log(response);
        return response;
    }

    async deletePlayerFromRoom(roomName: string, username: string) {
        const response = await this.fetch<Room>(
            'DELETE', 
            `rooms/removePlayerFromRoom?roomName=${roomName}&playerName=${username}`, 
        );
        console.log(response);
        return response;
    }

    async getRoom(roomName: string): Promise<GetRoomResponse> {
        const response = await this.fetch<GetRoomResponse>(
            'GET', 
            `rooms?roomName=${roomName}`, 
        );
        console.log('getRoom', response);
        return response;
    }
}

export const api = new API();

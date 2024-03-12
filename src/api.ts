import { Room } from './types';


const PATH_PREFIX = 'http://localhost:8080/';
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

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
      throw new Error(data.errorMessage || 'Błędna odpowiedź serwera!');
    } else {
      return data;
    }
  }

  async authorizedFetch<T>(
    method: Method,
    path: string,
    body?: unknown
  ): Promise<T> {
    return this.fetch<T>(
      method, 
      path,
      body,
    );
  }

  async chooseRoomForPlayer(username: string): Promise<Room> {
    const response = await this.fetch<Room>(
      'POST', 
      `rooms/chooseRoomForPlayer?playerName=${username}`, 
    );
    console.log(response);
    return response;
  }

  async deletePlayerFromRoom(roomName: string, username: string) {
    const response = await this.fetch<Room>(
      'DELETE', 
      `rooms/deletePlayerFromRoom?roomName=${roomName}&playerName=${username}`, 
    );
    console.log(response);
    return response;
  }
}

export const api = new API();

export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
    i: number;
    j: number;
    onClick: () => void;
}

export interface BoardProps {
    onClick: (i: number, j: number) => void;
}

export type Room = {
    roomName: string,
    freeSlots: number,
    player1: Player,
    player2: Player
}

export type UserRoom = {
    username: string,
    room: Room
}

export type BoardOfNumbers = number[][]

export type StartGameMessage = boolean

export type RoomWithBoard = {
    room: Room,
    board: BoardOfNumbers
}

export type GetRoomResponse = {
    dtype: string,
    roomName: string,
    freeSlots: number,
    fields: BoardOfNumbers,
    player1: Player,
    player2: Player
}

export type Player = {
    name: string,
    starting: boolean
}
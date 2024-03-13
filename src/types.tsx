export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
    position: number;
    onClick: () => void;
}

export interface BoardProps {
    onClick: (i: number) => void;
}

export type Room = {
    roomName: string,
    freeSlots: number,
    player1: string,
    player2: string,
}

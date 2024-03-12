export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
    value: SquareValue;
    onClick: () => void;
}

export interface BoardProps {
    squares: SquareValue[];
    onClick: (i: number) => void;
}

export type Room = {
    roomName: string,
    freeSlots: number,
    player1: string,
    player2: string,
}

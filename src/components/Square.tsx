import React from 'react';
import { observer } from 'mobx-react-lite';
import '../styles/Game.scss';
import { store } from '../store/Store';


export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
    i: number;
    j: number;
    onClick: () => void;
}

const Square: React.FC<SquareProps> = observer(({ i, j, onClick }) => (
    <button disabled={store.board[i][j] !== null} className="square" onClick={onClick}>
        {store.board[i][j]}
    </button>
));

export default Square;
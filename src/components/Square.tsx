import React from 'react';
import { SquareProps } from '../types';
import { observer } from 'mobx-react-lite';
import '../styles/Game.scss';
import { store } from '../store/Store';


const Square: React.FC<SquareProps> = observer(({ position, onClick }) => (
    <button disabled={store.board[position] !== null} className="square" onClick={onClick}>
        {store.board[position]}
    </button>
));

export default Square;
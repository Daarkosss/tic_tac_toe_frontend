import React from 'react';
import Square from './Square';
import '../styles/Game.scss';


export interface BoardProps {
    onClick: (i: number, j: number) => void;
}

const Board: React.FC<BoardProps> = ({ onClick }) => {
    const renderSquare = (i: number, j: number) => (
        <Square i={i} j = {j} onClick={() => onClick(i, j)} />
    );

    return <div>
        <div className="board-row">
            {renderSquare(0, 0)}
            {renderSquare(0, 1)}
            {renderSquare(0, 2)}
        </div>
        <div className="board-row">
            {renderSquare(1, 0)}
            {renderSquare(1, 1)}
            {renderSquare(1, 2)}
        </div>
        <div className="board-row">
            {renderSquare(2, 0)}
            {renderSquare(2, 1)}
            {renderSquare(2, 2)}
        </div>
    </div>
};

export default Board;
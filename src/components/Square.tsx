import React from 'react';
import { SquareProps } from '../types';
import '../styles/Game.scss';


const Square: React.FC<SquareProps> = ({ value, onClick }) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

export default Square;
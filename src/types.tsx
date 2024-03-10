export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
  value: SquareValue;
  onClick: () => void;
}

export interface BoardProps {
  squares: SquareValue[];
  onClick: (i: number) => void;
}

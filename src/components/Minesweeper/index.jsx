import { useState } from 'react';
import Cell from '../Cell';
import Row from '../Row';
import styles from './styles.scss';

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function generateField(rows, cols) {
  const field = Array(rows)
    .fill()
    .map(() => {
      return Array(cols)
        .fill()
        .map(() => ({
          opened: false,
          isBomb: false,
        }));
    });

  let bombsCount = (rows + cols) / 2;

  while (bombsCount) {
    const randomRow = randomInteger(0, rows - 1);
    const randomCol = randomInteger(0, cols - 1);

    if (field[randomRow][randomCol].isBomb) {
      continue;
    }

    field[randomRow][randomCol].isBomb = true;
    bombsCount--;
  }

  return field;
}

function Minesweeper() {
  const [field, setField] = useState(generateField(10, 12));

  function handleClick(evt, x, y, isBomb) {
    const prevCell = { ...field[y][x], opened: true };
    const prevField = [...field];
    prevField[y][x] = prevCell;

    setField(prevField);
  }

  return (
    <div className={styles.field} onContextMenu={e => e.preventDefault()}>
      {field.map((row, yIndex) => (
        // here indices are used as keys because an order of the elements is not important
        <Row key={yIndex}>
          {row.map((cell, xIndex) => (
            <Cell
              onClick={handleClick}
              y={yIndex}
              x={xIndex}
              opened={cell.opened}
              isBomb={cell.bomb}
              key={xIndex}
            />
          ))}
        </Row>
      ))}
    </div>
  );
}

export default Minesweeper;

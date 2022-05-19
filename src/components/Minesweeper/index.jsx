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
          around: 0,
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

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        field[randomRow + i]?.[randomCol + j] && field[randomRow + i][randomCol + j].around++;
      }
    }

    bombsCount--;
  }

  return field;
}

function Minesweeper() {
  const [field, setField] = useState(generateField(10, 12));

  // console.log(field);

  function handleClick(evt, x, y, isBomb) {
    if (isBomb) {
      alert('You lose');
      return;
    }

    const prevField = openCells([...field], x, y);

    setField(prevField);
  }

  function openCells(field, x, y) {
    const cell = field?.[y]?.[x];

    if (cell?.opened || !cell) return;

    const prevCell = { ...cell, opened: true };
    field[y][x] = prevCell;

    if (cell.around === 0) {
      openCells(field, x, y - 1);
      openCells(field, x - 1, y);
      openCells(field, x + 1, y);
      openCells(field, x, y + 1);
    }

    return field;
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
              isBomb={cell.isBomb}
              around={cell.around}
              key={xIndex}
            />
          ))}
        </Row>
      ))}
    </div>
  );
}

export default Minesweeper;

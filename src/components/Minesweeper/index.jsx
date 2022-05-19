import { useRef, useState } from 'react';
import Cell from '../Cell';
import Row from '../Row';
import styles from './styles.scss';

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
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

  return field;
}

function Minesweeper() {
  const [size, setSize] = useState([10, 10]);
  const [field, setField] = useState(generateField(size[0], size[1]));
  const isFirstClick = useRef(true);

  // console.log(field);

  function handleClick(evt, x, y, isBomb) {
    if (isFirstClick.current) {
      generateBombs(x, y);
    }

    isFirstClick.current = false;

    if (isBomb) {
      alert('You lose');
      return;
    }

    setField(prevField => openCells([...prevField], x, y));
  }

  function generateBombs(x, y) {
    let bombsCount = (size[0] + size[1]) / 2;

    setField(prevField => {
      const field = [...prevField];

      while (bombsCount) {
        const randomRow = randomInteger(0, size[0] - 1);
        const randomCol = randomInteger(0, size[1] - 1);

        if (field[randomRow][randomCol].isBomb || (randomRow === y && randomCol === x)) {
          continue;
        }

        const prevCell = { ...field[randomRow][randomCol] };
        prevCell.isBomb = true;
        field[randomRow][randomCol] = prevCell;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (field[randomRow + i]?.[randomCol + j]) {
              const prevCell = { ...field[randomRow + i][randomCol + j] };
              prevCell.around++;
              field[randomRow + i][randomCol + j] = prevCell;
            }
          }
        }

        bombsCount--;
      }

      return field;
    });
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

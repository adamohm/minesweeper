import { useEffect, useRef, useState } from 'react';
import Cell from '../Cell';
import Row from '../Row';
import styles from './styles.scss';

function randomInt(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function openCells(field, x, y) {
  const cell = field?.[y]?.[x];

  if (cell?.status === 1 || !cell) return;

  const prevCell = { ...cell, status: 1 };
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
          status: 0,
          isBomb: false,
          around: 0,
        }));
    });

  return field;
}

function Minesweeper() {
  const [size, setSize] = useState([10, 10]);
  const [field, setField] = useState(generateField(size[0], size[1]));
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const isFirstClick = useRef(true);
  const timerId = useRef(null);

  useEffect(() => {
    const bombsCount = (size[0] + size[1]) / 2;
    const closedCells = field.flat().filter(cell => cell.status === 0);

    if (bombsCount === closedCells.length) {
      setIsGameOver('You won!');
      clearInterval(timerId.current);
      setTimer(0);
    }
  });

  function handleClick(x, y, isBomb) {
    if (isGameOver) return;

    if (isFirstClick.current) {
      generateBombs(x, y);
      timerId.current = setInterval(() => {
        setTimer(st => st + 1);
      }, 1000);
    }

    isFirstClick.current = false;

    if (isBomb) {
      setIsGameOver('You lose!');
      clearInterval(timerId.current);
      setTimer(0);
    }

    setField(prevField => openCells([...prevField], x, y));
  }

  function handleContextMenu(x, y) {
    if (isGameOver) return;

    setField(prevField => {
      const field = [...prevField];
      const prevCell = { ...prevField[y][x], status: prevField[y][x].status === 2 ? 0 : 2 };
      field[y][x] = prevCell;

      return field;
    });
  }

  function generateBombs(x, y) {
    let bombsCount = (size[0] + size[1]) / 2;

    setField(prevField => {
      const field = [...prevField];

      while (bombsCount) {
        const randomRow = randomInt(0, size[0] - 1);
        const randomCol = randomInt(0, size[1] - 1);

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

  function restart() {
    setField(generateField(size[0], size[1]));
    setIsGameOver(false);
    clearInterval(timerId.current);
    setTimer(0);
    isFirstClick.current = true;
    timerId.current = null;
  }

  return (
    <div>
      <div className={styles.panel}>
        <div className={styles.timer}>⌛ {timer}</div>
        <div className={styles.message}>{isGameOver}</div>
        <div className={styles.controls}>
          <button onClick={restart} className={styles.btn}>
            Restart
          </button>
        </div>
      </div>
      <div className={styles.field} onContextMenu={e => e.preventDefault()}>
        {field.map((row, yIndex) => (
          // here indices are used as keys because an order of the elements is not important
          <Row key={yIndex}>
            {row.map((cell, xIndex) => (
              <Cell
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                y={yIndex}
                x={xIndex}
                status={cell.status}
                isBomb={cell.isBomb}
                around={cell.around}
                key={xIndex}
              />
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
}

export default Minesweeper;

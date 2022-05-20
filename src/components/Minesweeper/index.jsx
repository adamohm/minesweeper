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

  const newCell = { ...cell, status: 1 };
  field[y][x] = newCell;

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
    const bombsCount = ~~(((size[0] + size[1]) / 2) * 1.5);
    const closedCells = field.flat().filter(cell => cell.status === 0 || cell.status === 2);

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
      const newField = [...prevField];
      const newCell = { ...newField[y][x], status: newField[y][x].status === 2 ? 0 : 2 };
      newField[y][x] = newCell;

      return newField;
    });
  }

  function generateBombs(x, y) {
    let bombsCount = ~~(((size[0] + size[1]) / 2) * 1.5);

    setField(prevField => {
      const newField = [...prevField];

      while (bombsCount) {
        const randomRow = randomInt(0, size[0] - 1);
        const randomCol = randomInt(0, size[1] - 1);

        if (newField[randomRow][randomCol].isBomb || (randomRow === y && randomCol === x)) {
          continue;
        }

        const newCell = { ...newField[randomRow][randomCol] };
        newCell.isBomb = true;
        newField[randomRow][randomCol] = newCell;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (newField[randomRow + i]?.[randomCol + j]) {
              const newCell = { ...newField[randomRow + i][randomCol + j] };
              newCell.around++;
              newField[randomRow + i][randomCol + j] = newCell;
            }
          }
        }

        bombsCount--;
      }

      return newField;
    });
  }

  function restart() {
    if (size[0] < 10 || size[1] < 10) {
      alert('10x10 is minimal size for the field!');
      return;
    }

    if (size[0] > 18) {
      alert('18 is maximum size for the rows!');
      return;
    }

    if (size[1] > 25) {
      alert('20 is maximum size for the columns!');
      return;
    }

    setField(generateField(size[0], size[1]));
    setIsGameOver(false);
    clearInterval(timerId.current);
    setTimer(0);
    isFirstClick.current = true;
    timerId.current = null;
  }

  function handleChange(evt) {
    const value = +evt.target.value;
    const name = evt.target.name;

    if (name === 'rows') {
      setSize(st => [value, st[1]]);
    } else {
      setSize(st => [st[0], value]);
    }
  }

  return (
    <div>
      <div className={styles.panel}>
        <div className={styles.timer}>⌛ {timer}</div>
        <div className={styles.message}>{isGameOver}</div>
        <div className={styles.controls}>
          <input onChange={handleChange} name='rows' value={size[0]} className={styles.input} />x
          <input onChange={handleChange} name='cols' value={size[1]} className={styles.input} />
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

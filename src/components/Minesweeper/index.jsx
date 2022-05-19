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
          status: 0,
          bomb: false,
        }));
    });

  let bombsCount = (rows + cols) / 2;

  while (bombsCount) {
    const randomRow = randomInteger(0, rows - 1);
    const randomCol = randomInteger(0, cols - 1);

    if (field[randomRow][randomCol].bomb) {
      continue;
    }

    field[randomRow][randomCol].bomb = true;
    bombsCount--;
  }

  return field;
}

function Minesweeper() {
  const [field, setField] = useState(generateField(10, 12));

  console.log(field);

  return (
    <div className={styles.field}>
      {field.map((row, index) => (
        // here indices are used as keys because an order of the elements is not important
        <Row key={index}>
          {row.map((cell, index) => (
            <Cell key={index} />
          ))}
        </Row>
      ))}
    </div>
  );
}

export default Minesweeper;

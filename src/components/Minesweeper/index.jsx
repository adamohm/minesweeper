import { useState } from 'react';
import Cell from '../Cell';
import Row from '../Row';
import styles from './styles.scss';

function Minesweeper() {
  const [field, setField] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

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

import styles from './styles.scss';
import cn from 'classnames';
import { useState } from 'react';

const numberColors = ['', 'blue', 'green', 'tan', 'purple', 'red'];

function Cell({ opened, onClick, y, x, isBomb, around }) {
  const [isFlagged, setIsFlagged] = useState(false);

  function handleContextMenu(evt) {
    evt.preventDefault();
    if (opened) return;
    setIsFlagged(st => !st);
  }

  function handleClick(evt) {
    if (isFlagged || opened) return;
    onClick(evt, x, y, isBomb);
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      className={cn(styles.cell, {
        [styles.opened]: opened,
        [styles.flagged]: isFlagged,
        [styles.isBomb]: isBomb,
      })}
      style={{ color: numberColors[around] }}
    >
      {opened && !isBomb && around !== 0 && around}
    </div>
  );
}

export default Cell;

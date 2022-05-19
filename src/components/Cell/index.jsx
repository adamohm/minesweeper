import styles from './styles.scss';
import cn from 'classnames';
import { useState } from 'react';

function Cell({ opened, onClick, y, x, isBomb }) {
  const [isFlagged, setIsFlagged] = useState(false);

  function handleContextMenu(evt) {
    evt.preventDefault();
    setIsFlagged(st => !st);
  }

  function handleClick(evt) {
    if (isFlagged) return;
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
    ></div>
  );
}

export default Cell;

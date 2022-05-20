import styles from './styles.scss';
import cn from 'classnames';
import { useState } from 'react';

const numberColors = ['', 'blue', 'green', 'tan', 'purple', 'red'];

function Cell({ status, onClick, onContextMenu, y, x, isBomb, around }) {
  function handleContextMenu(evt) {
    evt.preventDefault();
    if (status === 1) return;
    onContextMenu(x, y);
  }

  function handleClick() {
    if (status === 2 || status === 1) return;
    onClick(x, y, isBomb);
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      className={cn(styles.cell, {
        [styles.opened]: status === 1,
        [styles.flagged]: status === 2,
        [styles.isBomb]: isBomb,
      })}
      style={{ color: numberColors[around] }}
    >
      {status === 1 && !isBomb && around !== 0 && around}
    </div>
  );
}

export default Cell;

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MemoryGame from './MemoryGame';

test('renders MemoryGame, click all cards and win', () => {
  const { getByText, getAllByTestId } = render(<MemoryGame cardsNumber={6} maxTime={10000} />);
  const bestScores = getByText(/Meilleurs scores/i);
  expect(bestScores).toBeInTheDocument();

  // On va aller clicker sur toutes les valeurs possibles
  let availableValues = [...Array(6).keys()];
  for (let i in availableValues) {
    let cards = getAllByTestId(i)
    for (let j in cards) {
      let card = cards[j]
      expect(card).toBeInTheDocument();
      fireEvent(
        card,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }

  // On attend que le timer soit écoulé
  async function waitForResult() {
    await setTimeout(() => {
      let winMessage = getByText(/Vous avez gagné/i)
      expect(winMessage).toBeInTheDocument();
    }, 1200)
  }
  waitForResult()
});

test('renders MemoryGame, click some cards and loose', () => {
  const { getByText, getAllByTestId } = render(<MemoryGame cardsNumber={6} maxTime={1000} />);

  // On va aller clicker sur seulement 4 des 6 valeurs possibles
  let availableValues = [...Array(4).keys()];
  for (let i in availableValues) {
    let cards = getAllByTestId(i)
    for (let j in cards) {
      let card = cards[j]
      expect(card).toBeInTheDocument();
      fireEvent(
        card,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }

  // On attend que le timer soit écoulé
  async function waitForResult() {
    await setTimeout(() => {
      let looseMessage = getByText(/Vous avez perdu/i)
      expect(looseMessage).toBeInTheDocument();
    }, 1200)
  }
  waitForResult()
});

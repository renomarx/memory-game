import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  const { getByText, getAllByTestId } = render(<App />);
  const bestScores = getByText(/Meilleurs scores/i);
  expect(bestScores).toBeInTheDocument();

  let availableValues = [...Array(18).keys()];
  for (let i in availableValues) {
    let cards = getAllByTestId(i)
    for (let j in cards) {
      let card = cards[j]
      expect(card).toBeInTheDocument();
    }
  }
});

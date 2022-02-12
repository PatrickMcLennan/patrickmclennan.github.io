import React from 'react';
import { screen, render, cleanup } from '@testing-library/react';
import { Error } from '../Error';

const errorMessage = `This is a test error message`;

describe(`<Error />`, () => {
  afterEach(cleanup);
  beforeEach(() => render(<Error message={errorMessage} />));

  it(`should display an H2 with the error message provided`, async () => {
    const typography = await screen.findByRole(`heading`, { level: 2 });
    expect(typography.textContent).toBe(errorMessage);
  });
});

import Home from '../Home.js';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test("renders Home without crashing", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});

test("home page elements", () => {
  const { getByText } = render(
    <MemoryRouter intitialEntries={["/"]}>
      <Home />
    </MemoryRouter>
  );

  const welcome = getByText("Welcome to Savour – The recipe app");
  expect(welcome).toBeInTheDocument();
});
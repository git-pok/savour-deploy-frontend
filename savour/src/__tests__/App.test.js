import App from '../App.js';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

function renderAppComponent () {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
}

test("renders App without crashing", () => {
  renderAppComponent();
});

test("renders snapshot without crashing", () => {
  const { asFragment } = renderAppComponent();
  expect(asFragment()).toMatchSnapshot();
});
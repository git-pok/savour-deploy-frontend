import ContactPage from '../ContactPage.js';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test("renders ContactPage without crashing", () => {
  render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>
  );
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});

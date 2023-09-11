import CenterText from '../CenterText.js';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test("renders CenterText without crashing", () => {
  render(
    <MemoryRouter>
    <CenterText
      text="Test Text!"
      color="black"
      fontSize={24} />
    </MemoryRouter>);
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <CenterText
        text="Test Text!"
        color="black"
        fontSize={24} />
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});

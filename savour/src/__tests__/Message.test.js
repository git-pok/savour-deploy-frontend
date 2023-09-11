import Message from '../Message.js';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test("renders Message without crashing", () => {
  render(
    <MemoryRouter>
    <Message
      msgObj={
        {
          msg: "Test!",
          class: "success"
        }
      } />
    </MemoryRouter>
  );
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <Message
        msgObj={
          {
            msg: "Test!",
            class: "success"
          }
      } />
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});

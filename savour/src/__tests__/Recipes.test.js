import Recipes from '../Recipes.js';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserContext from '../context/UserContext.js';


const usrData = {
  userUsername: "fvin",
  userId: 12
};


test("renders Recipes without crashing", () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{usrData}}>
        <Recipes />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
    <UserContext.Provider value={{usrData}}>
      <Recipes />
    </UserContext.Provider>
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});
import Navbar from '../Navbar.js';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserContext from '../context/UserContext.js';


const usrData = {
  userUsername: "fvin",
  userId: 12
};

const logOut = () => {
  console.log("Test!");
}


test("renders Navbar without crashing", () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{usrData}}>
        <Navbar linkNames={
            [["HOME", "/test"]]
          }
          logOut={logOut} />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{usrData}}>
        <Navbar linkNames={
          [["HOME", "/test"]]
        }
        logOut={logOut} />
      </UserContext.Provider>
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});
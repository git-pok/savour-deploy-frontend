import LoginForm from '../LoginForm.js';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserContext from '../context/UserContext.js';


const setUsrData = () => {
  console.log("Test!");
};


test("renders LoginForm without crashing", () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{setUsrData}}>
        <LoginForm />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{setUsrData}}>
        <LoginForm />
      </UserContext.Provider>
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});

test("login form elements exist", () => {
  const { queryByLabelText } = render(
    <MemoryRouter intitialEntries={["/login"]}>
      <UserContext.Provider value={{setUsrData}}>
        <LoginForm />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const signInUsrname = queryByLabelText("Username");
  const signInPassword = queryByLabelText("Password");
  expect(signInUsrname).toBeInTheDocument();
  expect(signInPassword).toBeInTheDocument();
});
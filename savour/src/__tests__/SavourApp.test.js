import SavourApp from '../SavourApp.js';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';


afterAll(() => {
  const { getByText } = render(
    <MemoryRouter intitialEntries={["/"]}>
      <SavourApp />
    </MemoryRouter>
  );
  const logoutBtn = getByText("LOG OUT");
  fireEvent.click(logoutBtn);
});


function renderSavourApp () {
  return render(
  <MemoryRouter intitialEntries={["/"]}>
    <SavourApp />
  </MemoryRouter>
  );
}

test("renders SavourApp without crashing", () => {
  render(<MemoryRouter><SavourApp /></MemoryRouter>);
});

test("renders snapshot without crashing", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <SavourApp />
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});

test("login form submission", async () => {
  const { findByText, getByText, getByTestId, queryByLabelText } = render(
        <MemoryRouter>
          <SavourApp />
        </MemoryRouter>
  );

  const loginBtn = getByText("LOG IN");
  fireEvent.click(loginBtn);
  const submitBtn = getByTestId("sbmtBtn");
  const signInUsrname = queryByLabelText("Username");
  const signInPassword = queryByLabelText("Password");
  fireEvent.change(signInUsrname, { target: { value: "testUsr" } });
  fireEvent.change(signInPassword, { target: { value: "password" } });
  fireEvent.click(submitBtn);
  const welcomeHdr = await findByText("Welcome to Savour – The recipe app");
  expect(welcomeHdr).toBeInTheDocument();
  const welcomeUsrText = await findByText("WELCOME TESTUSR!");
  expect(welcomeUsrText).toBeInTheDocument();
});

test("home page to shoppinglists page", async () => {
  const { findByText, getByText } = renderSavourApp();

  const welcome = getByText("Welcome to Savour – The recipe app");
  expect(welcome).toBeInTheDocument();
  const shplistsBtn = getByText("SHOPLISTS");
  fireEvent.click(shplistsBtn);
  const shplistsText = await findByText("testUsr's Shoppinglists");
  expect(shplistsText).toBeInTheDocument();
});

test("profile page to contact page", async () => {
  const { findByText, getByText } = renderSavourApp();

  const welcome = getByText("Welcome to Savour – The recipe app");
  expect(welcome).toBeInTheDocument();
  const profileBtn = getByText("PROFILE");
  fireEvent.click(profileBtn);
  const profileText = await findByText("testUsr Details");
  expect(profileText).toBeInTheDocument();
  const contactBtn = getByText("CONTACT");
  fireEvent.click(contactBtn);
  const contactText = await findByText("App Creator and Developer Information");
  expect(contactText).toBeInTheDocument();
});
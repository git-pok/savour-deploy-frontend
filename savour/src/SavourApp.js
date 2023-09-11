import './SavourApp.css';
import { Redirect, useHistory } from 'react-router-dom';
import { useContext, useCallback } from 'react';
import Navbar from './Navbar.js';
import Routes from './Routes.js';
import useLocalStorage from './hooks/useLocalStorage.js';
import UserContext from './context/UserContext.js';
import useToggleState from './hooks/useToggleState';
import SavourApi from './models/SavourApi.js';

/**
 * SavourApp
 * Props: none
 * Renders savour app with navbar, routes, and context.
*/
const SavourApp = () => {
  const [ isLoggedOut, setIsLoggedOut ] = useToggleState(false);
  const [ usrData, setUsrData ] = useLocalStorage("userData", null);
  const history = useHistory();

  const logOut = useCallback(() => {
    window.localStorage.clear();
    setUsrData(() => null);
    SavourApi.token = null;
    history.push("/login");
  }, [usrData]);

  const userLink = usrData ? `${usrData.userUsername}` : "";
  const linkNames = [
    ["recipes", "/recipes"], ["shoplists", "/shoppinglists"],
    ["recipelists", "/recipelists"], ["favs", "/favs"],
    ["saved", "/saved"], ["profile", `/users/${userLink}`],
    ["contact", "/contact"]
  ];

  return (
    <div className="SavourApp">
      <UserContext.Provider value={{usrData, setUsrData, logOut}}>
        <Navbar
          linkNames={linkNames}
          logOut={logOut} />
        <Routes />
      </UserContext.Provider>
    </div>
  );
}

export default SavourApp;

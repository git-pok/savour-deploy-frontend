import { NavLink } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage.js';
import useToggleState from './hooks/useToggleState.js';
import { useContext, useState, useRef } from 'react';
import UserContext from './context/UserContext.js';
import './Navbar.css';
/**
 * Navbar
 * Creates Navbar
 * Props: linkNames, logOut
 *    linkNames: nested arrays where idx0 is name that shows
 *        on nav button and idx1 is the button's url =>
 *        [["recipes", "/recipes"], ["shoplists", "/shoppinglists"]]
 *    logOut: log out function.
 * Renders navbar
*/
const Navbar = ({ linkNames, logOut }) => {
  const { usrData, setUsrData } = useContext(UserContext);
  const userToken = usrData ? usrData.token : null;
  const usrName = usrData ? usrData.userUsername.toUpperCase(): null;
  const [ showMobileNav, setShowMobileNav ] = useToggleState(false);
  const [ mobileNavClass, setMobileNavClass ] = useState("Navbar");

  const toggleClass = () => {
    if (!showMobileNav) setMobileNavClass("Navbar-show")
    else setMobileNavClass("Navbar-hide");
    setShowMobileNav();
  }

  return (
    <>
    <div
      className="Navbar-mobile-menu"
      onClick={toggleClass}>
        <p>NAV MENU</p>
    </div>
    <nav className={mobileNavClass}>
      <div className="Navbar-left-links">
        <NavLink exact to="/">
          SAVOUR
        </NavLink>
      { userToken &&
        <span>
          WELCOME {usrName}!
        </span> 
      }
      </div>
      <div className="Navbar-right-links">
        { userToken &&
          linkNames.map(val => (
            <NavLink exact to={`${val[1]}`} key={val[0]}>
              {val[0].toUpperCase()}
            </NavLink>
          ))
        }
        { userToken
          ?
            <NavLink exact to="/login" onClick={logOut}>
              LOG OUT
            </NavLink>
          :
            <NavLink exact to="/login">
              LOG IN
            </NavLink>
        }
        { !userToken &&
          <NavLink exact to="/signup">
            SIGN UP
          </NavLink>
        }
      </div>
    </nav>
    </>
  );
}

export default Navbar;

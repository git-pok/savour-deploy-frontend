import { Route, Switch, Redirect, useParams } from 'react-router-dom';
import { useContext } from 'react';
import useLocalStorage from './hooks/useLocalStorage.js';
import RegisterForm from './RegisterForm.js';
import LoginForm from './LoginForm.js';
import Home from './Home.js';
import Recipes from './Recipes.js';
import RecipeDetails from './RecipeDetails.js';
import PageNotFound from './PageNotFound.js';
import Profile from './Profile.js';
import ListNamesDiv from './ListNamesDiv.js';
import ListDetails from './ListDetails.js';
import FavOrSav from './FavOrSav.js';
import ContactPage from './ContactPage.js';
import UserContext from './context/UserContext.js';

/**
 * Routes
 * Props: none
 * Renders urls and their components.
*/
const Routes = () => {
  const { usrData, setUsrData } = useContext(UserContext);
  const userToken = usrData ? usrData.token : null;
  
  /**
   * formValsCheck
   * Args: formProps, formData
   *    formProps: array of props to check for =>
   *    ["name", "email"]
   *    formData: form state.
   * Definition: checks if props are missing from
   * form data.
  */
  const formValsCheck = (formPropsArr, formData) => {
    // Check if props are missing.
    const isValMissing = formPropsArr.some(val => (
      formData[val] === ""
    ));

    return isValMissing;
  }

  return (
    <Switch>
      { userToken &&
        <Route exact path="/">
          <Home />
        </Route>
      }
      { !userToken &&
        <Route exact path="/signup">
          <RegisterForm formValsCheck={formValsCheck} />
        </Route>
      }
      { !userToken &&
        <Route exact path="/login">
          <LoginForm formValsCheck={formValsCheck} />
        </Route>
      }
      { userToken &&
        <Route exact path="/recipes">
          <Recipes />
        </Route>
      }
      { userToken &&
        <Route exact path="/recipes/:id">
          <RecipeDetails />
        </Route>
      }
      { userToken &&
        <Route exact path="/shoppinglists">
          <ListNamesDiv
            urlEndpt="shoppinglists"
            listTypeForH1="Shoppinglists" />
        </Route>
      }
      { userToken &&
        <Route exact path="/shoppinglists/:id">
          <ListDetails
            urlEndpt="shoppinglists" />
        </Route>
      }
      { userToken &&
        <Route exact path="/recipelists">
          <ListNamesDiv
            urlEndpt="recipelists"
            listTypeForH1="Recipelists"
            recipelist={true} />
        </Route>
      }
      { userToken &&
        <Route exact path="/recipelists/:id">
          <ListDetails
            urlEndpt="recipelists"
            recipelist={true} />
        </Route>
      }
      { userToken &&
        <Route exact path="/favs">
          <FavOrSav />
        </Route>
      }
      { userToken &&
        <Route exact path="/saved">
          <FavOrSav fav={false} />
        </Route>
      }
      { userToken &&
        <Route exact path="/users/:id">
          <Profile />
        </Route>
      }
      { userToken &&
        <Route exact path="/contact">
          <ContactPage />
        </Route>
      }
      { userToken &&
        <Route exact path="/page-not-found">
          <PageNotFound />
        </Route>
      }
      <Redirect exact to="/page-not-found" />
    </Switch>
  );
}

export default Routes;

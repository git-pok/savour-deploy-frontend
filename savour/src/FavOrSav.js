import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeContainer from './RecipeContainer.js';
import UserContext from './context/UserContext.js';
import SavourApi from './models/SavourApi.js';
import './FavOrSav.css';

/**
 * FavOrSav
 * Props: fav
 * Renders html to display favorite or saved recipes.
*/
const FavOrSav = ({fav=true}) => {
  const { usrData, setUsrData } = useContext(UserContext);
  const headers = { _token: `Bearer ${usrData.token}`};
  const urlEndpt = fav ? "favorite-recipes" : "saved-recipes";
  const recipeUrl = `/users/${usrData.userId}/${urlEndpt}`;
  const recipeOpts = {method: "get", url: recipeUrl, data: {}, params: {}, headers};
  const [ recipeData, setRecipeData ] = useState(null);

  useEffect(() => {
    const getRecipes = async () => {
      const recipeReq = await SavourApi.request("get", recipeUrl, {}, {}, headers);
      setRecipeData(() => recipeReq.data);
    }

    getRecipes();
  }, [recipeUrl])

  return (
    <>
    { fav ?
      <h1 className="FavOrSav-h1">{`${usrData && usrData.userUsername}'s Favorite Recipes`}</h1>
      :
      <h1 className="FavOrSav-h1">{`${usrData && usrData.userUsername}'s Saved Recipes`}</h1>
    }
    <div className="FavOrSav">
      <div className="FavOrSav-div">
        { recipeData && recipeData.length ?
          <RecipeContainer showHide={true} recipeArray={recipeData} />
        :
          <Link exact="true" to="/recipes">
            { fav ? <p>No Favorite Recipes! Browse Recipes!</p> : <p>No Saved Recipes! Browse Recipes!</p> }
          </Link>
        }
      </div>
    </div>
    </>
  );
}

export default FavOrSav;
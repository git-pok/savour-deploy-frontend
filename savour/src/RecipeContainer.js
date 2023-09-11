import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from './context/UserContext.js';
import ShowHideBtnAndText from './ShowHideBtnAndText.js';
import './RecipeContainer.css';

/**
 * RecipeContainer
 * Props: showHide, recipeArray
 * Renders div with recipe content.
*/
const RecipeContainer = ({ showHide=false, recipeArray=[] }) => {
  const { usrData, setUsrData } = useContext(UserContext);

  return (
    <>
      {
        recipeArray.length ?
        recipeArray.map(recipe => (
          <div style={
              recipe.fav_user_ids &&
              recipe.fav_user_ids.includes(usrData.userId)
              ? { border: "2px solid green" }
              : null
            }
            key={recipe.id}
            className="RecipeContainer-recipe">
            <Link exact="true" to={`/recipes/${recipe.id}`}>
              <h3>{recipe.name}</h3>
            </Link>
            <h3>By {recipe.author}</h3>
            <img src={recipe.image}></img>
            { showHide ?
              <ShowHideBtnAndText paragraphArr={[
                {text: `Prep Time: ${recipe.prep_time}`},
                {text: `Cook Time: ${recipe.cook_time}`},
                {text: `Rating: ${recipe.rating}`},
                {text: `Difficulty: ${recipe.level}`},
                {text: `${recipe.description}`}
              ]} /> :
              <>
                <p className="RecipeContainer-recipe-p">Prep Time: {recipe.prep_time}</p>
                <p className="RecipeContainer-recipe-p">Cook Time: {recipe.cook_time}</p>
                <p className="RecipeContainer-recipe-p">{recipe.description}</p>
              </>
            }
          </div>
        ))
        : <h1>NO RECIPES</h1>
      }
    </>
  );
}

export default RecipeContainer;
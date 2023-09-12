import { useState, useEffect, useContext } from 'react';
import useAxios from './hooks/useAxios.js';
import UserContext from './context/UserContext.js';
import RecipeContainer from './RecipeContainer.js';
import RecipeFilter from './RecipeFilter.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
          faSpinner
        } from '@fortawesome/free-solid-svg-icons'
import './Recipes.css';

/**
 * Recipes
 * Props: none
 * Renders recipes page.
*/
const Recipes = () => {
  const { usrData, setUsrData } = useContext(UserContext);
  const chickenParams = { subCategory: "chicken", rating: 5 };
  const pastaParams = { subCategory: "pasta", rating: 5, orderBy: "name" };
  const dessertParams = { subCategory: "dessert", rating: 5, orderBy: "name" };
  const headers = { _token: `Bearer ${usrData.token}`};
  // Chicken req obj.
  const chickenOptions = {method: "get", url: "/recipes", data: {}, params: chickenParams, headers};
  // Pasta req obj.
  const pastaOptions = {method: "get", url: "/recipes", data: {}, params: pastaParams, headers};
  // Dessert req obj.
  const dessertOptions = {method: "get", url: "/recipes", data: {}, params: dessertParams, headers};
  // Request chicken recipes.
  const [ chickenData ] = useAxios(chickenOptions);
  // Request pasta recipes.
  const [ pastaData ] = useAxios(pastaOptions);
  // Request dessert recipes.
  const [ dessertData ] = useAxios(dessertOptions);
  // Request all recipes.
  const [ recipesData, setRecipesData ] = useAxios({method: "get", url: "/recipes", data: {}, params: {}, headers});
  const topFourChickArr = chickenData !== null ? [{...chickenData[0]}, {...chickenData[1]}, {...chickenData[2]}, {...chickenData[3]}] : null;
  const topFourPastaArr = pastaData !== null ? [{...pastaData[0]}, {...pastaData[1]}, {...pastaData[2]}, {...pastaData[3]}] : null;
  const topFourDessertArr = dessertData !== null ? [{...dessertData[0]}, {...dessertData[1]}, {...dessertData[2]}, {...dessertData[3]}] : null;

  return (
    <>
    <h1 className="Recipes-h1">Top Chicken Recipes</h1>
    <div className="Recipes">
      <div className="Recipes-div">
        { topFourChickArr && <RecipeContainer showHide={true} recipeArray={topFourChickArr} /> }
      </div>
      <h1 className="Recipes-h1">Top Pasta Recipes</h1>
      <div className="Recipes-div">
        { topFourPastaArr && <RecipeContainer showHide={true} recipeArray={topFourPastaArr} /> }
      </div>
      <h1 className="Recipes-h1">Top Dessert Recipes</h1>
      <div className="Recipes-div">
        { topFourDessertArr && <RecipeContainer showHide={true} recipeArray={topFourDessertArr} /> }
      </div>
      <h1 className="Recipes-h1">ALL Recipes</h1>
      <div className="Recipes-div">
        <RecipeFilter setState={setRecipesData} />
        { recipesData === null &&
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="Recipes-spinner-icon" />}
        { recipesData && <RecipeContainer showHide={true} recipeArray={recipesData} /> }
      </div>
    </div>
    </>
  );
}

export default Recipes;
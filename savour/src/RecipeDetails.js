import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
          faStar, faFloppyDisk, faCirclePlay,
          faCirclePause, faBackward
        } from '@fortawesome/free-solid-svg-icons'
import Message from './Message.js';
import SavourApi from './models/SavourApi.js';

import CreateListForm from './CreateListForm.js';
import AddToListForm from './AddToListForm.js';
import ReviewForm from './ReviewForm.js';

import useToggleState from './hooks/useToggleState.js';
import useAxios from './hooks/useAxios.js';
import UserContext from './context/UserContext.js';
import './RecipeDetails.css';

/**
 * RecipeDetails
 * Props: none
 * Renders recipe details.
*/
const RecipeDetails = () => {
  const { id } = useParams();
  const { usrData, setUsrData } = useContext(UserContext);

  // Create request header.
  const headers = { _token: `Bearer ${usrData.token}`};
  // Recipe options and request data.
  const options = {method: "get", url: `/recipes/${id}`, data: {}, params: {}, headers};
  const [ recipeData ] = useAxios(options);
  const recipeId = recipeData ? recipeData[0].id : null;
  // Recipe review data.
  const rvwOpts = {method: "get", url: `/recipes/${id}/reviews`, data: {}, params: {}, headers};
  const [ recipeRvwData, setRecipeRvwData ] = useAxios(rvwOpts);
  // Boolean to see if clicked button is fav or sav.
  const [ isFavButton, setIsFavButton ] = useState(false);
  const [ recipeDtlsId, setRecipeDtlsId ] = useState(null);
  const [ occId, setOccId ] = useState(null);
  // Shoplists options and request data.
  const shopListUrl = `/users/${usrData.userId}/shoppinglists`;
  const shopLstOpts = {method: "get", url: shopListUrl, data: {}, params: {}, headers};
  const [ shoplists, setShoplists ] = useAxios(shopLstOpts);
  const usrHasShopList = shoplists && recipeData ? shoplists.some(list => list.recipe_id === recipeData[0].id) : null;
  // Recipelists options and request data.
  const recpListUrl = `/users/${usrData.userId}/recipelists`;
  const recpLstOpts = {method: "get", url: recpListUrl, data: {}, params: {}, headers};
  const [ recipelists, setRecipelists ] = useAxios(recpLstOpts);
  // Recipelists occasions options and request data.
  const OccOpts = {method: "get", url: `/occasions`, data: {}, params: {}, headers};
  const [ occasionData ] = useAxios(OccOpts);

  /**
   * MDN WEB SPEECH API VARIABLES AND STATE
  */
  const synth = window.speechSynthesis;
  const speech = recipeData ? new SpeechSynthesisUtterance(recipeData[0].steps) : null;
  const [ isPause, setIsPause ] = useToggleState(false);
  const [ isPlay, setIsPlay ] = useToggleState(false);
  /**
   * WEB SPEECH API VARIABLES AND STATE END
  */

  /**
   * STEPS PARSE
  */
  /**
 * makeParagraphArr
 * Defines array for first 6 sentences, the every 5 sentences.
 * Arguments: str
 * Returns: new nested array.
 * makeParagraphArr(
 *  "Hello. Hi. How are you?
 *   I. Me. Him. Timber. Hello. Hi.
 *   How are you? I. Me. Him. Timber.
 *   Hi. How are you? I. Me. Him. Timber.
 *   Hello. Hi. How are you? I. Me. Him. Timber. Hi"
 * ) =>
 * [
 *  ['Hello. ', 'Hi. ', 'How are you? I. ', 'Me. ', 'Him. ', 'Timber.'],
 *  ['Hello. ', 'Hi. ', 'How are you? I. ', 'Me. ', 'Him.'],
 *  ['Timber. ', 'Hi. ', 'How are you? I. ', 'Me. ', 'Him.'],
 *  ['Timber. ', 'Hello. ', 'Hi. ', 'How are you? I. ', 'Me.'],
 *  ['Him. ', 'Timber. ', 'Hi']
 * ]
 */
  function makeParagraphArr (str) {
    const sentenceArr = str.split(". ");
    const sentencesArr = [];
    const loopSentenceArr = [];
    sentenceArr.forEach((str, idx) => {
        if (idx !== 0 && idx % 5 === 0) {
            loopSentenceArr.push(str + ".");
            sentencesArr.push([...loopSentenceArr]);
            loopSentenceArr.length = 0;
        }
        else if (idx + 1 === sentenceArr.length && idx % 5 !== 0) {
            loopSentenceArr.push(str);
            sentencesArr.push([...loopSentenceArr]);
        }
        else loopSentenceArr.push(str + ". ");
    });
    return sentencesArr;
  }
  const newSteps = recipeData ? makeParagraphArr (recipeData[0].steps) : null;
  /**
   * STEPS PARSE END
  */

  const isReveiws = recipeRvwData ? recipeRvwData.length > 0 : null;
  const [ favSavSucc, setFavSavSucc ] = useToggleState(false);
  const [ favdOrSavd, setFavdOrSavd ] = useToggleState(false);
  const [ formErrMsg, setFormErrMsg ] = useState(null);
  const [ succMsg, setSuccMsg ] = useState(null);
  const [ isSubmitted, setIsSubmitted ] = useToggleState(false);
  const [ invalidForm, setInvalidForm ] = useToggleState(false);
  const [ isRvwBtn, setIsRvwBtn ] = useToggleState(false);

  const [ formReqMade, setFormReqMade ] = useToggleState(false);
  const [ reqMadeSucc, setReqMadeSucc ] = useToggleState(false);

  const savOrFavRecipe = async (recipeId, fav=true) => {
    setIsFavButton(fav);
    setRecipeDtlsId(recipeId);
    // Set isSubmitted to true.
    setIsSubmitted();
  }

  useEffect(() => {
    const favOrSav = async () => {
      try {
        const endPt = isFavButton ? "favorite-recipes" : "saved-recipes";
        const favSavUrl = `/users/${usrData.userId}/${endPt}`;
        const favSavReq = await SavourApi.request("get", favSavUrl, {}, {}, headers);
        const favSavReqIds = favSavReq.data.map(recipe => recipe.id);
        const favSavReqHasRecId = favSavReqIds.includes(recipeDtlsId);
        const favSavReReqUrl = favSavReqHasRecId ? `${favSavUrl}/${recipeDtlsId}` : favSavUrl;
        const dataObj = favSavReqHasRecId ? {} : { recipe_id: recipeDtlsId };
        const favSavReqMethod =  favSavReqHasRecId ? "delete" : "post";
        const req = await SavourApi.request(favSavReqMethod, favSavReReqUrl, dataObj, {}, headers);
        const favMsg = isFavButton && favSavReqMethod === "delete"
            ? "Removed recipe from favorites!" : "Added recipe to favorites!";
        const savMsg = !isFavButton && favSavReqMethod === "delete"
            ? "Removed recipe from saved recipes!" : "Added recipe to saved recipes!";
        const msg = isFavButton ? favMsg : savMsg;
        setSuccMsg(() => msg);
        // Set isSubmitted to false.
        setIsSubmitted();
        // Set liked or disliked state to true.
        setFavdOrSavd();
        // Set liked or disliked success state to true.
        setFavSavSucc();
        // Set liked or disliked state to false.
        setTimeout(setFavdOrSavd, 3000);
        // Set liked or disliked success state to false.
        setTimeout(setFavSavSucc, 3000);
        setRecipeDtlsId(null);
        setTimeout(() => setIsFavButton(false), 3000);
        setTimeout(() => setSuccMsg(null), 3000);
      } catch(err) {
        // Set liked or disliked state to true.
        setFavdOrSavd();
        const error = err.response.data.error.message;
        setFormErrMsg(() => error || "Error");
        setInvalidForm();
        setTimeout(setInvalidForm, 3000);
        // Set isSubmitted to false.
        setTimeout(setIsSubmitted, 3000);
        // Set liked or disliked state to false.
        setTimeout(setFavdOrSavd, 3000);
        setRecipeDtlsId(null);
        setTimeout(() => setFormErrMsg(null), 3000);
      }
    }

    const resetRecipeSpeech = () => {
      synth.cancel();
    }

    if (isSubmitted) favOrSav();
    if (recipeData) resetRecipeSpeech();
  }, [isSubmitted, recipeData]);

  /**
   * WEB SPEECH FUNCTIONS
  */
  const speak = () => {
    if (isPause) {
      synth.resume();
      setIsPause();
    }
    speech && synth.speak(speech);
    if (!isPlay) setIsPlay();
  }

  const pause = () => {
    if (!isPause && isPlay) {
      synth.pause();
      setIsPause();
    }
  }

  const reset = () => {
    synth.cancel();
    setIsPause(() => false);
    setIsPlay(() => false);
  }
  /**
   * WEB SPEECH FUNCTIONS END
  */

  return (
    <>
    {/* RECIPE DETAILS */}
    <h1 className="RecipeDetails-h1">{recipeData && `${recipeData[0].name} by ${recipeData[0].author}`}</h1>
    { recipeData &&
      <div className="RecipeDetails">
        <div className="RecipeDetails-div">
          <div className="RecipeDetails-float-img-div">
            <img src={recipeData[0].image}></img>
          </div>
          <div className="RecipeDetails-float-div">
            <h2 className="RecipeDetails-subtitle">Descritpion</h2>
            <p className="RecipeDetails-p">{recipeData[0].description}</p>

            <h2 className="RecipeDetails-subtitle">Source Link</h2>
            <a href={recipeData[0].url} className="RecipeDetails-short-text">Visit Site</a>

            <h2 className="RecipeDetails-subtitle">Rating</h2>
            <p className="RecipeDetails-short-text">{recipeData[0].rating}</p>

            <h2 className="RecipeDetails-subtitle">Level</h2>
            <p className="RecipeDetails-short-text">{recipeData[0].level}</p>

            <h2 className="RecipeDetails-subtitle">Serves</h2>
            <p className="RecipeDetails-short-text">{recipeData[0].serves}</p>

            <h2 className="RecipeDetails-subtitle">Prep Time</h2>
            <p className="RecipeDetails-short-text">{recipeData[0].prep_time}</p>

            <h2 className="RecipeDetails-subtitle">Cook Time</h2>
            <p className="RecipeDetails-short-text">{recipeData[0].cook_time}</p>
            <div className="RecipeDetails-icons-float">
              <FontAwesomeIcon
                onClick={() => savOrFavRecipe(recipeData[0].id)}
                className="RecipeDetails-icons"
                icon={faStar} />
              <FontAwesomeIcon
                onClick={() => savOrFavRecipe(recipeData[0].id, false)}
                className="RecipeDetails-icons"
                icon={faFloppyDisk} />
            </div>
            <div className="RecipeDetails-msg">
            {
              favdOrSavd &&
                <Message msgObj={
                  {
                    class: favSavSucc ? "success" : "fail",
                    msg: favSavSucc ? succMsg : formErrMsg
                  }
                } />
            }
            </div>
          </div>
        </div>
        {/* RECIPE INGREDIENTS AND STEPS */}
        <div className="RecipeDetails-div">
          <div className="RecipeDetails-float-ul-div">
            <h2 className="RecipeDetails-subtitle">Ingredients</h2>
            <ul className="RecipeDetails-ul">
              {recipeData[0].ingredients.map(ingrd => (
                <li key={`${ingrd.qty}-${ingrd.ingredient_id}`}>{ingrd.qty} {ingrd.unit !== "no unit" ? ingrd.unit : null} {ingrd.ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="RecipeDetails-float-steps-div">
            <h2 className="RecipeDetails-subtitle">Steps</h2>
            { newSteps &&
              newSteps.map(arr => (
                <p className="RecipeDetails-p">{arr}</p>
              ))
            }
            {/* WEB SPEECH ICONS */}
            <FontAwesomeIcon
                onClick={reset}
                className="RecipeDetails-icons"
                icon={faBackward} />
            <FontAwesomeIcon
                onClick={pause}
                className="RecipeDetails-icons"
                icon={faCirclePause} />
            <FontAwesomeIcon
                onClick={speak}
                className="RecipeDetails-icons"
                icon={faCirclePlay} />
            {/* WEB SPEECH ICONS END */}
          </div>
        </div>

        {/* ADD RECIPE TO A SHOPPING OR RECIPE LIST */}
        <h1 className="RecipeDetails-h1">Add Recipe To A List</h1>
          <div className="RecipeDetails-div">
            {/* SHOPLISTS FORMS */}
            <div className="RecipeDetails-float-div-full">
              <h2 className="RecipeDetails-subtitle">Add Recipe to Shoppinglist</h2>
                { usrHasShopList !== null && usrHasShopList
                ?
                  <Link exact="true" to="/shoppinglists">
                    <p>Recipe has Shoplist already! Go To Shopping Lists!</p>
                  </Link>
                :
                  <CreateListForm recipeId={recipeId} setState={setShoplists} />
                }
            </div>

            {/* RECIPELISTS FORMS */}
            <div className="RecipeDetails-float-div-full">
                { recipelists && recipelists.length > 0
                  ?
                    <h2 className="RecipeDetails-subtitle">Add Recipe to Recipelist</h2>
                  :
                    <h2 className="RecipeDetails-subtitle">Create a Recipelist</h2>
                }
                { recipelists && recipelists.length > 0
                  ?
                    <AddToListForm
                      recipelist={true}
                      recipelistSelectRecipe={{
                        id: recipeData[0].id,
                        name: recipeData[0].name
                      }} />
                  :
                  <CreateListForm recipelist={true} setState={setRecipelists} />
                }
            </div>
          </div>
            

          <h1 className="RecipeDetails-h1">Recipe Reviews</h1>
            <ReviewForm recipeId={id} setState={setRecipeRvwData} />
            <button
              onClick={setIsRvwBtn}
              className="ReviewForm-form-button">VIEW REVIEWS</button>
            { isRvwBtn &&
              <div className="RecipeDetails-div">
              { isReveiws ?
                recipeRvwData.map((rvw, idx) => (
                  <div className="RecipeDetails-no-float-div" key={`div-${rvw.user_id}`}>
                    <p key={`stars-${rvw.user_id}`}>{rvw.stars}</p>
                    <p key={`review-${rvw.user_id}`}>{rvw.review}</p>
                  </div>
                ))
              :
                <div className="RecipeDetails-no-float-div">
                  <p>No reviews!</p>
                </div>
              }
              </div>
            }
      </div>
    }
    </>
  );
}

export default RecipeDetails;
import { useContext, useState, useEffect } from 'react';
import useAxios from './hooks/useAxios.js';
import UserContext from './context/UserContext.js';
import SavourApi from './models/SavourApi.js';
import useToggleState from './hooks/useToggleState.js';
import Message from './Message.js';
import './AddToListForm.css';
/**
 * AddToListForm
 * Props: recipelist, setState, setToggleState, recipelistSelectRecipe
 * Renders: renders form to add to recipe or shoppinglist.
*/
const AddToListForm = ({recipelist=false, setState=false, setToggleState=false, recipelistSelectRecipe=false}) => {
  // Destructure context.
  const { usrData, setUsrData } = useContext(UserContext);
  // Create req header for authen.
  const headers = { _token: `Bearer ${usrData.token}`};
  // Recipe request.
  const recipeOpts = { method: "get", url: `/recipes`, data: {}, params: {}, headers };
  const [ recipeData ] = useAxios(recipeOpts);
  // Occasion request.
  const OccOpts = { method: "get", url: `/occasions`, data: {}, params: {}, headers };
  const [ occasionData ] = useAxios(OccOpts);
  // Url for form request.
  const listReReqUrlEndPt = recipelist ? "recipelists" : "shoppinglists";
  const listReReqUrl = `/users/${usrData.userId}/${listReReqUrlEndPt}`;
  const recipelistUrl = `/users/${usrData.userId}/recipelists`;
  const recpLstOpts = {method: "get", url: recipelistUrl, data: {}, params: {}, headers};
  const [ recipelists, setRecipelists ] = useAxios(recpLstOpts);

  const [ listUrl, setListUrl ] = useState(null);
  const [ isRecipeList, setIsRecipeList ] = useToggleState(false);
  const [ isSubmitted, setIsSubmitted ] = useToggleState(false);

  const initialState = {
    shoplistName: "", recipelistName: "",
    occasionId: "", recipelistId: "",
    recipeId: recipelistSelectRecipe !== false ? recipelistSelectRecipe.id : ""
  };

  const [ formData, setFormData ] = useState(initialState);
  const [ formReqMade, setFormReqMade ] = useToggleState(false);
  const [ formErrMsg, setFormErrMsg ] = useState(null);
  const [ succMsg, setSuccMsg ] = useState(null);
  const [ isFormReqSucc, setIsFormReqSucc ] = useToggleState(false);

  /**
   * setReqUrl
   * args: shop
   * sets state with submitted form data,
   * which gets used in useEffect.
  */
  const setReqUrl = (shop=true) => {
    const userId = usrData.userId;
    // Check for occasion id from recipelist form data.
    const reclistId = formData.recipelistId;
    if (!shop && reclistId === "") {
      setFormErrMsg("Must select a list!");
      setFormReqMade();
      setTimeout(setFormReqMade, 3000);
      setTimeout(() => setFormErrMsg(null), 3000);
    } else {
      if (!shop) setListUrl(`/users/${userId}/recipelists/${reclistId}`);
      if (!shop) setIsRecipeList();
      else setListUrl(`/users/${userId}/shoppinglists`);
      setIsSubmitted();
    }
  }

  useEffect(() => {
    const createList = async () => {
      try {
        const data = isRecipeList ?
            { recipe_id: +formData.recipeId }
            : { recipe_id: +formData.recipeId, list_name: formData.shoplistName }

        const listReq = await SavourApi.request("post", listUrl, data, {}, headers);
        setSuccMsg(isRecipeList ? "Added item to list!" : "Created list for recipe!");
        setFormReqMade();
        setIsFormReqSucc();
        const reReq = await SavourApi.request("get", listReReqUrl, {}, {}, headers);

        if (setState) setTimeout(setState(() => [...reReq.data]), 3000);
        if (setToggleState) setTimeout(setToggleState, 3000);
        setTimeout(setIsSubmitted, 3000);
        if (isRecipeList) setTimeout(setIsRecipeList, 3000);
        setTimeout(setFormReqMade, 3000);
        setTimeout(setIsFormReqSucc, 3000);
        setTimeout(() => setSuccMsg(null), 3000);
        setTimeout(() => setListUrl(null), 3000);
      } catch(err) {
        console.log("ERROR!", err);
        const error = err.response.data.error.message;
        const isErrObj = typeof err.message === "object";
        const isErrorObj = typeof error === "object";
        const errMsg = isErrObj ? null : err.message;
        const errorMsg = isErrorObj ? null : error;
        setFormErrMsg(() => errorMsg || errMsg || "Error!");
        setFormReqMade();
        setTimeout(setIsSubmitted, 3000);
        if (isRecipeList) setTimeout(setIsRecipeList, 3000);
        setTimeout(setFormReqMade, 3000);
        setTimeout(() => setFormErrMsg(null), 3000);
        setTimeout(() => setListUrl(null), 3000);
      }
    }

    if (isSubmitted) createList();
  }, [isSubmitted])

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setFormData(data => ({
      ...data,
      [name]: value
    }))
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
  }

  return (
    <>
    { !recipelist
      ?
        <form onSubmit={handleSubmit} className="AddToListForm-form">
        <div className="AddToListForm-form-field">
          <label htmlFor="shoplistName">List Name</label>
          <input
            id="shoplistName"
            type="text"
            name="shoplistName"
            placeholder="Type a list name"
            onChange={handleChange}
            value={formData.shoplistName} />
        </div>
        <div className="AddToListForm-form-field">
          <label htmlFor="recipeId">Recipes</label>
          <select
            id="recipeId"
            name="recipeId"
            onChange={handleChange}
            value={formData.recipeId}>
            <option key="select-a-recipe" value="">Select a Recipe</option>
            { recipeData &&
              recipeData.map(recipe => (
                <option key={`${recipe.id}`} value={`${recipe.id}`}>{recipe.name}</option>
              ))
            }
          </select>
        </div>
        <div className="AddToListForm-form-submit">
        <div className="AddToListForm-msg-div">
          { formReqMade &&
            <Message msgObj={
              {
                class: isFormReqSucc ? "success" : "fail",
                msg: isFormReqSucc ? succMsg : formErrMsg
              }
            } />
          }
        </div>
          <button onClick={setReqUrl}>CREATE LIST</button>
        </div>
        </form>
      :
        <form onSubmit={handleSubmit} className="AddToListForm-form">
          <div className="AddToListForm-form-field">
          <label htmlFor="reclistRecAdd">Recipelists</label>
          <select
            id="reclistRecAdd"
            name="recipelistId"
            onChange={handleChange}
            value={formData.recipelistId}>
            <option key="recipelistId" value="">Select a Recipelist</option>
              { recipelists &&
                recipelists.map(recipelist => (
                  <option key={`${recipelist.id}`} value={`${recipelist.id}`}>{recipelist.list_name}</option>
                ))
              }
          </select>
          </div>
          <div className="AddToListForm-form-field">
            <label htmlFor="reclistRecAdd">Recipes</label>
          <select
            id="recipeId"
            name="recipeId"
            onChange={handleChange}
            value={formData.recipeId}>
            { recipeData && recipelistSelectRecipe === false ?
              <option key="recipeId" value="">Select a Recipe</option>
            :
              <option key="recipeId" value={recipelistSelectRecipe.id}>{recipelistSelectRecipe.name}</option>
            }
            { recipeData && recipeData.length &&
              recipeData.map(recipe => (
                <option key={`${recipe.id}`} value={`${recipe.id}`}>{recipe.name}</option>
              ))
            }
          </select>
          </div>
          <div className="AddToListForm-form-submit">
          <div className="AddToListForm-msg-div">
            { formReqMade &&
              <Message msgObj={
                {
                  class: isFormReqSucc ? "success" : "fail",
                  msg: isFormReqSucc ? succMsg : formErrMsg
                }
              } />
            }
          </div>
          <button
            onClick={
              () => setReqUrl(false)
            }>ADD TO LIST</button>
          </div>
        </form>
    }
    </>
  );
}

export default AddToListForm;
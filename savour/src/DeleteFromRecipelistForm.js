import { useContext, useState, useEffect, memo } from 'react';
import useAxios from './hooks/useAxios.js';
import UserContext from './context/UserContext.js';
import SavourApi from './models/SavourApi.js';
import useToggleState from './hooks/useToggleState.js';
import Message from './Message.js';
import './DeleteFromRecipelistForm.css';
/**
 * DeleteFromRecipelistForm
 * Props: recipelistId, setState, list
 * Renders form to delete recipe from recipelist.
*/
const DeleteFromRecipelistForm = memo(({ recipelistId, setState, list }) => {
  const { usrData, setUsrData } = useContext(UserContext);
  const headers = { _token: `Bearer ${usrData.token}`};

  const recipeListUrl = `/users/${usrData.userId}/recipelists/${recipelistId}`;
  const recipelistOpts = { method: "get", url: recipeListUrl, data: {}, params: {}, headers };
  const [ recipelistData, setRecipelistData ] = useAxios(recipelistOpts);
  const [ listUrl, setListUrl ] = useState(null);
  const [ isSubmitted, setIsSubmitted ] = useToggleState(false);

  const initialState = {
    recipeId: ""
  };

  const [ formData, setFormData ] = useState(initialState);
  const [ formReqMade, setFormReqMade ] = useToggleState(false);
  const [ formErrMsg, setFormErrMsg ] = useState(null);
  const [ succMsg, setSuccMsg ] = useState(null);
  const [ isFormReqSucc, setIsFormReqSucc ] = useToggleState(false);

  const setReqUrl = () => {
    const userId = usrData.userId;
    // Check for occasion id from recipelist form data.
    const recipeId = formData.recipeId;
    if (recipeId === "") {
      setFormErrMsg("Must select a recipe!");
      setFormReqMade();
      setTimeout(setFormReqMade, 3000);
      setTimeout(() => setFormErrMsg(null), 3000);
    } else {
      setListUrl(`/users/${userId}/recipelists/${recipelistId}/${recipeId}`);
      setIsSubmitted();
    }
  }

  useEffect(() => {
    const deleteRecipelistRecipe = async () => {
      try {
        const listReq = await SavourApi.request("delete", listUrl, {}, {}, headers);
        setSuccMsg(listReq.data.message);
        setFormReqMade();
        setIsFormReqSucc();
        setTimeout(setIsSubmitted, 3000);
        setTimeout(setFormReqMade, 3000);
        setTimeout(setIsFormReqSucc, 3000);
        setTimeout(() => setSuccMsg(null), 3000);
        const listReReq = await SavourApi.request("get", recipeListUrl, {}, {}, headers);
        if (setState) setTimeout(() => setState(listReReq.data), 3000);
        setTimeout(() => setRecipelistData(listReReq.data), 3000);
        setTimeout(() => setListUrl(null), 3000);
      } catch(err) {
        const error = err.response.data.error.message;
        const isErrObj = typeof err === "object";
        const isErrorObj = typeof error === "object";
        const errMsg = isErrObj ? "Error!" : err;
        const errorMsg = isErrorObj ? "Error!" : error;
        setFormErrMsg(() => errMsg || errorMsg);
        setFormReqMade();
        setTimeout(setIsSubmitted, 3000);
        setTimeout(setFormReqMade, 3000);
        setTimeout(() => setFormErrMsg(null), 3000);
        setTimeout(() => setListUrl(null), 3000);
      }
    }

    if (isSubmitted) deleteRecipelistRecipe();
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
    {
      <form onSubmit={handleSubmit} className="DeleteFromRecipelistForm-form">
        <div className="DeleteFromRecipelistForm-form-field">
          <label htmlFor="recipeId">Select a Recipe</label>
          <select
            id="recipeId"
            name="recipeId"
            onChange={handleChange}
            value={formData.recipeId}>
            <option key="select-a-recipe" value="">Select a Recipe</option>
            { list &&
              list.recipes.map(recipe => (
                <option key={`${recipe.id}`} value={`${recipe.id}`}>{recipe.name}</option>
              ))
            }
          </select>
        </div>
        <div className="DeleteFromRecipelistForm-form-submit">
          <div className="DeleteFromRecipelistForm-msg-div">
            { formReqMade &&
              <Message msgObj={
                {
                  class: isFormReqSucc ? "success" : "fail",
                  msg: isFormReqSucc ? succMsg : formErrMsg
                }
              } />
            }
          </div>
          <button onClick={setReqUrl}>DELETE</button>
        </div>
        </form>
      }
    </>
  );
})

export default DeleteFromRecipelistForm;
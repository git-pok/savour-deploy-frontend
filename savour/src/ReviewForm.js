import { useContext, useState, useEffect, memo } from 'react';
import useAxios from './hooks/useAxios.js';
import UserContext from './context/UserContext.js';
import SavourApi from './models/SavourApi.js';
import useToggleState from './hooks/useToggleState.js';
import Message from './Message.js';
import './ReviewForm.css';
/**
 * ReviewForm
 * Props: recipeId, setState
 * Renders form to create recipe review.
*/
const ReviewForm = memo(({ recipeId, setState }) => {
  const { usrData, setUsrData } = useContext(UserContext);
  const headers = { _token: `Bearer ${usrData.token}`};
  const [ isFormBtn, setIsFormBtn ] = useToggleState(false);
  const [ isSubmitted, setIsSubmitted ] = useToggleState(false);
  const [ listUrl, setListUrl ] = useState(null);
  const initialState = {
    stars: "", review: ""
  };

  const [ formData, setFormData ] = useState(initialState);
  const [ formReqMade, setFormReqMade ] = useToggleState(false);
  const [ formErrMsg, setFormErrMsg ] = useState(null);
  const [ succMsg, setSuccMsg ] = useState(null);
  const [ isFormReqSucc, setIsFormReqSucc ] = useToggleState(false);

  const setReqUrl = () => {
    const stars = formData.stars;
    const review = formData.review;
    if (stars === "" || review === "") {
      setFormErrMsg("Must select all fields!");
      setFormReqMade();
      setTimeout(setFormReqMade, 3000);
      setTimeout(() => setFormErrMsg(null), 3000);
    } else {
      setListUrl(`/recipes/${recipeId}/reviews`);
      setIsSubmitted();
    }
  }

  useEffect(() => {
    const createReview = async () => {
      try {
        const stars = formData.stars;
        const review = formData.review;
        const data = { user_id: usrData.userId, stars: +stars, review };
        const rvwReq = await SavourApi.request("post", listUrl, data, {}, headers);
        setSuccMsg("Created review!");
        setFormReqMade();
        setIsFormReqSucc();
        setTimeout(setIsSubmitted, 3000);
        setTimeout(setFormReqMade, 3000);
        setTimeout(setIsFormReqSucc, 3000);
        setTimeout(() => setSuccMsg(null), 3000);
        setTimeout(() => setListUrl(null), 3000);
        const listReReq = await SavourApi.request("get", `/recipes/${recipeId}/reviews`, {}, {}, headers);
        if (setState) setTimeout(() => setState(() => listReReq.data), 3000);
      } catch(err) {
        console.log("ERROR", err);
        const error = err.response.data.error.message;
        const isErrObj = typeof err.message === "object";
        const isErrorObj = typeof error === "object";
        const errMsg = isErrObj ? null : err.message;
        const errorMsg = isErrorObj ? null : error;
        const dupError = err.response.data.error.message.code === "23505" ? "User wrote review already!" : null;
        setFormErrMsg(() => dupError || errorMsg || errMsg || "Error!");
        setFormReqMade();
        setTimeout(setIsSubmitted, 3000);
        setTimeout(setFormReqMade, 3000);
        setTimeout(() => setFormErrMsg(null), 3000);
        setTimeout(() => setListUrl(null), 3000);
      }
    }

    if (isSubmitted) createReview();
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
      <button
        onClick={setIsFormBtn}
        className="ReviewForm-form-button">WRITE REVIEW</button>
      { isFormBtn &&
        <form onSubmit={handleSubmit} className="ReviewForm-form">
          <div className="ReviewForm-form-field">
            <label htmlFor="stars">Stars</label>
            <input
              id="stars"
              type="number"
              name="stars"
              min="1"
              max="5"
              placeholder="Select a star count"
              onChange={handleChange}
              value={formData.stars} />
          </div>
          <div className="ReviewForm-form-field">
            <label htmlFor="review">Review</label>
            <input
              id="review"
              type="text"
              name="review"
              placeholder="Write a review"
              onChange={handleChange}
              value={formData.review} />
          </div>
          <div className="ReviewForm-form-submit">
          <div className="ReviewForm-msg-div">
            { formReqMade &&
              <Message msgObj={
                {
                  class: isFormReqSucc ? "success" : "fail",
                  msg: isFormReqSucc ? succMsg : formErrMsg
                }
              } />
            }
          </div>
            <button onClick={setReqUrl}>SUBMIT</button>
          </div>
        </form>
      }
    </>
  );
})

export default ReviewForm;
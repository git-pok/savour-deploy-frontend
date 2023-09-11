import { useState, useEffect, useContext } from 'react';
import Message from './Message.js';
import SavourApi from './models/SavourApi.js';
import useToggleState from './hooks/useToggleState.js';
import UserContext from './context/UserContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSliders } from '@fortawesome/free-solid-svg-icons'
import './RecipeFilter.css';

/**
 * RecipeFilter
 * Props: setState
 * Renders a filter icon and form.
*/
const RecipeFilter = ({ setState }) => {
  const { usrData, setUsrData } = useContext(UserContext);
  const headers = { _token: `Bearer ${usrData.token}`};

  const initialState = {
    subCategory: "", name: "", author: "",
    rating: "", orderBy: "", orderBy2: "",
    chronOrder: ""
  };
  
  const [ formData, setFormData ] = useState(initialState);
  const [ formErrMsg, setFormErrMsg ] = useState(null);
  const [ isSubmitted, setIsSubmitted ] = useToggleState(false);
  const [ invalidForm, setInvalidForm ] = useToggleState(false);
  const [ isFilter, setIsFilter ] = useToggleState(false);

  const toggleFilter = (() => {
    setIsFilter();
  });

  useEffect(() => {
    const filterRecipes = async () => {
      try {
        const formDataArr = Object.entries(formData);
        const recipesFltrParams = {};
        formDataArr.forEach(prop => {
          if (prop[1] !== "") recipesFltrParams[prop[0]] = prop[1]; 
        })

        const req = await SavourApi.request("get", "/recipes", {}, recipesFltrParams, headers);

        setState(() => (
          req.data
        ));
        // Set isSubmitted to false.
        setIsSubmitted();
        // setFormData(() => initialState);

      } catch (err) {
        const error = err.response.data.error.message;
        setFormErrMsg(() => error || "Error");
        setInvalidForm();
        setTimeout(setInvalidForm, 3000);
        // Set isSubmitted to false.
        setTimeout(setIsSubmitted, 3000);
      }
    }

    if (isSubmitted) filterRecipes();

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
    // Set isSubmitted to true.
    setIsSubmitted();
  }

  return (
    <>
      <FontAwesomeIcon
      icon={faSliders}
      className="RecipeFilter-filter-ico"
      onClick={toggleFilter} />
    <div className="RecipeFilter-filter">
    { isFilter &&
      <form onSubmit={handleSubmit} className="RecipeFilter-form">
        <div className="RecipeFilter-form-field">
          <label htmlFor="subCategory">Sub Category</label>
          <select
            id="subCategory"
            name="subCategory"
            onChange={handleChange}
            value={formData.subCategory}>
              <option value="">None</option>
              <option value="lunch">Lunch</option>
              <option value="breakfast">Breakfast</option>
              <option value="sweet treats">Sweet Treats</option>
              <option value="dinner">Dinner</option>
              <option value="storecupboard">Storecupboard</option>
              <option value="desserts">Desserts</option>
              <option value="cheese">Cheese</option>
              <option value="fish and seafood">Fish and Seafood</option>
              <option value="pasta">Pasta</option>
              <option value="vegan">Vegan</option>
              <option value="kids' baking">Kids' Baking</option>
              <option value="meat">Meat</option>
              <option value="chicken">Chicken</option>
              <option value="savoury pastries">Savoury Pastries</option>
              <option value="keto">Keto</option>
              <option value="low calorie">Low Calorie</option>
              <option value="salads">Salads</option>
              <option value="vegan baking">Vegan Baking</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="bread">Bread</option>
              <option value="cakes">Cakes</option>
              <option value="quick bakes">Quick Bakes</option>
              <option value="biscuit recipes">Biscuit Recipes</option>
              <option value="high protein">High Protein</option>
              <option value="free from baking">Free From Baking</option>
              <option value="smoothies">Smoothies</option>
              <option value="fitness & lifestyle">Fitness & Lifestyle</option>
          </select>
        </div>
        <div className="RecipeFilter-form-field">
          <label htmlFor="name">Recipe Name</label>
          <input
              type="text"
              id="name"
              onChange={handleChange}
              value={formData.name}
              name="name"
              placeholder="Type a recipe name"></input>
        </div>
        <div className="RecipeFilter-form-field">
          <label htmlFor="author">Author</label>
          <input
              type="text"
              id="author"
              onChange={handleChange}
              value={formData.author}
              name="author"
              placeholder="Type a recipe author"></input>
        </div>
        <div className="RecipeFilter-form-field">
          <label htmlFor="rating">Rating</label>
          <input
              type="number"
              id="rating"
              onChange={handleChange}
              value={formData.rating}
              name="rating"
              placeholder="Type a recipe rating"></input>
        </div>
        <div className="RecipeFilter-form-field">
          <label htmlFor="orderBy">Order By</label>
          <select
            id="orderBy"
            name="orderBy"
            onChange={handleChange}
            value={formData.orderBy}>
              <option value="">None</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="author">Author</option>
          </select>
        </div>
        <div className="RecipeFilter-form-field">
          <label htmlFor="orderBy2">Order By 2</label>
          <select
            id="orderBy2"
            name="orderBy2"
            onChange={handleChange}
            value={formData.orderBy2}>
              <option value="">None</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="author">Author</option>
          </select>
        </div>
        <div className="RecipeFilter-form-field">
          <label htmlFor="chronOrder">Sort Order</label>
          <select
            id="chronOrder"
            name="chronOrder"
            onChange={handleChange}
            value={formData.chronOrder}>
              <option value="">None</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
          </select>
        </div>
        <div className="RecipeFilter-form-submit">
          {
            invalidForm &&
            <Message msgObj={
              {
                class: "fail",
                msg: formErrMsg ? formErrMsg : "Error!"
              }
            } />
          }
          <button>SUBMIT</button>
        </div>
      </form>
    }
    </div>
    </>
  );
}

export default RecipeFilter;
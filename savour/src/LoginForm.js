import { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Message from './Message.js';
import SavourApi from './models/SavourApi.js';
import useLocalStorage from './hooks/useLocalStorage.js';
import useToggleState from './hooks/useToggleState.js';
import jwt_decode from 'jwt-decode';
import UserContext from './context/UserContext.js';
import './LoginForm.css';

/**
 * LoginForm
 * Props: formValsCheck
 *    formValsCheck: function to check if
 *     form props are missing.
 * Renders login form.
*/
const LoginForm = ({ formValsCheck }) => {
  const initialState = {
      username: "", password: ""
  };

  const [ formErrMsg, setFormErrMsg ] = useState(null);
  const [ formData, setFormData ] = useState(initialState);
  const [ isSubmitted, setIsSubmitted ] = useToggleState(false);
  const [ invalidForm, setInvalidForm ] = useToggleState(false);
  const { usrData, setUsrData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const login = async () => {
      try {
        const { username, password } = formData;
        const data = { username, password };
        const regResult = await SavourApi.request("post", "/users/login", data);
        const token = regResult.data[0].user.token;
        SavourApi.token = token;
        const payload = await jwt_decode(token);
        payload.token = token;

        setUsrData(data => (
          payload
        ));
        // Set isSubmitted to false.
        setIsSubmitted();
        setFormData(() => initialState);
        history.push("/");
      } catch (err) {
        console.log("ERROR", err);
        // Define variable for API error.
        const error = err.response.data ? err.response.data.error.message : null;
        const isErrObj = typeof err.message === "object";
        const isErrorObj = typeof error === "object";
        const errMsg = isErrObj ? null : err.message;
        const errorMsg = isErrorObj ? null : error;
        setFormErrMsg(() => errorMsg || errMsg || "Error!");
        setInvalidForm();
        setTimeout(setInvalidForm, 3000);
        // Set isSubmitted to false.
        setTimeout(setIsSubmitted, 3000);
      }
    }

    if (isSubmitted) login();

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
    // Checks if form props are missing.
    const isValMsn = formValsCheck(["username", "password"], formData);
    // If props are missing set invalidForm.
    if (isValMsn) {
      setFormErrMsg(() => "All fields must be complete!");
      setInvalidForm();
      setTimeout(setInvalidForm, 3000);
    }
    // Set isSubmitted to true if all props exist.
    else setIsSubmitted();
  }

  return (
    <>
    <h1 className="LoginForm-h1">Login</h1>
    <form onSubmit={handleSubmit} className="LoginForm">
      <div className="LoginForm-field">
        <label htmlFor="username">Username</label>
        <input
            type="text"
            id="username"
            onChange={handleChange}
            value={formData.username}
            name="username"
            placeholder="Type a username"
            autoComplete="username"></input>
      </div>
      <div className="LoginForm-field">
        <label htmlFor="password">Password</label>
        <input
            type="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            name="password"
            placeholder="Type a password"
            autoComplete="current-password"></input>
      </div>
      <div className="LoginForm-submit">
      {
        invalidForm &&
        <Message msgObj={
          {
            class: "fail",
            msg: formErrMsg ? formErrMsg : "Error!"
          }
        } />
      }
        <button data-testid="sbmtBtn">SUBMIT</button>
      </div>
    </form>
    </>
  );
}

export default LoginForm;
import React, { useReducer, useRef, useState, useContext, createContext } from "react";
import ReactDOM from "react-dom";
import "./App.css";

// Context for form management
const LoginContext = createContext();

// Reducer for managing form state
const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return { name: "", email: "" };
    default:
      throw new Error("Invalid action type");
  }
};

// Modal Component for Error Messages
const ErrorModal = ({ message, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

// Login Form Component
const LoginForm = () => {
  const { formState, dispatch } = useContext(LoginContext);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email) {
      setError("All fields are required!");
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    nameRef.current.focus();
  };

  const closeModal = () => {
    setError("");
  };

  if (isLoggedIn) {
    return <h1>Hello, {formState.name}</h1>;
  }

  return (
    <div className="form-container">
      {error && <ErrorModal message={error} onClose={closeModal} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            ref={nameRef}
            id="name"
            type="text"
            value={formState.name}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            ref={emailRef}
            id="email"
            type="email"
            value={formState.email}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
            }
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>
    </div>
  );
};

// Main App Component
const App = () => {
  const [formState, dispatch] = useReducer(formReducer, { name: "", email: "" });

  return (
    <LoginContext.Provider value={{ formState, dispatch }}>
      <LoginForm />
    </LoginContext.Provider>
  );
};

export default App;

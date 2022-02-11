import { useState } from "react";
import PropTypes from "prop-types";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={submit} id="login-form">
        <div>
          username
          <input
            id="username"
            value={username}
            name="username"
            onChange={({ target }) => {
              setUsername(target.value);
            }}
          />
        </div>
        <div>
          password
          <input
            id="password"
            value={password}
            name="password"
            type="password"
            onChange={({ target }) => {
              setPassword(target.value);
            }}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;

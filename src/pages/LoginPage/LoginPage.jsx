import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";
import { useTheme } from "../../context/ThemeContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { isDarkMode } = useTheme();

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className={`LoginPage min-h-screen flex items-center justify-center`}>
      <div className={`p-8 ${isDarkMode ? 'dark' : 'light'} rounded shadow-md w-70vw sm:w-96`}>
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <form onSubmit={handleLoginSubmit}>
          <div className="input-group mb-4 column">
            <input type="email" className="input-style" name="email" value={email} onChange={handleEmail} />
            <label className="label ${isDarkMode ? 'bg-gray-800' : 'bg-white'} `el">Email:</label>
          </div>

          <div className="input-group mb-4 column">
            <div className="flex relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
                className="input-style relative"
              />
            </div>
            <label className="label ${isDarkMode ? 'bg-gray-800' : 'bg-white'} `">Password:</label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 rounded-md hover:bg-pink-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}

        <p className="mt-4 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-pink-400">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
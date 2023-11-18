import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import { useTheme } from '../../components//ThemeContext';
import './SignupPage.css';

function SignupPage() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name };

    authService
      .signup(requestBody)
      .then((response) => {
        navigate('/login');
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (

    <div className={`SignupPage min-h-screen flex items-center justify-center`}>
      <div className={`p-8 ${isDarkMode ? 'dark' : 'light'} rounded shadow-md w-70vw sm:w-96`}>
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

        <form onSubmit={handleSignupSubmit}>
          <div className="input-group mb-4 column">
            <input type="text" className="input-style" name="name" value={name} onChange={handleName} />
            <label className="label">Name:</label>
          </div>

          <div className="input-group mb-4 column">
            <input
              type="email"
              name="email"
              value={email}
              required
              onChange={handleEmail}
              className="input-style"
              placeholder=""
            />
            <label className="label">Email:</label>
          </div>

          <div className="input-group mb-4 column">
            <div className="flex relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handlePassword}
                className="input-style relative"
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <label className="label">Password:</label>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}

        <p className="mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-pink-600 hover:text-pink-400">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

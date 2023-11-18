import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import { useTheme } from '../../components//ThemeContext';
import './SignupPage.css';
import { AuthContext } from '../../context/auth.context'; 

function SignupPage() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false); // New state
  const navigate = useNavigate();

  const { isLoggedIn, storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => {
    setPassword(e.target.value);
    // Check password requirements and update the state accordingly
    const hasUpperCase = /[A-Z]/.test(e.target.value);
    const hasLowerCase = /[a-z]/.test(e.target.value);
    const hasNumber = /\d/.test(e.target.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(e.target.value);
    const isLengthValid = e.target.value.length >= 8;
    setShowPasswordRequirements(
      hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLengthValid
    );
  };

  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name };

    authService
      .signup(requestBody)
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

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

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
            {showPasswordRequirements && (
              <div className="text-sm text-gray-500 mt-2">
                Password must have at least 8 characters, including uppercase, lowercase,
                number, and special character.
              </div>
            )}
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
          Already have an account?{' '}
          <Link to="/login" className="text-pink-600 hover:text-pink-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

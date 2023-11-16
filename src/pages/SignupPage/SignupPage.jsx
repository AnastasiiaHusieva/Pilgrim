import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
        navigate("/login");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="SignupPage bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

        <form onSubmit={handleSignupSubmit}>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleName}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              required
              onChange={handleEmail}
              className="input-style"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePassword}
                className="input-style"
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}

        <p className="mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-500">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

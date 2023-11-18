import "./HomePage.css";
import Maps from "../../components/Maps.jsx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context.jsx";
import { useContext, useEffect, useState } from "react";

function HomePage() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  if (logOutUser) {
  }
  return (
    <h1>
      <div>
        <p>Choose your travel destination</p>
      </div>
      <Maps />
    </h1>
  );
}

export default HomePage;

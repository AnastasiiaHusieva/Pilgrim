import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import UserProfilePage from "./pages/ProfilePage/UserProfilePage";
import Notifications from "./pages/Notifications/Notifications";
import SinglePostPage from "./pages/Newsfeed/SinglePostPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import NavbarBottom from "./components/Navbar/NavbarBottom";
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import InboxPage from "./pages/InboxPage/InboxPage";
import Newsfeed from "./pages/Newsfeed/Newsfeed";
import LikesPage from "./components/Likes/LikesPage";
import CommentsPage from "./components/Comments/CommentsPage";
import Messages from "./pages/messages/messages";
import { useTheme } from './context/ThemeContext';
import { useState, useContext } from "react";

function App() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`App max-w-screen-xs mx-auto w-screen h-screen flex flex-col ${isDarkMode ? "dark" : "light"}`}>
      <Navbar className="w-screen" />
      <div className="w-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/profile"
            element={
              <IsPrivate>
                <ProfilePage />
              </IsPrivate>
            }
          />

          <Route
            path="/profile/:userId"
            element={
              <IsPrivate>
                <UserProfilePage />
              </IsPrivate>
            }
          />

          <Route
            path="/notifications/:userId"
            element={
              <IsPrivate>
                <Notifications />
              </IsPrivate>
            }
          />

          <Route
            path="/signup"
            element={
              <IsAnon>
                <SignupPage />
              </IsAnon>
            }
          />
          <Route
            path="/login"
            element={
              <IsAnon>
                <LoginPage />
              </IsAnon>
            }
          />
          <Route
            path="/chat/:currentUserId"
            element={
              <IsPrivate>
                <InboxPage />
              </IsPrivate>
            }
          />
          <Route
            path={`/chat/:userId/:chatId/messages`}
            element={
              <IsPrivate>
                <Messages />
              </IsPrivate>
            }
          />

          <Route
            path="/posts/:cityId"
            element={
              <IsPrivate>
                <Newsfeed />
              </IsPrivate>
            }
          />

          <Route
            path="/posts/post/:postId"
            element={
              <IsPrivate>
                <SinglePostPage />
              </IsPrivate>
            }
          />

          <Route
            path="/likes/:postId"
            element={
              <IsPrivate>
                <LikesPage />
              </IsPrivate>
            }
          />
          <Route
            path="/comments/:postId"
            element={
              <IsPrivate>
                <CommentsPage />
              </IsPrivate>
            }
          />
        </Routes>
      </div>
      <NavbarBottom />
    </div>
  );
}

export default App;

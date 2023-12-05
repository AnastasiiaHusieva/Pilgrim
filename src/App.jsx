import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
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

import { useState } from "react";

function App() {
  return (
    <div className="App max-w-screen-xs mx-auto h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/profile/"
          element={
            <IsPrivate>
              <ProfilePage />
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

      <NavbarBottom />
    </div>
  );
}

export default App;

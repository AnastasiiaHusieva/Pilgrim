import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
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

import { useState } from "react";

function App() {
  return (
    <div className="App max-w-screen-xs mx-auto h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
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

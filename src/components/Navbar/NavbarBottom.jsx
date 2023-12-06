import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
// import notificationData from "../../notification.json";
// import { ReactComponent as Gear } from "../icon/arrowDown.svg";
import { ReactComponent as Message } from "../icon/message.svg";
import { ReactComponent as Notification } from "../icon/notification.svg";
import React from "react";
import axios from "axios";

// import { Fragment } from "react";
// import { Menu, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/outline";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavbarBottom() {
  const [userImg, setUserImg] = useState("");
  const [numberOfMessage, setNewNumberOfMessage] = useState(0);
  const { isLoggedIn, user } = useContext(AuthContext);
  const userId = user?._id;
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadLikesCount, setUnreadLikesCount] = useState(0);
  const [unreadCommentsCount, setUnreadCommentsCount] = useState(0);
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/notifications/unread-notifications-count/${userId}`
        );
        //setUnreadLikesCount(response.data.unreadLikesCount);
        //setUnreadCommentsCount(response.data.unreadCommentsCount);
        setUnreadNotifications(
          response.data.unreadLikesCount + response.data.unreadCommentsCount
        );
      } catch (error) {
        console.error("Axios error:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    // Clean up the interval when the component unmounts or when userId changes
    return () => clearInterval(intervalId);
  }, [userId]);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const getPhoto = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/${user._id}`
        );
        setUserImg(getPhoto.data.photo);
        console.log(userImg);
      } catch (err) {
        console.log("this is the image fetching axios fetch", err);
      }
    };
    fetchPhoto();
  }, [isLoggedIn]);

  useEffect(() => {
    // const userID = user._id;
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/chat/recieved/${user._id}`
        );
        const newMessage = response.data;
        console.log("this is what im logging ", newMessage);
        const mapChatAndUnreadMessages = newMessage.map((chat) => {
          const unreadMessagesCount = chat.messages.filter(
            (message) => !message.isRead
          ).length;
          return unreadMessagesCount;
        });

        const totalUnreadMessageCount = mapChatAndUnreadMessages.reduce(
          (acc, count) => acc + count,
          0
        );

        console.log(totalUnreadMessageCount);
        setNewNumberOfMessage(totalUnreadMessageCount);
      } catch (error) {
        console.log("this is the messages of the users fetch error ", error);
      }
    };
    // fetchNotifications();
     const interval = setInterval(() => {
       fetchNotifications();
     }, 2000);
    return () => clearInterval(interval);
  }, [numberOfMessage]);
  console.log("this are the messages", numberOfMessage);
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop

  return (
    <nav className=" bottom-0 bg-teal-light xs:hidden z-50 border-t-black  border-t-2 pt-1 min-w-screen ">
      <div className=" flex justify-center gap-20 items-center">
        {isLoggedIn ? (
          <Link to={`/notifications/${user._id}`}>
            <div className="avatar ">
              <Notification
                className=" h-10 inline-flex w-full justify-center  bg-teal-light px-3  font-semibold "
                style={{ stroke: "black" }}
              ></Notification>
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
          </Link>
        ) : (
          ""
        )}
        <Link
          to={isLoggedIn ? (currentPath === "/" ? "/profile" : "/") : "login"}
        >
          <div className="avatar ">
            <div>
              <div className={isLoggedIn ? "w-12" : "w-25 flex  "}>
                {isLoggedIn ? (
                  <div className="flex">
                    <button>
                      <img
                        className="  rounded-full border-2 border-black"
                        src={userImg}
                        alt=""
                      />{" "}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center h-full pt-3">
                    <Link to={"/login"} className="text-white">
                      {" "}
                      Log in !
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
        {isLoggedIn ? (
          <Link to={`/chat/${user._id}`}>
            <div className="avatar ">
              <Message
                className=" h-11 inline-flex w-full justify-center  bg-teal-light px-3  font-semibold "
                style={{ stroke: "black" }}
              ></Message>
              <p className="absolute top-1 right-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {numberOfMessage}
              </p>
            </div>
          </Link>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
}

export default NavbarBottom;

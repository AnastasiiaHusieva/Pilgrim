import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import notificationData from "../../notification.json";
import { ReactComponent as Gear } from "../icon/arrowDown.svg";
import React from "react";
import axios from "axios";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useTheme } from "../../context//ThemeContext";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const Navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const userId = user?._id;
  const [userImg, setUserImg] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const location = useLocation();
  const currentPath = location.pathname;
  const [numberOfMessage, setNewNumberOfMessage] = useState(0);
  const handlelogOutUser = () => {
    logOutUser();
    Navigate("/login");
  };

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
          `${process.env.REACT_APP_SERVER_URL}/chat/recieved/${user._id}`
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
  return (
    <nav
      className={` bg-gray ${isDarkMode ? "bg-gray-300" : "bg-gray-100"} h-15`}
    >
      <div className="flex justify-between items-center pl-2 pr-2">
        <Link to={`/`}>
          <div className="p-1 w-50 h-12">
           {isDarkMode ?  <img className="p-1 w-50 h-12" src="/imgs/longerlogo.png" alt="" /> :  <img className="p-1 w-50 h-12" src="/imgs/longerlogolight.png" alt="" />}
          </div>
        </Link>
        <div className="hidden md:block">
          <div className=" flex justify-center gap-20 items-center">
            {isLoggedIn ? (
              <Link to={`/notifications/${user._id}`}>
                <div className="avatar w-10">
                  <img
                    className={` w-full w-5 h-5 ${
                      isDarkMode ? "bg-gray-300" : "bg-gray-100"
                    } `}
                    src="/imgs/notification.png"
                    alt=""
                  />
                  {/* <Notification
                className={` h-10 inline-flex w-full justify-center  ${isDarkMode? 'bg-gray-400' : 'bg-gray-100'} px-3  font-semibold `}
                style={{ stroke: "black" }}
              ></Notification> */}
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
              to={
                isLoggedIn ? (currentPath === "/" ? "/profile" : "/") : "login"
              }
            >
              <div className="avatar ">
                <div>
                  <div className={isLoggedIn ? "w-10" : "w-25 flex  "}>
                    {isLoggedIn ? (
                      <div className="flex rounded-full">
                        <button className=" w-8 rounded-full">
                          {userImg ? (
                            <img
                              className=" rounded-full"
                              src={userImg}
                              alt=""
                            />
                          ) : (
                            <img
                              className=" w-5 "
                              src="/imgs/user.png"
                              alt=""
                            />
                          )}
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
                <div className="avatar  w-10 ">
                  <img
                    className={` w-full w-5 h-5 ${
                      isDarkMode ? "bg-gray-300" : "bg-gray-100"
                    } `}
                    src="/imgs/msg.png"
                    alt=""
                  />
                  {/* <Message
                className={` h-11 inline-flex w-full justify-center  ${isDarkMode? 'bg-gray-400' : 'bg-gray-100'} px-3  font-semibold `}
                style={{ stroke: "black" }}
              ></Message> */}
                  <p className="absolute top-1 right-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {numberOfMessage}
                  </p>
                </div>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
        <div>
          <Menu as="div" className="relative inline-block m-2 w-8 left-[10%]">
            <div>
              <Menu.Button>
                <img src="/imgs/settings.png" alt="settings icon" />
                {/* // <Gear
                //   className={` inline-flex w-full justify-center  ${isDarkMode? 'bg-gray-300' : 'bg-gray-100'} px-3  font-semibold `}
                //   style={{ stroke: "black" }}
                // ></Gear> */}
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-1 z-10 mt-2 w-20 origin-top-right rounded-md bg- shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-90 bg-gray-200 ">
                <div className="py-1">
                  {/* <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={classNames(
                          active
                            ? "font-bold bg-gray-100 text-gray-900"
                            : "font-bold text-peach-dark",
                          "font-bold block px-4 py-2 text-sm"
                        )}
                        to="/"
                      >
                        <button>Home</button>
                      </Link>
                    )}
                  </Menu.Item> */}
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active
                            ? "font-bold bg-gray-100 text-gray-900"
                            : "font-bold text-black",
                          "font-bold block px-4 py-2 text-sm"
                        )}
                      >
                        {isLoggedIn && (
                          <>
                            <button onClick={handlelogOutUser}>Logout</button>
                            <br></br>
                            <br></br>
                            <Link to="/profile">
                              <button>Profile</button>
                              {/* <img src="https://picsum.photos/id/402/200/300" style={{ width: 50, height: 50, borderRadius: 25}} alt="profile" /> */}
                            </Link>
                          </>
                        )}

                        {!isLoggedIn && (
                          <>
                            <Link to="/signup">
                              <button>Sign Up</button>{" "}
                            </Link>
                            <br></br>
                            <br></br>
                            <Link to="/login">
                              {" "}
                              <button>Login</button>{" "}
                            </Link>
                          </>
                        )}
                      </div>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

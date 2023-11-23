import "./Navbar.css";
import { Link } from "react-router-dom";
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
  const [numberOfMessage, setNewNumberOfMessage] = useState(null);
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  // console.log(currentUserId);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/chat/${user.id}`
        );
        const newMessage = response.data;
        console.log(newMessage);
        if (newMessage.length !== numberOfMessage) {
          setNewNumberOfMessage(newMessage.length);
        }
      } catch (error) {
        console.log("Error feching data");
      }
    };
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, [numberOfMessage]);
  console.log(numberOfMessage);
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop

  return (
    <nav className=" bottom-0 bg-teal-light xs:hidden z-50 border-t-black  border-t-2 pt-1">
      <div className=" flex justify-center gap-20 items-center">
        {isLoggedIn ? (
          <Link to={"/notification"}>
            <div className="avatar ">
              <Notification
                className=" h-10 inline-flex w-full justify-center  bg-teal-light px-3  font-semibold "
                style={{ stroke: "black" }}
              ></Notification>
            </div>
          </Link>
        ) : (
          ""
        )}
        <Link to={"/"}>
          <div className="avatar ">
            <div>
              <div className={isLoggedIn ? "w-12" : "w-25 flex  "}>
                {isLoggedIn ? (
                  <div className="flex">
                    <button>
                      <img
                        className="  rounded-full border-2 border-black"
                        src="/imgs/leo.jpg"
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

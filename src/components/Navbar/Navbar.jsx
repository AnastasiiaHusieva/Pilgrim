import "./Navbar.css";
import { Link } from "react-router-dom";
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
import { useTheme } from '../../context//ThemeContext';
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const Navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const handlelogOutUser = () => {
    logOutUser();
    Navigate("/login");
  };
  return (
    <nav className={` bg-gray ${isDarkMode? 'bg-gray-300' : 'bg-gray-100'} xs:hidden`}>
      <div className="flex justify-between items-center pl-2 pr-2">
        <div>
          <img
            className="p-1 w-12 h-12 rounded"
            src="/imgs/logo-dark.png"
            alt=""
          />
          {/* <p className="text-peach-dark ">Pilgrim</p> */}
        </div>

        <div>
          <Menu
            as="div"
            className="relative inline-block m-2 w-8 left-[10%]"
          >
            <div>
              <img src="/imgs/settings.png" alt="settings icon" />
              {/* <Menu.Button>
                <Gear
                  className={` inline-flex w-full justify-center  ${isDarkMode? 'bg-gray-300' : 'bg-gray-100'} px-3  font-semibold `}
                  style={{ stroke: "black" }}
                ></Gear>
              </Menu.Button> */}
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
              <Menu.Items className="absolute right-1 z-10 mt-2 w-20 origin-top-right rounded-md bg- shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-90 bg-teal-light ">
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

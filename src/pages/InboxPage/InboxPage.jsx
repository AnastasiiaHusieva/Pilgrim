import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
// const getToken = () => localStorage.getItem("token");

function InboxPage() {
  const [chat, setNewChat] = useState([]);
  const [firstMessage, setFirstMessage] = useState([]);
  // const [userId, setUserId] = useState("");

  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const todaysDate = new Date();
  console.log("!!!!!!!!!!!", chat);

  // console.log("**********", messageDate);
  console.log("@@@@@@@@@@", user._id);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // const token = getToken();
        // console.log(token);
        const userChat = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/chat/${user._id}`
        );
        console.log("%%%%%%%%%%%%", userChat);

        // Assuming userChat.data is anChat of users
        const onGoingChats = userChat.data;
        const updatedChats = await Promise.all(
          onGoingChats.map(async (chat) => {
            const recipientDetails = await fetchRecipientDetails(
              user._id === chat.recipientId ? chat.senderId : chat.recipientId
            );
            return {
              ...chat,
              user: recipientDetails.name,
              email: recipientDetails.email,
            };
          })
        );
        setNewChat(updatedChats);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    fetchNotifications();
  }, []);
  const fetchRecipientDetails = async (recipientId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/user/${recipientId}`
      );
      return response.data; // Assuming the API returns user details
    } catch (error) {
      console.log("Error fetching recipient details", error);
      return {}; // Return an empty object or handle the error as needed
    }
  };
  console.log("hello", chat);
  return (
    <div className="text-xs min-w-screen screen-xs">
      <h1 className="pt-2 pb-5">INBOX</h1>
      <ul className="w-12 text-xs ">
        {chat.map((chat, id) => (
          <Link>
            {" "}
            <li className="flex p-1 pb-4 gap-2 items-start" key={chat._id}>
              {" "}
              <img
                className=" w-8 h-8 rounded-full "
                src="/imgs/leo.jpg"
                alt=""
              />{" "}
              <h2 className="">
                <strong>{chat.user}</strong>{" "}
              </h2>
              <div>
                <p className="w-60 text-md">{chat.messages[0].text}...</p>
                <p className="font-bold">
                  {todaysDate ===
                  new Date(chat.messages[0].createdAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })
                    ? todaysDate
                    : new Date(chat.messages[0].createdAt).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default InboxPage;

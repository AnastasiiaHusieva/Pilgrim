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

  const { user } = useContext(AuthContext);
  const todaysDate = new Date();
  // console.log("!!!!!!!!!!!", chat);

  // console.log("**********", messageDate);
  // console.log("@@@@@@@@@@", user._id);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const senderChats = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/chat/${user._id}`
        );

        const recipientChats = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/chat/recipient/${user._id}`
        );

        const combinedChats = [...senderChats.data, ...recipientChats.data];

        const updatedChats = await Promise.all(
          combinedChats.map(async (chat) => {
            const otherUserId =
              user._id === chat.recipientId ? chat.senderId : chat.recipientId;

            const chatDetails = await fetchRecipientDetails(otherUserId);

            return {
              ...chat,
              user: chatDetails.name,
              email: chatDetails.email,
            };
          })
        );

        setNewChat(updatedChats);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    fetchChats();
  }, [user._id]);

  // Assuming this is inside a React component

  const fetchRecipientDetails = async (senderOrRecipient) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/user/${senderOrRecipient}`
      );
      return response.data; // Assuming the API returns user details
    } catch (error) {
      console.log("Error fetching recipient details", error);
      return {}; // Return an empty object or handle the error as needed
    }
  };
  console.log("AAAAAA", chat);
  // const promises = chat.map((singleChat) => {
  //   return axios
  //     .get(
  //       `${process.env.REACT_APP_SERVER_URL}/chat/recipient/${singleChat.recipientId}`
  //     )
  //     .then((response) => {
  //       console.log("Success fetching recipient details:", response.data);
  //       return response.data;
  //     })
  //     .catch((err) => {
  //       console.log("Error fetching recipient details", err);
  //       return {}; // Return an empty object or handle the error as needed
  //     });
  // });

  // Promise.all(promises)
  //   .then((allRecipientData) => {
  //     console.log("All recipient data:", allRecipientData);
  //     // Now you can use allRecipientData as an array containing the data from all requests.
  //   })
  //   .catch((error) => {
  //     console.log("Error fetching chat details", error);
  //   });

  // console.log("hello", chat[0].recipientId);
  return (
    <div className="text-xs min-w-screen screen-xs">
      <h1 className="pt-2 pb-5">INBOX</h1>
      <ul className="w-12 text-xs ">
        {chat.map((chat, id) => (
          <Link
            to={`/chat/${user._id}/${
              chat._id
            }/messages?user=${encodeURIComponent(JSON.stringify(chat))}`}
            key={chat._id}
          >
            <li className="flex p-1 pb-4 gap-2 items-start">
              {/* <img
                className=" w-8 h-8 rounded-full "
                src="/imgs/leo.jpg"
                alt=""
              />{" "} */}
              <h2 className="">
                <strong>{chat.user}</strong>
              </h2>
              <div>
                <p className="w-60 text-md">
                  {chat.messages.length >= 0
                    ? chat.messages[chat.messages.length - 1].text
                    : ""}
                  ...
                </p>
                <p className="font-bold">
                  {todaysDate ===
                  new Date(
                    chat.messages.length >= 0 ? chat.messages[0].createdAt : ""
                  ).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })
                    ? todaysDate
                    : new Date(
                        chat.messages.length >= 0
                          ? chat.messages[0].createdAt
                          : ""
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
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

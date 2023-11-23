import { useEffect, useState, useContext } from "react";
import React from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
// const getToken = () => localStorage.getItem("token");

function InboxPage() {
  const [chat, setNewChat] = useState([]);
  // const [userId, setUserId] = useState("");

  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

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
              chat.recipientId
            );
            return { ...chat, user: recipientDetails.name };
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
    <div>
      <h1>INBOX</h1>
      {chat.map((chat) => (
        <div> {chat.user}</div>
      ))}
    </div>
  );
}

export default InboxPage;

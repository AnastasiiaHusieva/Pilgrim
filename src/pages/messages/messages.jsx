import { useContext, useState, useEffect, useReducer } from "react";
import { AuthContext } from "../../context/auth.context";
import { useLocation } from "react-router-dom";
import TextArea from "../../components/sendmessagebox/TextArea";
import axios from "axios";
import Pusher from "pusher-js";

function Messages() {
  const [isRead, setIsRead] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [chat, setChat] = useState([]);

  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const userParam = new URLSearchParams(location.search).get("user");
  const chatData = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;
  // console.log("chat data", chatData._id);

  useEffect(() => {
    getChat();

    const pusher = new Pusher("210b1e6c2a39887244dc", {
      cluster: "eu",
      encrypted: true,
    });
    const channel = pusher.subscribe(`chat`);
    channel.bind(`message`, (data) => {
      console.log(chatData._id === data._id);
      console.log("Message data: ", data);
      if (chatData._id === data._id) {
        setChat(data);
      }
    });
  }, []);

  console.log(chat.messages);
  const { user } = useContext(AuthContext);
  const userId = user._id;

  const getChat = async () => {
    try {
      // Fetch chat data
      const thisChat = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/inbox/messages/${chatData._id}`
      );
      setChat(thisChat.data);
      setLoading(false);

      console.log("USERID: ", userId);
      console.log(
        "SENDERID: ",
        thisChat.data.messages[thisChat.data.messages.length - 1].senderId
      );

      if (
        userId !==
        thisChat.data.messages[thisChat.data.messages.length - 1].senderId
      ) {
        const isRead = await axios.patch(
          `${process.env.REACT_APP_SERVER_URL}/inbox/messages/isRead/${chatData._id}`
        );
        const isReadData = isRead.data;
        console.log(isReadData);
      }

      // Fetch isRead data
      // Do something with IsReadData if needed
    } catch (error) {
      console.log(error);
    }
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const sendRequest = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/inbox/messages`,
        {
          config: config,
          text: textMessage,
          senderId: userId,
          chatId: chatData._id,
        }
      );
      const createdMessage = sendRequest.data;
      console.log("the created messaged :", createdMessage);
      getChat();
    } catch (error) {
      console.error("error sending message", error);
    }
    setTextMessage("");
  };

  if (!chatData) {
    return <div>No chat data found</div>;
  }

  // Function to format the date as "today," "yesterday," or the actual date
  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (
        messageDate.getDate() === yesterday.getDate() &&
        messageDate.getMonth() === yesterday.getMonth() &&
        messageDate.getFullYear() === yesterday.getFullYear()
      ) {
        return "Yesterday";
      } else {
        return messageDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }
  };

  let currentGroupDate = null;

  return loading ? (
    <div>Loading</div>
  ) : (
    <div className="h-screen flex flex-col">
      <h1 className="p-2">MESSAGES</h1>
      <div className="flex-1 overflow-y-auto">
        {chat.messages.map((eachMessage) => {
          const groupDate = formatDate(eachMessage.createdAt);

          // Render the date header if it's a new group
          const showDateHeader = groupDate !== currentGroupDate;
          currentGroupDate = groupDate;
          return (
            <div key={eachMessage._id} className="text-left">
              {showDateHeader && (
                <div className="text-center text-gray-500 p-2">{groupDate}</div>
              )}

              <div
                className={`${
                  userId === eachMessage.senderId
                    ? "right p-2 chat chat-end text-left"
                    : "left p-2 chat chat-start text-left"
                }`}
              >
                <div
                  className={`${
                    userId === eachMessage.senderId
                      ? "chat-bubble bg-teal-default text-black text-xs"
                      : "chat-bubble text-xs"
                  }`}
                >
                  {" "}
                  {eachMessage.text}
                  <div className="text-right p-0.5">
                    {new Date(eachMessage.createdAt).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <TextArea
        chatId={chatData._id}
        sendMessage={sendMessage}
        setTextMessage={setTextMessage}
        textMessage={textMessage}
      />
    </div>
  );
}

export default Messages;

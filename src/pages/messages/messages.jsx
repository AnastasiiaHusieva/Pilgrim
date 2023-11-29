import { useContext, useState, useEffect, useReducer } from "react";
import { AuthContext } from "../../context/auth.context";
import { useLocation } from "react-router-dom";
import TextArea from "../../components/sendmessagebox/TextArea";
// import Pusher from "pusher-js";
function Messages() {
  const [isRead, setIsRead] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const pusher = new Pusher(process.env.key, {
  //     cluster: process.env.cluster,
  //     encrypted: true,
  //   });
  //   const channel = pusher.subscribe("messages");
  //   channel.bind("inserted", addMessage);
  // }, []);
  const addMessage = () => {};
  const location = useLocation();
  const userParam = new URLSearchParams(location.search).get("user");
  const chatData = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;
  const { user } = useContext(AuthContext);
  const userId = user._id;
  // console.log("thissssssssssss", userId);
  useEffect(() => {
    setIsRead(true);
  }, [isRead]);

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

  return (
    <div className="h-screen flex flex-col">
      <h1 className="p-2">MESSAGES</h1>
      <div className="flex-1 overflow-y-auto">
        {chatData.messages.map((eachMessage) => {
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
                  {console.log(userId, eachMessage.senderId)}
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
      <TextArea chatId={chatData._id} />
    </div>
  );
}

export default Messages;

import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";

function TextArea({ chatId }) {
  const [textMessage, setTextMessage] = useState("");
  const { user } = useContext(AuthContext);
  const userId = user._id;
  // console.log("my userId", userId);
  // console.log("the chat Id", chatId);
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
          chatId: chatId,
        }
      );
      const createdMessage = sendRequest.data;
      console.log("the created messaged :", createdMessage);
    } catch (error) {
      console.error("error sending message", error);
    }
  };
  return (
    <div className="p-1">
      <form
        onSubmit={sendMessage}
        className=" flex col justify-center gap-4 items-center"
        method="Post"
        action="inbox/messages"
      >
        <div>
          <input
            type="text"
            // value={sendMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            className="input input-bordered input-warning w-full max-w-xs"
          />
        </div>
        <div className="self-center justify-self-center ">
          <button className=" btn btn-xs btn-accent ">Send</button>
        </div>
      </form>
    </div>
  );
}

export default TextArea;

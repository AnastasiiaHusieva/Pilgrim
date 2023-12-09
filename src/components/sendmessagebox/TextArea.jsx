import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth.context";

function TextArea({ chatId, sendMessage, setTextMessage, textMessage }) {
  const { user } = useContext(AuthContext);
  const userId = user._id;
  // console.log("my userId", userId);
  // console.log("the chat Id", chatId);

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
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            className="input input-bordered input-warning w-full max-w-xs"
          />
        </div>
        <div className="self-center justify-self-center ">
          <button className=" btn btn-xs btn-accent text-lg border-none h-10 w-20 rounded-3xl bg-gradient-to-r from-teal-400 to-blue-500 transform transition-transform hover:scale-105">Send</button>
        </div>
      </form>
    </div>
  );
}

export default TextArea;

import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth.context";

function TextArea({ chatId, sendMessage, setTextMessage }) {
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

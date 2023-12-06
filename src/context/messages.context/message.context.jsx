// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// const MessageContext = createContext();

// // CREATE A WRAPPER COMPONENT
// function MessageProviderWrapper(props) {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Fetch messages from the database
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/inbox/messages`
//         );
//         const messagesFromDatabase = response.data; // Adjust this based on your actual API response structure

//         setMessages(messagesFromDatabase);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, []); // Run the effect only once on component mount

//   return (
//     // SET UP THE PROVIDER
//     <MessageContext.Provider value={messages}>
//       {props.children}
//     </MessageContext.Provider>
//   );
// }

// export { MessageContext, MessageProviderWrapper };

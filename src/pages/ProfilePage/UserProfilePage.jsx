import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import { useTheme } from "../../context/ThemeContext";


function UserProfilePage() {
  const [userPar, setUserPar] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userCities, setUserCities] = useState([]);
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [text, setText] = useState("");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/${userId}`
        );
        setUserPar(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/posts/cities/${userId}`
        );
        setUserPosts(response.data);
        const uniqueCities = [
          ...new Set(response.data.map((city) => city.city.name)),
        ];
        setUserCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [userId]);
console.log(userPar)
  const handleStartChat = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/inbox/newchat`, {
        senderId: user._id, 
        recipientId: userId,
        text,
      });

      const newChatId = response.data._id;
      navigate(`/chat/${newChatId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className={`${isDarkMode ? "dark" : "light" } h-screen flex flex-col`}>
      <div className="text-white flex flex-col items-start p-2">
        <div className="w-16 h-16 flex my-5 mx-10 justify-start items-center font-bold text-xl gap-3 pt-3 pb-2">
          {userPar.photo ? (
            <img
              className="w-18 h-18 object-cover rounded-full border-2 border-gray-200"
              src={userPar.photo}
              alt=""
            />
          ) : (
            <div className="top-12">
              <label htmlFor="photo" className="cursor-pointer">
                <div className="w-16 h-16 overflow-hidden rounded-full border-2 border-white">
                  <img
                    src="/imgs/plus.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </label>
            </div>
          )}
          <h1 className="ml-4">{userPar.name}</h1>
        </div>
        <div className="flex flex-col items-start justify-center mx-auto">
        <input
          type="text"
          placeholder="Enter message text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="px-3 py-1 h-8 w-30 rounded-lg border border-gray-300"
          style={{
            color: isDarkMode ? '#fff' : '#000', 
            '::placeholder': {
              color: isDarkMode ? '#fff' : '#000',
            },
          }}
        />
        <button   onClick={handleStartChat} className={`px-8 rounded-lg ml-10 my-7 bg-gradient-to-r from-teal-400 to-blue-500 transform transition-transform hover:scale-105 `}>
            Message
          </button>
        </div>

        {userCities.length < 4 ? (
          <div className="flex gap-8 mx-10 items-center justify-center">
            <p className="font-bold">Cities Visited:</p>
            {userCities.map((city) => (
              <p className="flex flex-col items-center text-lg" key={city}>
                {city}
                <img
                  className="city-img-1 w- h-8"
                  src={
                    city === "Berlin"
                      ? "/brandenburg-gate.png"
                      : city === "Paris"
                      ? "/eiffel-tower.png"
                      : city === "Madrid"
                      ? "/royal-palace.png"
                      : city === "Rome"
                      ? "/colosseum.png"
                      : "/default-image.png"
                  }
                  alt={city.name}
                />
              </p>
            ))}
          </div>
        ) : (
          <p className="text-lg">
            <h2 >Cities Visited {userCities.length}</h2>
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto relative flex flex-col mt-20 p-4">
        {userCities.map((city) => (
          <div key={city} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{city}</h2>
            <div className="mx-10 flex gap-5 flex-wrap shadow-lg">
              {userPosts
                .filter((post) => post.city.name === city)
                .map((filteredPost) => (
                  <Link to={`/posts/post/${filteredPost._id}`} key={filteredPost._id}>
                    <div className="w-40 m-10">
                      <img src={filteredPost.photo} alt="" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfilePage;

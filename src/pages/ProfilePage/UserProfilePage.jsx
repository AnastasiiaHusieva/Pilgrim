import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserProfilePage() {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userCities, setUserCities] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/${userId}`
        );
        setUser(response.data);
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

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <img
          src={user.photo} // Assuming the API returns a 'photo' property
          alt={`${user.name}'s profile`}
        />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {/* Display other user details */}
      </div>

      <div>
        <h1>USER ACTIVITIES</h1>
        {userPosts.map((post) => (
          <div key={post._id}>
            <h3>{post.city.name}</h3>
            <p>{post.caption}</p>
            <img src={post.photo} alt="" />
            {/* Display comments and other post details */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfilePage;

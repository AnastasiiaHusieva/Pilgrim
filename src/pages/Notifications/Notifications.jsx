import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/auth.context'; 
import { Link } from 'react-router-dom';

function NotificationsPage (){
  const { user } = useContext(AuthContext); 
  const [notifications, setNotifications] = useState([]);
  const userId = user._id;
  const authToken = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

    useEffect(() => {
      const markAsReadOnMount = async () => {
        try {
          const url = `${process.env.REACT_APP_SERVER_URL}/mark-notifications-as-read`;
          const response = await axios.post(url, { userId });
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      };
  
      markAsReadOnMount();
    }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
        console.log(userId)
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/notifications/${userId}`);
        setNotifications(response.data)
       // setPosts(response.data.posts)
        console.log(response.data)
       
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, []); 

 
  return (
    <div>
      <h1>Notifications</h1>
        {notifications.map((notification) => (
            <Link
            to={{
              pathname: `/posts/post/${notification.post._id}`,
          }}
            key={notification._id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
          
          <div key={notification._id}>
            {notification.type === 'like' ? (
              <p>{`Liked by ${notification.user.name}`}</p>
            ) : (
              <p>{`Commented by ${notification.user.name}: ${notification.content}`}</p>
            )}
            <img src={notification.post.photo} alt="post photo" />
          </div>
          </Link>
        ))}
    </div>
  );
};

export default NotificationsPage;

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/auth.context';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const userId = user._id;
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };



  useEffect(() => {
    const markAsReadOnMount = async () => {
      try {
        const url = `${process.env.REACT_APP_SERVER_URL}/notifications/mark-notifications-as-read/${userId}`;
        const response = await axios.post(url);
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    };

    markAsReadOnMount();
  }, [userId]);

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
    <div className="w-screen">
      <div className="flex items-center justify-center mx-5 my-5 ">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            {isDarkMode ? <img className="w-5" src="/imgs/backlight.png" alt="arrow back" /> : <img className="w-5" src="/imgs/back.png" alt="arrow back" />}
          </button>
          <h1 className='ml-5 font-bold text-xl'>Notifications</h1>
        </div>
      </div>

      <hr className="mb-10 border-t-0.5 border-gray-600 " />



      <div>
        {notifications.map((notification) => (
          <Link
            to={{
              pathname: `/posts/post/${notification.post._id}`,
            }}
            key={notification._id}
            style={{ textDecoration: 'none', color: 'inherit' }}

          >

            <div className="flex justify-between mx-5 my-3" key={notification._id}>
              {notification.type === 'like' ? (
                <p><span className="font-extrabold">{`${notification.user.name} `}</span><span className='italic'>liked your post</span></p>
              ) : (
                <div>
                  <p>
                    <span className="font-extrabold">{`${notification.user.name} `} </span>
                    <span className='italic'>commented your post:</span>
                    <span className="md:inline hidden">  {`${notification.content}`}</span>
                  </p>
                  <p className="md:hidden inline">{`${notification.content}`}</p>
                </div>
              )}
              <img className="w-10 h-10" src={notification.post.photo} alt="post photo" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default NotificationsPage;

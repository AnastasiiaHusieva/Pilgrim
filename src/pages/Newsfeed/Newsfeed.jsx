import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import { useTheme } from "../../context/ThemeContext";


function Newsfeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [postCount, setPostCount] = useState(0);
  const authToken = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };
  const { user } = useContext(AuthContext);
  const userId = user._id;
  const { cityId } = useParams();
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { isDarkMode } = useTheme();
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingCaption, setEditingCaption] = useState("")


  useEffect(() => {
    if (cityId) {
      fetchNewsfeedPosts();
    }
  }, [cityId, postCount]);


  const fetchNewsfeedPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/posts/${cityId}`,
        { headers }
      );

      setPosts(response.data.posts.reverse());
      setCity(response.data.city)

    } catch (error) {
      console.error("Error fetching newsfeed posts:", error);
    }
  };
  console.log(posts);

  const handleLikeClick = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/likes/${postId}`,
        { userId },
        { headers }
      );
      console.log(response.data);
      setPosts(posts => {
        posts.likes = response.data
        return posts
      })
      await fetchNewsfeedPosts();
    } catch (error) {
      console.error(
        "Error liking post:",
        error.response?.data || error.message
      );
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('photo', photo);
      formData.append('user', userId);
      console.log("Creating post with:", { userId, caption, photo, cityId });
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/posts/${cityId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Post created successfully:", response.data);
      setPostCount((prevCount) => prevCount + 1);
      setPhoto(null)
      setCaption("")
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
    }
  };
  const handleCaptionChange = (e) => {
    e.preventDefault()
    setCaption(e.target.value)
  }

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleEditClick = (postId, currentCaption) => {
    setEditingPostId(postId);
    setEditingCaption(currentCaption);
  };

  const handleUpdateCaption = async (postId) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/posts/${postId}`,
        { caption: editingCaption },
        { headers }
      );
      console.log("Post updated successfully:", response.data);
      await fetchNewsfeedPosts();
      setEditingPostId(null);
    } catch (error) {
      console.error(
        "Error updating post caption:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${postId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        console.log("Post deleted successfully");
        setPostCount((prevCount) => prevCount - 1);
      } else {
        const errorData = await response.json();
        console.error("Error deleting post:", errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={` ${isDarkMode ? 'dark' : 'light'} w-100 mx-5 mt-10 flex flex-col `}>
      <div className="mb-8 px-8 relative">
      <button onClick={() => navigate(-1)} className="cursor-pointer absolute top-0 left-0">
            {isDarkMode ? <img className="w-5" src="/imgs/backlight.png" alt="arrow back" /> : <img className="w-5" src="/imgs/back.png" alt="arrow back" />}
          </button>
        <div className="flex flex-col items-center justify-center mb-8">
        
          <h1 className={`text-4xl pb-4 ${isDarkMode ? 'dark' : 'light'} text-gray-100 font-bold mb-4`}>Welcome to {city.name}! </h1>
          <img
            className="city-img w-20 h-20"
            src={city.name === "Berlin" ? "/brandenburg-gate.png" :
              city.name === "Paris" ? "/eiffel-tower.png" :
                city.name === "Madrid" ? "/royal-palace.png" :
                  city.name === "Rome" ? "/colosseum.png" : "/default-image.png"}
            alt={city.name}
          />

        </div>
        <div className="mb-4 relative">
          <form onSubmit={handleCreatePost} method="post" enctype="multipart/form-data">
            <input
              type="text"
              value={caption}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={(e) => handleCaptionChange(e)}
              // onChange={(e) => setCaption(e.target.value)}
              className={`input relative ${isDarkMode ? 'dark' : 'light'} rounded-2xl border-gray-300 ${isInputFocused ? 'p-20' : 'p-'
                }  w-full pt-2 pl-2 mb-5`}
            />
            {caption.length === 0 && (
              <label className={`${isInputFocused ? 'invisible' : 'visible'} absolute top-2 left-2 text-gray-500 left-3 text-gray-500 pointer-events-none transition-all duration-300`}>
                What's new?
              </label>
            )}

            <div className="absolute top-0 right-0">
              <label
                htmlFor="photo"
                className="inline-block p-2 cursor-pointer"
              >
                <img
                  src="/imgs/paperclipgradient.png"
                  alt="Pin Icon"
                  className="h-7 w-7"
                />
              </label>
              <input
                type="file"
                name="photo"
                id="photo"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="hidden"
              />
            </div>

            <button
              className="btn btn-sm mb-10 btn-accent text-lg text-gray-800 border-none h-10 w-20 rounded-3xl bg-gradient-to-r from-teal-400 to-blue-500 transform transition-transform hover:scale-105"
            >
              Post
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto">
        {posts &&
          posts.map((post) => (
            <Link to={`/posts/post/${post._id}`}>
              <div key={post._id} className="mb-6 p-4 relative rounded-lg shadow-md">
                <div className="mb-4">

                  <Link to={`/profile/${post.user._id}`} className="flex mr-5">
                    <img
                      src={post.user.photo}
                      alt={post.user.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <p className="text-md text-gray-500 font-semibold">
                      {post.user.name}
                    </p>
                  </Link>

                  <div>
                    {editingPostId === post._id ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={editingCaption}
                          onChange={(e) => setEditingCaption(e.target.value)}
                          className={`input ${isDarkMode ? 'dark' : 'light'} rounded-2xl border-gray-300 p-2 w-full pr-10`}
                        />
                        <button
                          className="absolute right-3 top-3"
                          onClick={() => handleUpdateCaption(post._id, editingCaption)}
                        >
                          <img className="w-5" src='/imgs/pencil.png' alt="edit" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {post.user._id === userId && (
                          <button className="absolute right-10 top-1" onClick={() => handleEditClick(post._id, post.caption)}>
                            <img className="w-5" src='/imgs/pencil.png' alt="edit" />
                          </button>
                        )}
                        <p className="text-md text-gray-200 w-5/6  mx-10 mb-2">{post.caption}</p>
                        {post.user._id === userId && (
                          <button className="absolute right-4 top-1" onClick={() => handleDeletePost(post._id)}>
                            <img className="w-5" src='/imgs/delete.png' alt="delete" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {post.photo && (
                    <div className="flex justify-center">
                      <img
                        src={post.photo}
                        alt={`${post.user.name}'s post`}
                        className="mb-2 px-20"
                      />
                    </div>
                  )
                  }
                </div >

                < div className="flex items-center justify-between" >
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/likes/${post._id}`}
                      className="text-gray-100 hover:underline"
                    >
                      <p>{post.likes && post.likes.length}</p>
                    </Link>
                    <button
                      onClick={() => handleLikeClick(post._id)}
                      className="text-gray-100 hover:underline"
                    >
                      {post.likes && post.likes.some((like) => like.user === userId)
                        ? <img className="w-6 mr-2" src="/imgs/heartFull.png" alt="commentIcon" />
                        : <img className="w-6 mr-2" src="/imgs/heartEmpty.png" alt="commentIcon" />}
                    </button>
                  </div>

                  <Link to={`/comments/${post._id}`}>
                    <div className="flex text-gray-100 hover:underline">
                      <img className="w-7 mr-2" src='/imgs/speech-bubble.png' alt="commentIcon" />
                      <p> {post.comments && post.comments.length} </p>
                    </div>
                  </Link>

                </div>
              </div>
            </Link>
          ))
        }
      </div >

    </div >
  );
}

export default Newsfeed;

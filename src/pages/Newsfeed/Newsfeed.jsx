import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import { useParams } from "react-router-dom";


function Newsfeed() {
  const [posts, setPosts] = useState([]);
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
      setPosts(response.data.posts);
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
      //setLikedPosts(response.data)
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

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

// action={`/posts/${cityId}`}
  return (
    <div className="container mx-auto my-8 p-8 rounded-lg">
      <div className="mb-8">
        <h1 className="text-5xl text-gray-100 font-bold mb-4">{city.name}</h1>
        <div className="mb-4 relative">
          <form onSubmit={handleCreatePost} method="post" enctype="multipart/form-data">
            <input
              type="text"
              value={caption}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={(e) => setCaption(e.target.value)}
              className={`input border-gray-300 ${isInputFocused ? 'p-20' : 'p-'
                }  w-full pt-2 pl-2`}
            />
            <label
              className={`${isInputFocused ? 'invisible' : 'visible'
                } absolute top-2 left-3 text-gray-500 pointer-events-none`}
            >
              What's new?
            </label>
            <input
              type="file"
              name="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <button
              className="btn btn-sm btn-accent"
            >
              Post
            </button>
          </form>
        </div>
      </div>
      {/*
       <div className="mb-4">
         <label className="block text-sm font-medium text-gray-600">
           Photo URL:
         </label>
         <input
           type="text"
           value={photo}
           onChange={(e) => setPhoto(e.target.value)}
           className="mt-1 p-2 w-full border rounded-md bg-gray-200"
         />
       </div>
*/}

      <div className="h-screen flex flex-col flex-1 overflow-y-auto">
        {posts &&
          posts.reverse().map((post) => (
            <div key={post._id} className="mb-6 p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={post.user.profilePicture}
                  alt={post.user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <p className="text-md text-gray-500 font-semibold">
                  {post.user.name}
                </p>
              </div>
              <p className="text-md text-gray-200 mb-2">{post.caption}</p>
              {post.photo && (
                <img
                  src={post.photo}
                  alt={`${post.user.name}'s post`}
                  className="mb-2 rounded-lg w-full"
                />
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    to={`/likes/${post._id}`}
                    className="text-gray-100 hover:underline"
                  >
                    {post.likes && post.likes.length}
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
          ))}
      </div>
    </div>
  );
}

export default Newsfeed;

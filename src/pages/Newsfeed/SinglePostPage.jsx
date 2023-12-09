// SinglePostPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { useTheme } from "../../context/ThemeContext";

function SinglePostPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const userId = user._id;
    const [post, setPost] = useState(null);
    const { postId } = useParams();
    const { isDarkMode } = useTheme();
    const authToken = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
    };

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);


    const fetchPost = async () => {
        try {
            if (postId) {
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/posts/post/${postId}`,
                    { headers }
                );
                setPost(response.data.post);
            } else {
                console.error("postId is undefined");
                setPost(null);
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            setPost(null);
        }
    };



    const handleLikeClick = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/likes/${postId}`,
                { userId },
                { headers }
            );
            console.log(response.data);
            await fetchPost();
        } catch (error) {
            console.error("Error liking post:", error.response?.data || error.message);
        }
    };

    if (!post) {
        return <p>Error loading post. Please try again later.</p>;
    }
    return (
        <div className={` ${isDarkMode ? 'dark' : 'light'} w-100 mx-5 mt-10 flex flex-col `}>
            <button onClick={() => navigate(-1)} className="cursor-pointer">
                {isDarkMode ? <img className="w-5" src="/imgs/backlight.png" alt="arrow back" /> : <img className="w-5" src="/imgs/back.png" alt="arrow back" />}
            </button>
            <Link to={`/posts/post/${post._id}`}>
                <div className="mb-6 p-4 relative rounded-lg shadow-md">
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
                        <p className="text-md text-gray-200 w-5/6 mx-10 mb-2">{post.caption}</p>
                        {post.photo && (
                            <div className="flex justify-center">
                                <img
                                    src={post.photo}
                                    alt={`${post.user.name}'s post`}
                                    className="mb-2 px-20"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to={`/likes/${postId}`} className="text-gray-100 hover:underline">
                                <p>{post.likes && post.likes.length}</p>
                            </Link>
                            <button onClick={handleLikeClick} className="text-gray-100 hover:underline">
                                {post.likes && post.likes.some((like) => like.user._id === userId) ? (
                                    <img className="w-6 mr-2" src="/imgs/heartFull.png" alt="commentIcon" />
                                ) : (
                                    <img className="w-6 mr-2" src="/imgs/heartEmpty.png" alt="commentIcon" />
                                )}
                            </button>
                        </div>

                        <Link to={`/comments/${postId}`}>
                            <div className="flex text-gray-100 hover:underline">
                                <img className="w-7 mr-2" src="/imgs/speech-bubble.png" alt="commentIcon" />
                                <p> {post.comments && post.comments.length} </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default SinglePostPage;

import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/auth.context';

function Newsfeed() {
    const [posts, setPosts] = useState([]);
    const authToken = localStorage.getItem("authToken");
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };
    const {user} = useContext(AuthContext);
    const userId = user._id

    useEffect(() => {
        fetchNewsfeedPosts();
    }, []);

    const fetchNewsfeedPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`, { headers });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching newsfeed posts:', error);
        }
    };

    const handleLikeClick = async (postId) => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/likes/${postId}`,
            { userId },
            { headers }
          );
          console.log(response.data);
          fetchNewsfeedPosts();
        } catch (error) {
          console.error('Error liking post:', error);
        }
    };

    return (
        <div>
            <h1>Newsfeed</h1>
            {posts.map(post => (
                <div key={post._id}>
                    <p>{post.caption}</p>
                    <img src={post.photo} alt={`Post by ${post.user.name}`} />
                    <div>
                        <Link to={`/likes/${post._id}`}>{post.likes.length} likes</Link>
                        <button onClick={() => handleLikeClick(post._id)}>
                            {post.likes.includes(userId) ? 'Unlike' : 'Like'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Newsfeed;



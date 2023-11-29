import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/auth.context';
import { useParams } from 'react-router-dom';

function Newsfeed() {
    const [posts, setPosts] = useState([]);
    const authToken = localStorage.getItem("authToken");
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };
    const { user } = useContext(AuthContext);
    const userId = user._id
    const { cityId } = useParams();
    const [caption, setCaption] = useState('');
    const [photo, setPhoto] = useState('');


    useEffect(() => {
        if (cityId) {
            fetchNewsfeedPosts();
        }
    }, [cityId]);

    const fetchNewsfeedPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${cityId}`, { headers });
            setPosts(response.data.posts);
            console.log(response.data); 
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
            console.error('Error liking post:', error.response?.data || error.message);
        }
    };

    const handleCreatePost = async () => {
        try {
            console.log("Creating post with:", { userId, caption, photo, cityId });
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/posts/${cityId}`,
            { user: userId, caption, photo },
            { headers }
          );
          console.log("Post created successfully:", response.data);
        } catch (error) {
          console.error('Error creating post:', error.response?.data || error.message);
        }
      };

    return (
        <div>
            <div>
                <h1>Create Post</h1>
                <div>
                    <label>Caption: </label>
                    <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
                </div>
                <div>
                    <label>Photo URL: </label>
                    <input type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} />
                </div>
                <button onClick={handleCreatePost}>Create Post</button>
            </div>
    
            { posts.map(post => (
                <div key={post._id}>
                    <p>{post.caption}</p>
                    <img src={post.photo} alt={`Post by ${post.user.name}`} />
                    <div>
                        <Link to={`/likes/${post._id}`}>{(post.likes && post.likes.length)} likes</Link>
                        <button onClick={() => handleLikeClick(post._id)}>
                            {post.likes.includes(userId) ? 'Unlike' : 'Like'}
                        </button>
                        <br />
                        <Link to={`/comments/${post._id}`}>{(post.comments && post.comments.length)} comments</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Newsfeed;



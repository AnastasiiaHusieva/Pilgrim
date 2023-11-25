import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function LikesPage() {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { postId } = useParams();
    console.log(postId)
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                setLoading(true);
                console.log(postId)
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/likes/${postId}`);
                console.log(response.data)
                setLikes(response.data);
            } catch (error) {
                console.error('Error fetching likes:', error);
                setError('Error fetching likes. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, [postId]);

    return (
        <div>
            <h2>Likes</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {likes.map((like) => (
                    <li key={like._id}>{like.user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default LikesPage;

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function LikesPage() {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { postId } = useParams();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    console.log(postId)
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/likes/${postId}`);
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
        <div className={`${isDarkMode ? "dark" : 'light'} h-screen`}>
            <div className="flex items-center justify-center gap-5">
            <button onClick={() => navigate(-1)} className="cursor-pointer">
                    {isDarkMode ? <img className="w-5" src="/imgs/backlight.png" alt="arrow back" /> : <img className="w-5" src="/imgs/back.png" alt="arrow back" />}
                </button>
                <img className="w-7 mr-2" src="/imgs/heartEmpty.png" alt="commentIcon" />
                <h2 className="text-2xl text-gray-200 py-5">{likes.length} Likes</h2>
            </div>
            <hr className="mb-10 border-t-0.5 border-gray-600" />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div className="mb-50">
                <ul className="mb-50">
                    {likes.map((like) => (
                        <li className="flex flex-col gap-0 mt-5 shadow-md pb-5" key={like._id}>
                              <Link to={`/profile/${like.user._id}`} >
                            <div className='flex items-start mx-5'>
                                <img src={like.user.photo} alt="" className="w-6 h-6 rounded-full mr-2 shadow-md" />
                                <p className="text-lg"> {like.user.name}</p>
                            </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default LikesPage;

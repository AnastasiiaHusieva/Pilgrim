import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { useTheme } from "../../context/ThemeContext";

function CommentsPage() {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [userData, setUserData] = useState('')
    const [editingCommentId, setEditingCommentId] = useState(null);
    const { postId } = useParams();
    const authToken = localStorage.getItem("authToken");
    const { isDarkMode } = useTheme();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };
    const { user } = useContext(AuthContext);
    const userId = user._id;

    console.log(user)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/${postId}`);
                setComments(response.data.comments.reverse());
                console.log(response.data.comments)
            } catch (error) {
                console.error('Error fetching comments:', error);
                setError('Error fetching comments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${userId}`);
                setUserData(response.data)

            } catch (error) {
                console.error('Error fetching comments:', error);
                setError('Error fetching comments. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchUser()

    }, []);
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCommentId !== null) {
                // Editing existing comment
                await axios.patch(`${process.env.REACT_APP_SERVER_URL}/comments/${editingCommentId}`, {
                    content: newComment,
                });

                setEditingCommentId(null);
            } else {
                // Adding new comment
                await axios.post(`${process.env.REACT_APP_SERVER_URL}/comments/add`, {
                    userId: userId,
                    content: newComment,
                    postId,
                });
            }

            const updatedCommentsResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/${postId}`);
            setComments(updatedCommentsResponse.data.comments.reverse());
            setNewComment('');
        } catch (error) {
            console.error('Error creating/editing comment:', error);
        }
    };

    const handleEditClick = (commentId, currentContent) => {
        setEditingCommentId(commentId);
        setNewComment(currentContent);
    };

    const handleDeleteComment = async (commentId) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/comments/${commentId}`;

        try {
            const response = await axios.delete(url);
            console.log(response.data);
        } catch (error) {
            console.error("Error deleting comment:", error.response?.data || error.message);
        }
    };
    return (
        <div className={`bg-gray-100 ${isDarkMode ? 'dark' : 'light'} h-screen `}>
            <div className="flex items-center justify-center gap-5">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    {isDarkMode ? <img className="w-5" src="/imgs/backlight.png" alt="arrow back" /> : <img className="w-5" src="/imgs/back.png" alt="arrow back" />}
                </button>
                {isDarkMode ? <img className="w-9 h-9" src='/imgs/chatwhite.png' alt="edit" /> : <img className="w-9 h-9" src="/imgs/commentIcon.png" alt="commentIcon" />}
                <h2 className={`${isDarkMode ? 'dark' : 'light'} text-2xl text-gray-200 py-5`}>{comments.length} Comments</h2>
            </div>
            <hr className="mb-10 border-t-0.5 border-gray-600 " />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div className="mb-50">
                <ul className="mb-50">
                    {comments.map((comment) => (
                        <li className="flex flex-col gap-0 mt-5" key={comment._id}>
                            <div className='flex items-start mx-5'>
                                <img src={comment.user.photo} alt="" className="w-6 h-6 rounded-full mr-2 shadow-md" />
                                <p className="text-lg"> {comment.user.name}</p>
                            </div>
                            <br />
                            <div className="flex items-start max-w-4/5 relative mx-5 mb-10 whitespace-pre-line">
                                <p className="text-md">  {comment.content}</p>
                                {comment.user._id === userId && (
                                    <>
                                        <button className="absolute right-10 " onClick={() => handleEditClick(comment._id, comment.content)}>
                                            {isDarkMode ? <img className="w-5" src='/imgs/pencil.png' alt="edit" /> : <img className="w-5" src='/imgs/pencil.png' alt="edit" />}
                                        </button>
                                        <button className="absolute right-3 " onClick={() => handleDeleteComment(comment._id)}>
                                            {isDarkMode ? <img className="w-5" src='/imgs/delete.png' alt="delete" /> : <img className="w-5" src='/imgs/delete.png' alt="delete" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
            <form className="absolute bottom-10 md:bottom-0 w-full" onSubmit={handleCommentSubmit}>
                <div className="flex relative items-center mb-5 ">
                    <input
                        type="text"
                        value={newComment}
                        placeholder={'Type new comment'}
                        onChange={(e) => setNewComment(e.target.value)}
                        className={` input bg-gray-100 border-gray-600 rounded-2xl w-full pt-2 px-20 mr-3 ml-3`}
                    />
                    <img className="absolute left-5 w-8 rounded-full" src={userData.photo} alt="user" />
                    <button className="absolute right-3 flex items-center px-2 py-2" type="submit">
                        {editingCommentId !== null ? <img className="w-8 hover:bg-teal" src="/imgs/check.png" alt="submit" /> : <img className="w-8 hover:bg-teal" src="/imgs/post.png" alt="submit" />}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CommentsPage;

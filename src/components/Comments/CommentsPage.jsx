import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { useTheme } from "../../context/ThemeContext";

function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/${postId}`);
                setComments(response.data.comments);
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
            setComments(updatedCommentsResponse.data.comments);
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
        <div className={`bg-gray-100 ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="flex items-center justify-center gap-5">
                {isDarkMode ? <img className="w-9 h-9" src='/imgs/chatwhite.png' alt="edit" /> : <img className="w-9 h-9" src="/imgs/commentIcon.png" alt="commentIcon" />}

                <h2 className={`${isDarkMode ? 'dark' : 'light'} text-2xl text-gray-200 py-5`}>{comments.length} Comments</h2>
            </div>
            <hr className="mb-10 border-t-0.5 border-gray-600 " />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <ul>
                {comments.reverse().map((comment) => (
                    <li className=" flex column gap-0 mt-5" key={comment._id}>
                        <div className='flex items-start mx-5 '>
                            <img src={comment.user.photo} alt="" />
                            <p className="text-lg"> {comment.user.name}</p>
                        </div>
                        <br />
                        <div className=" flex items-start max-w-4/5 relative mx-5 mb-10 whitespace-pre-line">
                            <p className="text-md">  {comment.content}</p>
                            {comment.user._id === userId && (
                                <>
                                    <button className="absolute right-10 " onClick={() => handleEditClick(comment._id, comment.content)}> {isDarkMode ? <img className="w-5" src='/imgs/pencil.png' alt="edit" /> : <img className="w-5" src='/imgs/pencil.png' alt="edit" />}</button>
                                    <button className="absolute right-3 " onClick={() => handleDeleteComment(comment._id)}> {isDarkMode ? <img className="w-5" src='/imgs/delete.png' alt="delete" /> : <img className="w-5" src='/imgs/delete.png' alt="delete" />}</button>
                                </>
                            )}
                        </div>

                    </li>
                ))}
            </ul>
            <form onSubmit={handleCommentSubmit}>
                <div className="flex items-center mb-5">
                    <input
                        type="text"
                        value={newComment}
                        placeholder={'Type new comment'}
                        onChange={(e) => setNewComment(e.target.value)}
                        className={`relative input bg-gray-100 border-gray-600 rounded-2xl w-full pt-2 pl-2 mr-3 ml-3`}
                    />
                    <button className="absolute right-3 flex items-center px-2 py-2" type="submit">{editingCommentId !== null ? <img className="w-8 hover:bg-teal" src="/imgs/check.png" alt="submit" /> : <img className="w-8 hover:bg-teal" src="/imgs/post.png" alt="submit" />}</button>
                </div>
            </form>
        </div>
    );
}

export default CommentsPage;

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const { postId } = useParams();
    const authToken = localStorage.getItem("authToken");
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };
    const { user } = useContext(AuthContext);
    const userId = user._id

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                console.log(postId)
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/${postId}`);
                console.log(response.data)
                setComments(response.data.comments);
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
           const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/comments/add`, {
                userId: userId,
                content: newComment,
                postId,
            });
            console.log(response.data)
            setNewComment('');
            //fetchComments();
            const updatedCommentsResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/${postId}`);
            setComments(updatedCommentsResponse.data.comments);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleEditClick = (commentId) => {
        setEditingCommentId(commentId);
    };

    const handleEditSubmit = async (commentId, updatedContent) => {
        try {
            await axios.patch(`${process.env.REACT_APP_SERVER_URL}/comments/${commentId}`, {
                content: updatedContent,
            });

            const updatedCommentsResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/${postId}`);
            setComments(updatedCommentsResponse.data.comments);

            setEditingCommentId(null); 
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    return (
        <div>
            <h2>Likes</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleCommentSubmit}>
                <label>Add a Comment:</label>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <ul>
            {comments.map((comment) => (
                    <li key={comment._id}>
                        {editingCommentId === comment._id ? (
                            <>
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button onClick={() => handleEditSubmit(comment._id, newComment)}>Save</button>
                            </>
                        ) : (
                            <>
                                {comment.user.name}: {comment.content}
                                {comment.user._id === userId && (
                                    <>
                                        <button onClick={() => handleEditClick(comment._id)}>Edit</button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentsPage;

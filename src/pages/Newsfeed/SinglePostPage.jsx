import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/auth.context';
import { useParams } from 'react-router-dom';

function SinglePostPage() {
    // const { user } = useContext(AuthContext);
    // const userId = user._id;
    const [post, setPost] = useState(null)
    const { postId } = useParams();

    console.log(postId)

    useEffect(() => {
        const fetchPost = async () => {
            try {

                if (postId) {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/post/${postId}`);
                    setPost(response.data.post);
                    console.log(response.data.post);
                } else {
                    console.error('postId is undefined');
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost(postId);
    }, [postId]);

    console.log(post)
    //console.log(post.user)
    if (!post) { return <p>Loading...</p> }

    return (
        <div>
            <h2>{post.user.name}</h2>

            <p>{post.caption}</p>
            <img src={post.photo} alt="post photo" />

        </div>
    );
};

export default SinglePostPage;

import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
    const [posts, setPosts] = useState([]); // State for storing posts
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error messages

    // Fetch posts when the component mounts
    useEffect(() => {
        fetch(`${import.meta.env.VITE_port}/post`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(posts => {
                setPosts(posts);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            {posts.length > 0 ? (
                posts.map(post => (
                    <Post key={post._id} {...post} /> // Render each post using the Post component
                ))
            ) : (
                <div>No posts available</div>
            )}
        </>
    );
}

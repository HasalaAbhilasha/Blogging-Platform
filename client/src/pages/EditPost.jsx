import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
    const { id } = useParams(); // Get the post ID from the URL parameters
    const [title, setTitle] = useState(''); // State for the post title
    const [summary, setSummary] = useState(''); // State for the post summary
    const [content, setContent] = useState(''); // State for the post content
    const [files, setFiles] = useState(''); // State for the selected file
    const [redirect, setRedirect] = useState(false); // State for redirection

    // Fetch post data when the component mounts
    useEffect(() => {
        fetch(`${import.meta.env.VITE_port}/post/${id}`)
            .then(response => {
                if (response.ok) {
                    response.json().then(postInfo => {
                        setTitle(postInfo.title);
                        setContent(postInfo.content);
                        setSummary(postInfo.summary);
                    });
                } else {
                    console.error("Error fetching post:", response.statusText);
                }
            })
            .catch(error => {
                console.error("Error fetching post:", error);
            });
    }, [id]);

    // Handle form submission to update the post
    async function updatePost(ev) {
        ev.preventDefault(); // Prevent default form submission behavior
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch(`${import.meta.env.VITE_port}/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        } else {
            console.error("Error updating post:", response.statusText);
        }
    }

    // Handle post deletion
    async function deletePost() {
        const response = await fetch(`${import.meta.env.VITE_port}/post/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        } else {
            console.error("Error deleting post:", response.statusText);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} replace />;
    }

    return (
        <div>
            <form onSubmit={updatePost}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}
                />
                <input
                    type="text"
                    placeholder="Summary"
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)}
                />
                <input
                    type="file"
                    onChange={ev => setFiles(ev.target.files)}
                />
                <Editor
                    value={content}
                    onChange={setContent}
                />
                <div className="submit-wrapper">
                    <button className="submit update-btn" type="submit">Update Post</button>
                    <button
                        className="submit delete-btn"
                        type="button"
                        onClick={deletePost}
                    >
                        Delete Post
                    </button>
                </div>
            </form>
        </div>
    );
}

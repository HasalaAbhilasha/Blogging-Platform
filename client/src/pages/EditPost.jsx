import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`blogging-platform-production.up.railway.app/post/${id}`)
            .then(response => {
                if (response.ok) {
                    response.json().then(postInfo => {
                        setTitle(postInfo.title);
                        setContent(postInfo.content);
                        setSummary(postInfo.summary);
                    });
                } else {
                    // Handle error if post is not found
                    console.error("Error fetching post:", response.statusText);
                }
            })
            .catch(error => {
                console.error("Error fetching post:", error);
            });
    }, [id]);

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch('blogging-platform-production.up.railway.app/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }

    async function deletePost() {
        const response = await fetch(`blogging-platform-production.up.railway.app/post/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        } else {
            // Handle error if deletion fails
            console.error("Error deleting post:", response.statusText);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} replace />;
    }

    return (
        <div>
            <form onSubmit={updatePost}>
                <input type="text"
                    placeholder="Title"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)} />
                <input type="text"
                    placeholder="Summary"
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)} />
                <input type="file"
                    onChange={ev => setFiles(ev.target.files)} />
                <Editor value={content} onChange={setContent} />
                <button className="submit" type="submit">Update Post</button>
            </form>
            <button className="submit" onClick={deletePost}>Delete Post</button>
        </div>
    );
}

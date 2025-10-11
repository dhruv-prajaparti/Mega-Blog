import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config"; // Your service for getting posts
import authService from "../appwrite/auth";     // Your service for the Clerk-Appwrite handshake

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchPostsAfterAuth = async () => {
            try {
                // 1. Get the JWT from Clerk using the template you created in the dashboard.
                const token = await getToken({ template: 'appwrite' });

                if (token) {
                    // 2. Use the token to create a session with Appwrite. This is the crucial handshake.
                    const session = await authService.loginWithClerkJwt(token);

                    if (session) {
                        // 3. Only after the handshake is successful, fetch the posts.
                        const postsResponse = await appwriteService.getPosts();
                        if (postsResponse) {
                            setPosts(postsResponse.documents);
                        }
                    } else {
                       throw new Error("Could not create Appwrite session.");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                // You can set an error state here to show a message to the user.
            } finally {
                setLoading(false);
            }
        };

        fetchPostsAfterAuth();
    }, [getToken]);

    // Show a loading message while the handshake and data fetching are in progress.
    if (loading) {
        return (
            <div className='w-full py-8 text-center'>
                <p>Loading posts...</p>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center w-full">No posts found. Create your first post!</p>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
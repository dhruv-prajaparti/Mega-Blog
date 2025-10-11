import React, { useEffect, useState } from 'react';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react'; // Import Clerk's hooks and components
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';

// This component is now ONLY responsible for showing the list of posts.
// It will only be rendered if the user is signed in.
function PostList() {
    const [posts, setPosts] = useState(null); // Use null to signify "loading"

    useEffect(() => {
        appwriteService.getPosts().then((response) => {
            if (response) {
                setPosts(response.documents);
            }
        });
    }, []);

    // Show a loading state while posts are being fetched
    if (posts === null) {
        return (
             <div className="w-full py-8 mt-4 text-center">
                <p className="text-2xl font-bold">Loading posts...</p>
            </div>
        );
    }

    // Show a message if the user is logged in but has no posts
    if (posts.length === 0) {
        return (
             <div className="w-full py-8 mt-4 text-center">
                <p className="text-2xl font-bold">No posts found. Why not create one?</p>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}


// The main Home component now manages the signed-in/signed-out views.
function Home() {
    const { isLoaded } = useUser();

    // 1. The Loading Gatekeeper: This is the most important part.
    // It prevents anything from rendering until Clerk knows the user's status.
    if (!isLoaded) {
        return <div className="w-full py-8 mt-4 text-center text-2xl font-bold">Loading...</div>;
    }

    return (
        <>
            {/* 2. Signed-In View: This will ONLY render for logged-in users. */}
            <SignedIn>
                <PostList />
            </SignedIn>

            {/* 3. Signed-Out View: This will ONLY render for logged-out users. */}
            <SignedOut>
                <div className="w-full py-8 mt-4 text-center">
                    <Container>
                        <div className="flex flex-wrap">
                            <div className="p-2 w-full">
                                    <a href="/sign-in" className="text-2xl font-bold hover:text-gray-500 inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full">
                                    Login to read blogs
                                </a>


                                         <img src="https://images.squarespace-cdn.com/content/v1/5e3b2e80597c7c5ee1401b54/1671092163300-MUQWJ3RLXPEQQRIOETUP/on-the-blog.png" alt="Blog Banner" style={{
                                    width: '100%',
                                    margin: '2rem auto 0',
                                    textAlign: 'center'
                                }}
                                />

                              
                             
                            </div>
                        </div>
                    </Container>
                </div>
            </SignedOut>
        </>
    );
}

export default Home;
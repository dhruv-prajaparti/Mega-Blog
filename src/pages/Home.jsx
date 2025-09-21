import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'

function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
<a href="/login" className="text-2xl font-bold hover:text-gray-500 inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full">
    Login to read blogs</a>
    <img src="https://images.squarespace-cdn.com/content/v1/5e3b2e80597c7c5ee1401b54/1671092163300-MUQWJ3RLXPEQQRIOETUP/on-the-blog.png" alt="Logo" style={{
  width: '100%',
  margin: '0 auto',
  textAlign: 'center'
}}
 />
                        </div>
                    </div>
                </Container>
            </div>
        )
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
    )
}

export default Home
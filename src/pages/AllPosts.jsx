import React, { useState, useEffect } from 'react';
import appwriteService from '../appwrite/config';
import auth from '../appwrite/auth'
import { Container, PostCard } from '../components';

function AllPosts() {
    const [activePosts, setActivePosts] = useState([]);
    const [inactivePosts, setInactivePosts] = useState([]);
    const [usersPosts, setUsersPosts] = useState([]);
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await auth.getCurrentUser();

                const response = await appwriteService.getPosts();
                const fetchedPosts = response.documents;

                if (fetchedPosts) {
                    const usersPost = fetchedPosts.filter(post => post.userId === user.$id);
                    const active = usersPost.filter(post => post.status === 'active');
                    const inactive = usersPost.filter(post => post.status === 'inactive');

                    setUsersPosts(usersPost);
                    setActivePosts(active);
                    setInactivePosts(inactive);

                    setPosts(usersPost);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full py-8 text-sm lg:text-xl md:text-xl sm:text-lg">
            <Container>
                <div className="flex justify-center mb-4 text-md lg:text-xl md:text-xl sm:text-xl">
                <button
                        className="mr-4 px-4 py-2 backdrop-blur-3xl rounded-2xl hover:bg-blue-500 hover:text-white focus:bg-blue-700 focus:text-white"
                        onClick={() => setPosts(usersPosts)}
                    >
                        All Posts
                    </button>
                    <button
                        className="mr-4 px-4 py-2 backdrop-blur-3xl rounded-2xl hover:bg-blue-500 hover:text-white focus:bg-blue-700 focus:text-white"
                        onClick={() => setPosts(activePosts)}
                    >
                        Active Posts
                    </button>
                    <button
                        className="px-4 py-2 backdrop-blur-3xl rounded-2xl hover:bg-blue-500 hover:text-white focus:bg-blue-700 focus:text-white"
                        onClick={() => setPosts(inactivePosts)}
                    >
                        Inactive Posts
                    </button>
                </div>
                <div className="flex flex-wrap">
                    
                    {posts && (
                        posts.map((post) => (
                            <div key={post.$id} className="p-2 w-full">
                                <PostCard post={post} />
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
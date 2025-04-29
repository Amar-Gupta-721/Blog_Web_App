import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import auth from "../appwrite/auth";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [activePosts, setActivePosts] = useState([]);
  const [inactivePosts, setInactivePosts] = useState([]);
  const [usersPosts, setUsersPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await auth.getCurrentUser();
        const response = await appwriteService.getPosts();
        const fetchedPosts = response.documents;

        if (fetchedPosts) {
          const usersPost = fetchedPosts.filter(
            (post) => post.userId === user.$id
          );
          const active = usersPost.filter((post) => post.status === "active");
          const inactive = usersPost.filter(
            (post) => post.status === "inactive"
          );

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
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-transparent">
      <Container>
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white-700 mb-4">
            Your Blog Posts
          </h1>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              className="px-6 py-2 rounded-full text-white bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all duration-200 shadow-md"
              onClick={() => setPosts(usersPosts)}
            >
              All Posts
            </button>

            <button
              className="px-6 py-2 rounded-full text-white bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all duration-200 shadow-md"
              onClick={() => setPosts(activePosts)}
            >
              Active Posts
            </button>

            <button
              className="px-6 py-2 rounded-full text-white bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all duration-200 shadow-md"
              onClick={() => setPosts(inactivePosts)}
            >
              Inactive Posts
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-start">
          {posts && posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.$id} post={post} />)
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No posts found.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;

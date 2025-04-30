import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      appwriteService
        .getPosts()
        .then((posts) => {
          if (posts) {
            const activePosts = posts.documents.filter(
              (post) => post.status === "active"
            );
            setPosts(activePosts);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </Container>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full py-20 mt-4 flex items-center justify-center bg-transparent text-white">
        <Container>
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center">
              You need to <span className="text-blue-400">Login</span> to read amazing posts!
            </h1>
            <Link
              to="/login"
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300"
            >
              🚀 Login Now
            </Link>
          </div>
        </Container>
      </div>
    );
  }
  

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold">
                No posts have been created yet...
              </h1>
              <br />
              <Link to="/add-post">
                <span className="text-4xl font-bold underline text-neutral-600 hover:text-neutral-950">
                  Add some posts..
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap gap-6 justify-start">
          {posts.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;

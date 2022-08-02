import { useState, useEffect } from "react";

import styles from "./home.module.css";
import PostCard from "../../components/postCard";
import LoadingSpinner from "../../components/loadingSpinner";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Blog Posts</h1>
        <span className={styles.line} />
      </header>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
};

export default HomePage;

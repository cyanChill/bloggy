import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../../context/authContext";

import styles from "./index.module.css";
import PostCard from "../../components/postCard";
import LoadingSpinner from "../../components/loadingSpinner";

const HomePage = () => {
  const { token } = useContext(AuthContext);
  const [pubPosts, setPubPosts] = useState([]);
  const [unPubPosts, setUnPubPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setPubPosts(data.posts);
        setUnPubPosts(data.unpublishedPosts);
      }
      setIsLoading(false);
    };

    if (token) fetchPosts();
  }, [token]);

  return (
    <div className={styles.container}>
      <CMSPostsSection
        sectionName="Unpublished"
        posts={unPubPosts}
        loading={isLoading}
      />

      <CMSPostsSection
        sectionName="Published"
        posts={pubPosts}
        loading={isLoading}
      />
    </div>
  );
};

export default HomePage;

const CMSPostsSection = ({ posts, sectionName, loading }) => {
  return (
    <section className={styles.subContainer}>
      <header className={styles.header}>
        <h1>{sectionName} Posts</h1>
        <span className={styles.line} />
      </header>

      <div className={styles.postsContainer}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </section>
  );
};

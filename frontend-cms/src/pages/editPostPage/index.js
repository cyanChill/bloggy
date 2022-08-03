import toast from "react-hot-toast";
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import { AuthContext } from "../../context/authContext";

import styles from "./index.module.css";
import PostForm from "../../components/postForm";
import LoadingSpinner from "../../components/loadingSpinner";

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [mutableData, setMutableData] = useState({});

  const updateHandler = async (title, content, thumbnailUrl, published) => {
    if (!title.trim()) toast.error("Title must not be empty.");
    if (!content.trim()) toast.error("Content must not be empty.");
    if (!thumbnailUrl.trim()) toast.error("Thumbnail Url must not be empty.");
    if (!title.trim() || !content.trim() || !content.trim()) return;

    const updateRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({ title, content, thumbnailUrl, published }),
      }
    );
    const updateData = await updateRes.json();
    if (updateRes.ok) {
      toast.success("Succesfully updated post.");
      navigate("/", { replace: true });
    } else {
      if (updateData.errors) {
        updateData.errors.forEach((err) => toast.error(err.msg));
      }
    }
  };

  useEffect(() => {
    const getPostInfo = async () => {
      setLoading(true);
      const postRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`,
        { headers: { Authorization: `bearer ${token}` } }
      );
      const postData = await postRes.json();

      if (postRes.ok) {
        setMutableData({
          title: postData.post.title,
          content: postData.post.content,
          thumbnailUrl: postData.post.thumbnailUrl,
          published: postData.post.published,
        });
      } else {
        toast.error(postData.message);
        navigate("/", { replace: true });
      }

      setLoading(false);
    };

    getPostInfo();
  }, [token, postId]);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Edit Post</h1>
      <button
        className="btn compressed"
        style={{ width: "max-content" }}
        onClick={() => navigate(-1)} // Go back
      >
        Back
      </button>

      <PostForm submitHandler={updateHandler} prevContents={mutableData} />
    </div>
  );
};

export default EditPostPage;

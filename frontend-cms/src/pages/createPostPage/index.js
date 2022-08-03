import toast from "react-hot-toast";
import { useContext } from "react";
import { useNavigate } from "react-router";

import { AuthContext } from "../../context/authContext";

import styles from "./index.module.css";
import PostForm from "../../components/postForm";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const createHandler = async (title, content, thumbnailUrl, published) => {
    if (!title.trim()) toast.error("Title must not be empty.");
    if (!content.trim()) toast.error("Content must not be empty.");
    if (!thumbnailUrl.trim()) toast.error("Thumbnail Url must not be empty.");
    if (!title.trim() || !content.trim() || !content.trim()) return;

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ title, content, thumbnailUrl, published }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Succesfully updated post.");
      navigate("/", { replace: true });
    } else {
      if (data.errors) data.errors.forEach((err) => toast.error(err.msg));
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Post</h1>
      <button
        className="btn compressed"
        style={{ width: "max-content" }}
        onClick={() => navigate(-1)} // Go back
      >
        Back
      </button>

      <PostForm submitHandler={createHandler} />
    </div>
  );
};

export default CreatePostPage;

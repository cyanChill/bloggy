import toast from "react-hot-toast";
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { format } from "date-fns";
import parse from "html-react-parser";

import { AuthContext } from "../../context/authContext";

import styles from "./index.module.css";
import Card from "../../components/card";
import Comment from "../../components/comment";
import LoadingSpinner from "../../components/loadingSpinner";
import ErrorPage from "../errorPage";

const PostPage = () => {
  const { postId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [postData, setPostData] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePostDeletion = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`,
      {
        method: "DELETE",
        headers: { Authorization: `bearer ${token}` },
      }
    );
    if (res.ok) {
      toast.success("Successfully deleted post.");
      navigate("/", { replace: true });
    } else {
      toast.error("Something went wrong with deleting the post.");
    }
  };

  const handleCommentDelete = async (id) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `bearer ${token}` },
      }
    );
    if (res.ok) {
      toast.success("Successfully deleted comment.");
      setPostComments((prev) => prev.filter((comment) => comment._id !== id));
    } else {
      toast.error("Something went wrong with deleting the commment.");
    }
  };

  useEffect(() => {
    const getPostInfo = async () => {
      setIsLoading(true);

      const [postRes, commentsRes] = await Promise.allSettled([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`, {
          headers: { Authorization: `bearer ${token}` },
        }),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments`,
          { headers: { Authorization: `bearer ${token}` } }
        ),
      ]);

      if (!postRes.value.ok || !commentsRes.value.ok) {
        setError(true);
      } else {
        const postJSONData = await postRes.value.json();
        const commentsJSONData = await commentsRes.value.json();
        setPostData(postJSONData.post);
        setPostComments(commentsJSONData.comments);
      }

      setIsLoading(false);
    };

    getPostInfo();
  }, [postId, token]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className={styles.container}>
      <Card>
        <img
          src={postData.thumbnailUrl}
          alt="Post thumbnail"
          className={styles.postThumbnail}
        />
        <header className={styles.postHeader}>
          <h1>{postData.title}</h1>
          {postData.date && (
            <p className={styles.postInfo}>
              Posted {format(new Date(postData.date), "MMM d yyyy")}{" "}
              {postData.lastEdited && (
                <span>
                  {postData.lastEdited &&
                    `(last edited ${format(
                      new Date(postData.lastEdited),
                      "MMM d yyyy pp"
                    )})`}
                </span>
              )}
            </p>
          )}
        </header>

        <main className={`default_styling ${styles.postContent}`}>
          {parse(`${postData.content}`)}
        </main>

        <div className={styles.actionsInfo}>
          <div className={styles.postActions}>
            <button
              className="btn compressed"
              onClick={() => navigate("./edit")}
            >
              Update
            </button>
            <button className="btn compressed red" onClick={handlePostDeletion}>
              Delete
            </button>
          </div>
          <p className={styles.error}>
            * Clicking delete will permanently delete this post and all comments
            for this post.
          </p>
        </div>

        <hr className={styles.line} />

        <div className={styles.commentsSec}>
          <h2>Discussion ({postComments.length})</h2>
          <p className={styles.error}>
            * Clicking delete will permanently delete the comment.
          </p>
          <div className={styles.commentCont}>
            {postComments.length === 0 ? (
              <p className={styles.noneFound}>No Comments Found.</p>
            ) : (
              postComments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={handleCommentDelete}
                />
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostPage;

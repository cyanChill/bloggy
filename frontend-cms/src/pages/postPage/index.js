import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
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

  const [postData, setPostData] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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

        <main className={styles.postContent}>
          {parse(`${postData.content}`)}
        </main>

        <hr className={styles.line} />

        <div className={styles.commentsSec}>
          <h2>Discussion ({postComments.length})</h2>
          <div className={styles.commentCont}>
            {postComments.length === 0 ? (
              <p className={styles.noneFound}>No Comments Found.</p>
            ) : (
              postComments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostPage;

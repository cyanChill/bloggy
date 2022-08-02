import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";
import parse from "html-react-parser";

import styles from "./index.module.css";
import Card from "../../components/card";
import Comment from "../../components/comment";
import LoadingSpinner from "../../components/loadingSpinner";
import StyledInput from "../../components/formElements/styledInput";
import ErrorPage from "../errorPage";

const PostPage = () => {
  const { postId } = useParams();

  const [postData, setPostData] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  /* Comment Form Input */
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({
    usernameError: "",
    commentError: "",
  });
  const [isSubForm, setIsSubForm] = useState(false);

  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubForm(true);
    // Reset Errors
    setErrors({ usernameError: "", commentError: "" });

    if (username.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        usernameError: "Your username must be nonempty.",
      }));
    }
    if (comment.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        commentError: "Your comment must be nonempty.",
      }));
    }

    // Contain some error
    if (!Object.values(errors).every((val) => val === null || val === "")) {
      return;
    }

    // Send request to backend
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: comment }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      // Received some errors
      const newErrs = data.errors.map((err) => ({ [err.param]: err.msg }));
      setError(newErrs);
    } else {
      // Successfully added comment
      setPostComments((prev) => [...prev, { username, content: data.comment }]);
      setComment("");
      setUsername("");
    }

    setIsSubForm(false);
  };

  useEffect(() => {
    const getPostInfo = async () => {
      setIsLoading(true);

      const [postRes, commentsRes] = await Promise.allSettled([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments`
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
  }, [postId]);

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

          <form onSubmit={commentSubmitHandler} className={styles.addCommForm}>
            <StyledInput
              labelText="Username"
              type="text"
              config={{
                value: username,
                onChange: (e) => setUsername(e.target.value),
                required: true,
              }}
              error={errors.usernameError}
            />
            <StyledInput
              labelText="Comment"
              type="textarea"
              config={{
                rows: "4",
                value: comment,
                onChange: (e) => setComment(e.target.value),
                required: true,
              }}
              error={errors.commentError}
            />
            <button
              type="submit"
              disabled={isSubForm}
              className="btn compressed"
            >
              Submit
            </button>
          </form>

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

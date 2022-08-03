import { useContext } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";

import { AuthContext } from "../../context/authContext";

import styles from "./index.module.css";

const Comment = ({ comment, onDelete }) => {
  const { postId } = useParams();
  const { token } = useContext(AuthContext);

  return (
    <div className={styles.comment}>
      <div className={styles.commentMain}>
        <p className={styles.commentHeader}>
          {comment.username}{" "}
          <span>({format(new Date(comment.date), "MMM d yyyy p")})</span>
        </p>
        <p className={styles.commentContent}>{comment.content}</p>
      </div>

      <svg
        viewBox="0 0 24 24"
        className={styles.delete}
        onClick={() => onDelete(comment._id)}
      >
        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
      </svg>
    </div>
  );
};

export default Comment;

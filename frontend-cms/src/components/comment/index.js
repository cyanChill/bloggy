import { format } from "date-fns";

import styles from "./index.module.css";

const Comment = ({ comment }) => {
  return (
    <div className={styles.comment}>
      <p className={styles.commentHeader}>
        {comment.username}{" "}
        <span>({format(new Date(comment.date), "MMM d yyyy p")})</span>
      </p>
      <p className={styles.commentContent}>{comment.content}</p>
    </div>
  );
};

export default Comment;

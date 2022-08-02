import { Link } from "react-router-dom";
import { format } from "date-fns";

import styles from "./index.module.css";

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post._id}`} className={styles.postCard}>
      <img src={post.thumbnailUrl} alt="Blog Post Thumbnail" />
      <div className={styles.content}>
        <h2 className="ellipse">{post.title}</h2>
        <p>
          Posted {format(new Date(post.date), "MMM d yyyy")}{" "}
          {post.lastEdited && (
            <span>
              {post.lastEdited &&
                `(last edited ${format(
                  new Date(post.lastEdited),
                  "MMM d yyyy pp"
                )})`}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default PostCard;

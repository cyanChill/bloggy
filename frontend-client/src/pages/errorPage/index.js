import { Link } from "react-router-dom";

import styles from "./index.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <h1>Error 404</h1>
      <div className={styles.content}>
        <h2>The resource you were looking for was not found.</h2>
        <p>
          Return to the <Link to="/">home page</Link>.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;

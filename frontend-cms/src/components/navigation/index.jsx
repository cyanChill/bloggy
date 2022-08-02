import { Link } from "react-router-dom";

import styles from "./index.module.css";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.navContent}>
        <img src="/favicon.ico" alt="Site logo" />
        <span>cyanBlog</span>
      </Link>
    </nav>
  );
};

export default Nav;

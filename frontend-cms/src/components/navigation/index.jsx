import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/authContext";

import styles from "./index.module.css";

const Nav = () => {
  const { isAuth, logout } = useContext(AuthContext);

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.navHome}>
          <img src="/favicon.ico" alt="Site logo" />
          <span>cyanBlog</span>
        </Link>

        {isAuth && (
          <button className={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;

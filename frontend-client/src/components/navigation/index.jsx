import styles from "./index.module.css";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <img src="/favicon.ico" alt="Site logo" />
        <span>cyanBlog</span>
      </div>
    </nav>
  );
};

export default Nav;

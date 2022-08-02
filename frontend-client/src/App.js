import { Routes, Route } from "react-router-dom";

import styles from "./App.module.css";
import Nav from "./components/navigation";
import HomePage from "./pages/homePage/home";
import PostPage from "./pages/postPage/post";

const App = () => {
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

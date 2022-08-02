import { Routes, Route } from "react-router-dom";

import styles from "./App.module.css";
import Nav from "./components/navigation";
import HomePage from "./pages/homePage";
import PostPage from "./pages/postPage";
import ErrorPage from "./pages/errorPage";

const App = () => {
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

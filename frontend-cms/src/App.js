import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthContext } from "./context/authContext";

import styles from "./App.module.css";
import LoadingSpinner from "./components/loadingSpinner";
import Nav from "./components/navigation";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import PostPage from "./pages/postPage";
import EditPostPage from "./pages/editPostPage";
import ErrorPage from "./pages/errorPage";

const App = () => {
  const { isAuth, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Nav />
      <Toaster
        position="bottom-center"
        containerClassName="toasterCont"
        toastOptions={{ style: { width: "max-content", maxWidth: "45rem" } }}
      />
      <div className={styles.container}>
        <Routes>
          {!isAuth ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="*"
                element={<Navigate to="/login" replace={true} />}
              />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={<Navigate to="/" replace={true} />}
              />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="/post/:postId/edit" element={<EditPostPage />} />
              <Route path="*" element={<ErrorPage />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
};

export default App;

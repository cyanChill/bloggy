import { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthContext } from "./context/authContext";

import styles from "./App.module.css";
import Nav from "./components/navigation";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import PostPage from "./pages/postPage";
import ErrorPage from "./pages/errorPage";

const App = () => {
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    console.log(`isAuth value: ${isAuth}`);
  }, [isAuth]);

  return (
    <>
      <Nav />
      <Toaster position="bottom-center" />
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
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="*" element={<ErrorPage />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
};

export default App;

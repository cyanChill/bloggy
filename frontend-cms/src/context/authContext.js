import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  const login = async (username, password) => {
    if (!username.trim()) throw new Error("Username must not be empty.");
    if (!password.trim()) throw new Error("Password must not be empty.");

    const authRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const authData = await authRes.json();

    if (!authRes.ok) throw new Error("Invalid username and/or password.");

    // Valid Credentials
    localStorage.setItem(
      `${window.location.hostname}-auth-token`,
      authData.token
    );
    setIsAuth(true);
  };

  const logout = async () => {
    const authRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/logout`
    );
    const authData = await authRes.json();
    console.log(authData.message);

    localStorage.removeItem(`${window.location.hostname}-auth-token`);
    setIsAuth(false);
  };

  useEffect(() => {
    const checkIfPrevAuth = async () => {
      const prevAuthToken = localStorage.getItem(
        `${window.location.hostname}-auth-token`
      );
      if (!prevAuthToken) return;

      // Check if token is valid
      const authRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/validateToken`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${prevAuthToken}`,
          },
        }
      );
      // If we get an ok response, then auth token is valid
      if (authRes.ok) setIsAuth(true);
    };

    checkIfPrevAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

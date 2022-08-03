import toast from "react-hot-toast";
import { createContext, useState, useEffect, useRef } from "react";
import { intervalToDuration } from "date-fns";

import { tokenExpireTime } from "../helpers/jwt";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setIsLoading] = useState(true);
  // Toast & Countdown Related
  const rfrshIntIdRef = useRef();
  const sessCdIdRef = useRef();
  const autoLogoutCdIdRef = useRef();

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
    setToken(authData.token);
    setIsAuth(true);
  };

  const logout = async () => {
    const authRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/logout`
    );
    const authData = await authRes.json();
    console.log(authData.message);

    localStorage.removeItem(`${window.location.hostname}-auth-token`);
    setToken(null);
    setIsAuth(false);
    // Remove existing countdowns
    clearTimers();
  };

  // Used to validate a previous auth token
  const checkIfPrevAuth = async () => {
    setIsLoading(true);
    const prevAuthToken = localStorage.getItem(
      `${window.location.hostname}-auth-token`
    );
    //Return if no token in both local storage & context (initial app load)
    if (!prevAuthToken && !token) return;

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
    if (authRes.ok) {
      setToken(prevAuthToken);
      setIsAuth(true);
    } else {
      localStorage.removeItem(`${window.location.hostname}-auth-token`);
      setToken(null);
      setIsAuth(false);
      toast.error("Your session has expired.", { id: "expired" });
    }
    setIsLoading(false);
  };

  // Used to set countdown toast
  const liveUpdateCdToast = () => {
    const expTime = tokenExpireTime(token);
    const dur = intervalToDuration({ start: 0, end: expTime });
    toast(
      `Your session will expire in ${
        dur.minutes === 0 ? "" : `${dur.minutes} mins`
      } ${
        dur.seconds === 0 ? "" : `${dur.seconds} secs`
      }. Please re-login to refresh the timer.`,
      { icon: "⚠️", duration: expTime, id: "countdown" }
    );
  };

  const clearTimers = () => {
    clearTimeout(sessCdIdRef.current);
    clearTimeout(autoLogoutCdIdRef.current);
    clearInterval(rfrshIntIdRef.current);
    sessCdIdRef.current = null;
    autoLogoutCdIdRef.current = null;
    rfrshIntIdRef.current = null;
    toast.dismiss("countdown");
  };

  /* eslint-disable */
  useEffect(() => {
    checkIfPrevAuth();
  }, []);

  useEffect(() => {
    // Trigger check on auth token if storage changed
    window.addEventListener("storage", checkIfPrevAuth);

    if (token) {
      const expTime = tokenExpireTime(token);
      // Set autologout function
      autoLogoutCdIdRef.current = setTimeout(() => {
        logout();
        toast.error("Your session has expired.", { id: "expired" });
      }, expTime);

      // Set warning message before the user will be automatically logged out
      if (expTime > 600000) {
        sessCdIdRef.current = setTimeout(() => {
          liveUpdateCdToast();
          rfrshIntIdRef.current = setInterval(liveUpdateCdToast, 1000);
        }, expTime - 600000);
      } else {
        liveUpdateCdToast();
        rfrshIntIdRef.current = setInterval(liveUpdateCdToast, 1000);
      }
    }

    return () => {
      window.removeEventListener("storage", checkIfPrevAuth);
      clearTimers();
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuth, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

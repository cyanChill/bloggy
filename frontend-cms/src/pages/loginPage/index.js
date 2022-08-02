import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/authContext";

import styles from "./index.module.css";
import Card from "../../components/card";
import FancyInput from "../../components/formElements/fancyInput";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLoginRequest = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username.trim()) toast.error("Username must not be empty.");
    if (!password.trim()) toast.error("Password must not be empty.");
    // Contain some error
    if (!username.trim() || !password.trim()) return;

    try {
      await login(username, password);
      // Redirect to home page (which we now have access to)
      navigate("/", { replace: true });
    } catch (err) {
      // Send toast saying invalid username or password
      toast.error("Invalid username or password.");
    }
  };

  return (
    <>
      <Card className={styles.card}>
        <h1>Login</h1>
        <form onSubmit={handleLoginRequest} className={styles.loginForm}>
          <FancyInput
            config={{ name: "username", required: true }}
            labelText="Username"
          />
          <FancyInput
            config={{ name: "password", type: "password", required: true }}
            labelText="Password"
          />
          <button type="submit" className="btn compressed">
            Submit
          </button>
        </form>
      </Card>
    </>
  );
};

export default LoginPage;

import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const navigate = useNavigate();

  // 🔥 AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "POLICE") navigate("/police");
    }
  }, [navigate]);

  // 🔥 ENTER KEY LOGIN
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        username,
        password
      });

      // 💾 STORE USER
      if (remember) {
        localStorage.setItem("user", JSON.stringify(res.data));
      } else {
        sessionStorage.setItem("user", JSON.stringify(res.data));
      }

      // 🔥 REDIRECT BASED ON ROLE
      if (res.data.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (res.data.role === "POLICE") {
        navigate("/police", { replace: true });
      } else {
        setError("Invalid role");
      }

    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2>Crime System</h2>
        <p style={{ color: "#9ca3af" }}>Sign in to continue</p>

        {error && <p style={styles.error}>{error}</p>}

        {/* USERNAME */}
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        {/* PASSWORD */}
        <div style={{ position: "relative" }}>
          <input
            style={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <span
            style={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* REMEMBER ME */}
        <div style={styles.row}>
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />{" "}
            Remember me
          </label>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* REGISTER LINK */}
        <p style={styles.switch}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#60a5fa" }}>
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #020617)"
  },
  card: {
    background: "#111827",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#020617",
    color: "white"
  },
  button: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "white",
    cursor: "pointer"
  },
  error: {
    color: "#ef4444",
    fontSize: "14px",
    marginTop: "10px"
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
  },
  row: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#9ca3af",
    textAlign: "left"
  },
  switch: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#9ca3af"
  }
};

export default Login;
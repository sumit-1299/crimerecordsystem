import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("POLICE");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register", {
        username,
        password,
        role
      });

      alert("Registered successfully ✅");
      navigate("/");

    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          style={styles.input}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="POLICE">Police</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={styles.switch}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#60a5fa" }}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

/* SAME STYLE AS LOGIN */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1220"
  },
  card: {
    background: "#111827",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
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
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: "14px"
  },
  switch: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#9ca3af"
  }
};

export default Register;
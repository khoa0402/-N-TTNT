import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserauthContext from "../../context/UserauthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useContext(UserauthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu!");
      return;
    }

    login(e);

  };

  return (
    <Container
      style={{
        background: "url(/src/assets/background.jpg) center center / cover",
        maxWidth: "100%",
        height: "90dvh",
        margin: "0px",
      }}
    >
      <Row>
        <div
          className="col-4 mx-auto"
          style={{
            marginTop: "40px",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "30px",
            borderRadius: "10px",
            backdropFilter: "blur(2px)",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <p
              className="text-center"
              style={{
                fontWeight: "bold",
                fontSize: "30px",
                marginBottom: "5px",
                color: "white",
              }}
            >
              Login
            </p>

            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label style={{ color: "white" }}>
                <i className="fa-solid fa-user"></i> Username
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter your username"
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ color: "white" }}>
                <i className="fa-solid fa-key"></i> Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                style={{ color: "white" }}
                type="checkbox"
                name="remember"
                label="Remember me"
                disabled={loading}
              />
            </Form.Group>

            <Button
              style={{ width: "100%" }}
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Submit"}
            </Button>

            <p style={{ marginTop: "12px", color: "white" }}>
              Don't have an account?{" "}
              <a href="/signup" style={{ color: "white" }}>
                Sign up here!
              </a>
            </p>
          </Form>
        </div>
      </Row>
    </Container>
  );
};

export default Login;

import { createContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../functions/toastify/notify";

// Tạo context
const UserauthContext = createContext();

export default UserauthContext;

export const UserauthProvider = () => {
  const navigate = useNavigate();

  // State lưu token
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
  const [loading, setLoading] = useState(false);

  // Hàm đăng nhập
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      // Giả lập đăng nhập thành công
      if (email === "admin@example.com" && password === "123456") {
        const fakeAccessToken = "fake-access-token-123";
        
        // Lưu vào localStorage và state
        localStorage.setItem("accessToken", fakeAccessToken);
        setAccessToken(fakeAccessToken);

        notify("success", "Đăng nhập thành công!");
        navigate("/home");
      } else {
        throw new Error("Email hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      notify("error", err.message);
    }

    setLoading(false);
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/");
    notify("warning", "Đã đăng xuất!");
  };

  // Kiểm tra token khi load lại trang
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  return (
    <UserauthContext.Provider value={{ accessToken, login, logout, loading }}>
      <Outlet />
    </UserauthContext.Provider>
  );
};

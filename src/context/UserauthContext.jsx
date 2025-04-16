import { createContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../functions/toastify/notify";
import { ContinuousColorLegend } from "@mui/x-charts";

// Tạo context
const UserauthContext = createContext();

export default UserauthContext;

export const UserauthProvider = () => {
  const navigate = useNavigate();
  // State lưu token
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [loading, setLoading] = useState(false);

  // Hàm đăng nhập
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const username = e.target.username.value;
      const password = e.target.password.value;

      // Gửi yêu cầu POST đến API
      const response = await axios.post(
        "http://localhost:8070/api/user/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Giả sử API trả về token trong response.data.accessToken
      const token = response.data.data.token;

      // Lưu token vào localStorage và state
      localStorage.setItem("accessToken", token);
      setAccessToken(token);

      notify("success", "Đăng nhập thành công!");
      navigate("/home");
    } catch (err) {
      // Xử lý lỗi từ API
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại!";
      notify("error", errorMessage);
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

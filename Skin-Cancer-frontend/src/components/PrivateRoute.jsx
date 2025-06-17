import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // ✅ use named import


const isTokenValid = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  if (!isTokenValid()) {
    toast.error("Please login to access this page.");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;

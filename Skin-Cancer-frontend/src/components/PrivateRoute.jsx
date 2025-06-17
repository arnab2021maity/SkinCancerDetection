import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react"; // ✅ useRef for single toast control

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
  const hasShownToast = useRef(false);

  if (!isTokenValid()) {
    if (!hasShownToast.current) {
      toast.error("Please login to access this page.");
      hasShownToast.current = true;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

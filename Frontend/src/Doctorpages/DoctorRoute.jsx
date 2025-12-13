import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/CheckAuth";
const DoctorRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== "doctor") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default DoctorRoute;

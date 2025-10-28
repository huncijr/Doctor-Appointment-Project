import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../Context/AppointmentAPI";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get("/checkAuth", { withCredentials: true });
        if (response.data.loggedIn) {
          setUser(response.data.user);
          console.log(response.data.user);
        }
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          console.log(error);
        }
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

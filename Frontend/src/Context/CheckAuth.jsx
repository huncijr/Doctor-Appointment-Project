import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../Context/AppointmentAPI";
import { useCookie } from "./Cookies.jsx";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const { setCookies, cookies } = useCookie();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get("/checkAuth", { withCredentials: true });
        if (response.data.loggedIn) {
          console.log("ez lefutott");
          setUser(response.data.user);
          console.log(response.data.user);
        }
      } catch (error) {}
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setCookies();
        } catch (error) {
          console.error(error);
        }
      } else {
        setUser(null);
      }
    };
    checkAuth();
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

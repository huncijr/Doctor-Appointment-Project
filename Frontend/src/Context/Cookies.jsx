import { createContext, useState, useContext, useEffect } from "react";

const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const [cookies, setCookies] = useState(false);
  useEffect(() => {
    const saved = sessionStorage.getItem("Cookies");
    if (saved) setCookies(saved === "true");
  }, []);
  const acceptCookies = () => {
    sessionStorage.setItem("Cookies", "true");
    setCookies(true);
  };
  const declineCookies = () => {
    sessionStorage.setItem("Cookies", "false");
    setCookies(false);
  };
  useEffect(() => {
    console.log(cookies);
  }, [cookies]);
  return (
    <CookieContext.Provider value={{ cookies, acceptCookies, declineCookies }}>
      {children}
    </CookieContext.Provider>
  );
};
export const useCookie = () => useContext(CookieContext);

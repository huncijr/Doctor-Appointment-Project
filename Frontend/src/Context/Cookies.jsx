import { createContext, useState, useContext, useEffect } from "react";

const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const [cookies, setCookies] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("Cookies");
    if (saved) setCookies(saved === "true");
  }, []);
  const acceptCookies = () => {
    localStorage.setItem("Cookies", "true");
    setCookies(true);
  };
  const declineCookies = () => {
    localStorage.setItem("Cookies", "false");
    setCookies(false);
  };
  useEffect(() => {
    //console.log(cookies);
  }, [cookies]);
  return (
    <CookieContext.Provider
      value={{ cookies, setCookies, acceptCookies, declineCookies }}
    >
      {children}
    </CookieContext.Provider>
  );
};
export const useCookie = () => useContext(CookieContext);

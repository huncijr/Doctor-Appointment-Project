import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/CheckAuth.jsx";
import CookieUI from "./Components/CookieUI.jsx";
import { CookieProvider } from "./Context/Cookies.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CookieProvider>
          <CookieUI />
          <App />
        </CookieProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

import HomePage from "./Pages/HomePage.jsx";
import Background from "./Components/Background.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import NewAppointment from "./Pages/NewAppointment.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import AllAppointmentPage from "./Pages/AllAppointmentPage.jsx";
import AboutMePage from "./Pages/AboutMePage.jsx";
import { Route, Routes, useMatch, useLocation } from "react-router-dom";
import AppointmentPage from "./Pages/AppointmentPage.jsx";
import { DoctorProvider } from "./Context/DoctorContext.jsx";
import { Toaster } from "react-hot-toast";
import Meteors from "./Components/GenerateMeteors";
import Stars from "./Components/Stars.jsx";

function App() {
  const location = useLocation();
  const path = location.pathname;
  const AllRoutes = [
    "/Home",
    "/Appointment",
    "/AddAppointment",
    "/Account",
    "/MyAppointments",
    "/AboutMe",
  ];
  const StarRoute = ["/AboutMe"];

  const showBackground = AllRoutes.some((r) => path.startsWith(r));
  const showMeteors = AllRoutes.some((r) => path.startsWith(r));
  const showStars = StarRoute.some((r) => path.startsWith(r));
  return (
    <DoctorProvider>
      <Toaster />
      <div
        className={`relative min-h-screen overflow-x-hidden ${
          showBackground ? "bg-secondary " : ""
        }`}
      >
        {showBackground && <Background />}
        {showMeteors && <Meteors />}
        {showStars && <Stars />}
        <Routes>
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Appointment/:id" element={<AppointmentPage />} />
          <Route path="/AddAppointment/:id" element={<NewAppointment />} />
          <Route path="/AboutMe" element={<AboutMePage />} />
          <Route path="/MyAppointments" element={<AllAppointmentPage />} />
          <Route path="/Account" element={<LoginPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </DoctorProvider>
  );
}

export default App;

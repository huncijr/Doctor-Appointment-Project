import HomePage from "./Pages/HomePage.jsx";
import Background from "./Components/Background.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import NewAppointment from "./Pages/NewAppointment.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import AllAppointmentPage from "./Pages/AllAppointmentPage.jsx";
import { Route, Routes, useMatch } from "react-router-dom";
import AppointmentPage from "./Pages/AppointmentPage.jsx";
import { DoctorProvider } from "./Context/DoctorContext.jsx";
import { Toaster } from "react-hot-toast";
import Meteors from "./Components/GenerateMeteors";

function App() {
  const isHome = useMatch("/Home");
  const isAppointment = useMatch("/Appointment/:id");
  const isnewAppointment = useMatch("/AddAppointment/:id");
  const isAccount = useMatch("/Account");
  const AllAppointments = useMatch("/MyAppointments");
  const showBackground =
    isHome || isAppointment || isnewAppointment || isAccount || AllAppointments;
  const showMeteors =
    isHome || isAppointment || isnewAppointment || isAccount || AllAppointments;
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
        <Routes>
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Appointment/:id" element={<AppointmentPage />} />
          <Route path="/AddAppointment/:id" element={<NewAppointment />} />
          <Route path="/MyAppointments" element={<AllAppointmentPage />} />
          <Route path="/Account" element={<LoginPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </DoctorProvider>
  );
}

export default App;

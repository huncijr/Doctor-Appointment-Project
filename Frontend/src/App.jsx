import HomePage from "./Pages/HomePage.jsx";
import Background from "./Components/Background.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import { Route, Routes, useMatch } from "react-router-dom";
import AppointmentPage from "./Pages/AppointmentPage.jsx";
import { DoctorProvider } from "./Context/DoctorContext.jsx";
import Meteors from "./Components/GenerateMeteors";
function App() {
  const isHome = useMatch("/Home");
  const isAppointment = useMatch("/Appointment/:id");
  const showBackground = isHome || isAppointment;
  const showMeteors = isHome || isAppointment;
  return (
    <DoctorProvider>
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
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </DoctorProvider>
  );
}

export default App;

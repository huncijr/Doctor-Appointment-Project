import HomePage from "./Pages/HomePage.jsx";
import Background from "./Components/Background.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import { Route, Routes, useMatch } from "react-router-dom";
import AppointmentPage from "./Pages/AppointmentPage.jsx";
import { DoctorProvider } from "./Context/DoctorContext.jsx";
function App() {
  const isHome = useMatch("/Home");
  const isAppointment = useMatch("/Appointment/:id");
  const showBackground = isHome || isAppointment;
  return (
    <DoctorProvider>
      <div
        className={`relative min-h-screen overflow-x-hidden ${
          showBackground ? "bg-secondary " : ""
        }`}
      >
        {showBackground && <Background />}
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

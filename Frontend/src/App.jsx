import HomePage from "./Pages/HomePage.jsx";
import Background from "./Menu/Background.jsx";
import { Route, Routes } from "react-router-dom";
import AppointmentPage from "./Pages/AppointmentPage.jsx";
import { DoctorProvider } from "./Context/DoctorContext.jsx";
function App() {
  return (
    <DoctorProvider>
      <div className="relative min-h-screen bg-secondary overflow-x-hidden">
        <Background />
        <Routes>
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Appointment" element={<AppointmentPage />} />
        </Routes>
      </div>
    </DoctorProvider>
  );
}

export default App;

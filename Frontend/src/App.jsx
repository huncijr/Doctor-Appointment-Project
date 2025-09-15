import HomePage from "./Pages/HomePage.jsx";
import Background from "./Menu/Background.jsx";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="relative min-h-screen bg-secondary">
      <Background />
      <Routes>
        <Route path="/Home" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;

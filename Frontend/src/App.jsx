import HomePage from "./Pages/HomePage";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/Home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;

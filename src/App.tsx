import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import IssuePage from "./views/IssuePage";
import NotFound from "./views/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<IssuePage />} />
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

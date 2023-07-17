import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { UserProvider } from "./userContext";
import "./App.css";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
      </Routes>
    </UserProvider>
  );
}

export default App;

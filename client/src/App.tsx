import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ThemeProvider } from "./components/theme-provider";
import { UserContextProvider } from "./context/userContext";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

export default function App() {
  const [userData, setUserData] = useState(null);

  return (
    <div>
      <UserContextProvider value={{ userData, setUserData }}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserContextProvider>
    </div>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ThemeProvider } from "./components/theme-provider";
import { UserContextProvider } from "./context/userContext";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import DashboardProtect from "./protectedRoute/DashboardProtect";
import Cookies from "js-cookie";
export default function App() {
  const [userData, setUserData] = useState(null);
  const getAuthStatus = (cookieValue: string | undefined): boolean => {
    return cookieValue === "true"; // Convert the string "true" to the boolean true
  };
  
  const [isAuthenticated, setAuthnticated] = useState<boolean>(
    getAuthStatus(Cookies.get("isAuthenticated"))
  )

  return (
    <div>
      <UserContextProvider
        value={{ userData, setUserData, isAuthenticated, setAuthnticated }}
      >
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                element={<DashboardProtect isAuthenticated={isAuthenticated} />}
              >
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserContextProvider>
    </div>
  );
}

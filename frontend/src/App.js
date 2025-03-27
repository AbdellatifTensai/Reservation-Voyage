import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TrainView from "./view/TrainView";
import ReservationView from "./view/ReservationView";
import LoginController from "./controllers/LoginController";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser(loggedInUser);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const AdminRoute = ({ children }) => {
    return user && user.role === "admin" ? children : <Navigate to="/" />;
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Train Reservation System</h1>
        {user && (
          <div className="mb-4">
            <p className="mb-2">Welcome, {user.username} ({user.role})</p>
            <button onClick={handleLogout} className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<LoginController onLogin={handleLogin} />} />
          <Route path="/reservations" element={<ProtectedRoute><ReservationView /></ProtectedRoute>} />
          <Route path="/trains" element={<AdminRoute><TrainView /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

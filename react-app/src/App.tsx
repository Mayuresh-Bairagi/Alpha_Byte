import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import { PatientProvider } from "./context/PatientContext";
import "./App.css";

function App() {
  return (
    <Router>
      <PatientProvider>
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </PatientProvider>
    </Router>
  );
}

export default App;

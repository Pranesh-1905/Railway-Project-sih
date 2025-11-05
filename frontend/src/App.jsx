import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ManufacturerDashboard from "./Pages/Manufacturer/Dashboard";
import LandingPage from "./components/LandingPage";
import QualityDashboard from "./Pages/Quality Check/Dashboard";
import WarehouseDashboard from "./Pages/Warehouse/Dashboard";
import Dashboard from "./Pages/Admin/Dashboard";

function App() {
  return (
    <Router>
      <Toaster />
      <div className="App">
        <Routes>
          <Route index path="/" element={<LandingPage />} />
          <Route index path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route element={<ProtectedRoutes role="MANUFACTURER" />}>
            <Route
              path="/manufacturer/dashboard"
              element={<ManufacturerDashboard />}
            />
          </Route>
          <Route element={<ProtectedRoutes role="QUALITY_INSPECTOR" />}>
            <Route
              path="/quality_inspector/dashboard"
              element={<QualityDashboard />}
            />
          </Route>
          <Route element={<ProtectedRoutes role="WAREHOUSE_MANAGER" />}>
            <Route
              path="/warehouse_manager/dashboard"
              element={<WarehouseDashboard />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

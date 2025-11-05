import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import logo from "../../assets/image-removebg-preview.png";
import sarlogo from "../../assets/SAR_Logo-removebg-preview.png";

const roles = [
  { value: "MANUFACTURER", label: "Manufacturer" },
  { value: "QUALITY_INSPECTOR", label: "Quality Inspector" },
  { value: "WAREHOUSE_MANAGER", label: "Warehouse Manager" },
  // ...add other roles as needed
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    company_name: "",
    license_number: "",
    address: "",
    registration_date: "",
    employee_id: "",
    department: "",
    railway_zone: "",
    division: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isManufacturer = form.role === "MANUFACTURER";
  const isQuality = form.role === "QUALITY_INSPECTOR";
  const isWarehouse = form.role === "WAREHOUSE_MANAGER";

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userDetails = {
      username: form.username,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role,
    };
    if (isManufacturer) {
      userDetails = {
        ...userDetails,
        company_name: form.company_name,
        license_number: form.license_number,
        address: form.address,
        registration_date: form.registration_date,
      };
    } else if (isQuality || isWarehouse) {
      userDetails = {
        ...userDetails,
        employee_id: form.employee_id,
        department: form.department,
        railway_zone: form.railway_zone,
        division: form.division,
      };
    }
    try {
      await api.post("/auth/register", userDetails);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-400/20 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="relative">
              <img
                src={logo}
                alt="Railway Logo"
                className="w-20 h-20 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300 filter brightness-500 contrast-150"
              />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div className="animate-slide-right">
              <h2 className="text-2xl font-bold text-white tracking-wide bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Indian Railways QR Component Tracking System
              </h2>
              <p className="text-blue-300 text-sm font-semibold animate-fade-in-up">
                Ministry of Railways, Government of India
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 animate-fade-in-left">
            <div className="text-blue-200 text-xs text-right">
              Powered by <br />
              <span className="font-bold text-cyan-300">
                Society of Automation and Robotics
              </span>
            </div>
            <div className="relative">
              <img
                src={sarlogo}
                alt="SAR Logo"
                className="w-12 h-12 object-contain drop-shadow-xl hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-4xl bg-slate-800/60 backdrop-blur-2xl rounded-2xl shadow-2xl border border-blue-400/30 p-10 animate-scale-in hover:border-blue-400/50 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-2xl animate-float relative">
              📝
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Create Government Portal Account
            </h2>
            <p className="text-blue-300 animate-fade-in-up">Register for official access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl text-red-300 text-sm animate-shake backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="relative group">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="relative group">
                <input
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="relative group">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
              >
                <option value="" className="bg-slate-800">Select your role</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value} className="bg-slate-800">
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Manufacturer fields */}
            {isManufacturer && (
              <div className="space-y-4 p-6 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-blue-400/20 animate-fade-in">
                <h3 className="text-lg font-semibold text-blue-300 mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Manufacturer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      name="company_name"
                      placeholder="Company Name"
                      value={form.company_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div className="relative group">
                    <input
                      name="license_number"
                      placeholder="License Number"
                      value={form.license_number}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                <div className="relative group">
                  <input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="relative group">
                  <input
                    name="registration_date"
                    type="date"
                    placeholder="Registration Date"
                    value={form.registration_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            )}

            {/* Railway Staff fields */}
            {(isQuality || isWarehouse) && (
              <div className="space-y-4 p-6 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-blue-400/20 animate-fade-in">
                <h3 className="text-lg font-semibold text-blue-300 mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Railway Staff Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      name="employee_id"
                      placeholder="Employee ID"
                      value={form.employee_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div className="relative group">
                    <input
                      name="department"
                      placeholder="Department"
                      value={form.department}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div className="relative group">
                    <input
                      name="railway_zone"
                      placeholder="Railway Zone"
                      value={form.railway_zone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div className="relative group">
                    <input
                      name="division"
                      placeholder="Division"
                      value={form.division}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 animate-slide-up relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative z-10">Create Account</span>
              </button>
              <button
                type="button"
                className="flex-1 py-4 px-4 bg-slate-700/50 backdrop-blur-sm border border-slate-500/50 text-slate-300 rounded-xl font-medium hover:bg-slate-600/50 hover:border-slate-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-slide-up"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </form>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 py-2 text-blue-300 hover:text-blue-200 transition-colors duration-300 text-sm animate-fade-in"
          >
            ← Back to Home
          </button>

          <div className="mt-6 text-xs text-blue-300 text-center animate-fade-in">
            <span className="font-semibold">Note:</span> This portal is for
            authorized government personnel only.
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-blue-300/70 text-xs bg-slate-900/50 backdrop-blur-sm border-t border-blue-400/20 relative z-10 animate-fade-in">
        <span className="font-bold">Government Portal Disclaimer:</span>{" "}
        Unauthorized access is prohibited. All activities are monitored and
        logged.
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-right { animation: slide-right 1s ease-out; }
        .animate-fade-in-left { animation: fade-in-left 1s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

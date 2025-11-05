import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/image-removebg-preview.png";
import sarlogo from "../../assets/SAR_Logo-removebg-preview.png";
import { useAuth } from "../../contexts/AuthContext";

const roles = [
//   { label: "Railway Admin", value: "RAILWAY_ADMIN" },
//   { label: "Procurement Officer", value: "PROCUREMENT_OFFICER" },
  { label: "Manufacturer", value: "MANUFACTURER" },
  { label: "Quality Inspector", value: "QUALITY_INSPECTOR" },
  { label: "Warehouse Manager", value: "WAREHOUSE_MANAGER" },

//   { label: "Substation Manager", value: "SUBSTATION_MANAGER" },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth, login } = useAuth();

  useEffect(() => {
    if (auth?.role) {
      switch (auth.role) {
        case "MANUFACTURER":
          navigate("/manufacturer/dashboard");
          break;
        case "QUALITY_INSPECTOR":
          navigate("/quality_inspector/dashboard");
          break;
        case "WAREHOUSE_MANAGER":
          navigate("/warehouse_manager/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    }
  }, [auth, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(form.username, form.password, form.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
        <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-2xl rounded-2xl shadow-2xl border border-blue-400/30 p-10 animate-scale-in hover:border-blue-400/50 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-2xl animate-float relative">
              🔐
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Government Portal Login
            </h2>
            <p className="text-blue-300 animate-fade-in-up">Sign in to your official account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl text-red-300 text-sm animate-shake backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative group">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
                >
                  <option value="" className="bg-slate-800">-- Select Role --</option>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value} className="bg-slate-800">
                      {r.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
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
                  className="w-full px-4 py-4 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50 animate-slide-up"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 animate-slide-up relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="ml-2">Authenticating...</span>
                </div>
              ) : (
                <span className="relative z-10">Sign In</span>
              )}
            </button>

            <button
              type="button"
              className="w-full py-4 px-4 bg-slate-700/50 backdrop-blur-sm border border-slate-500/50 text-slate-300 rounded-xl font-medium hover:bg-slate-600/50 hover:border-slate-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-slide-up"
              onClick={() => navigate("/register")}
            >
              Register New Account
            </button>
          </form>

          <div className="mt-8 text-xs text-blue-300 text-center animate-fade-in">
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
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import api from "../../utils/api";

const ComponentDetail = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    if (!auth?.role || auth.role !== "manufacturing") {
      navigate("/Manufacturer/login");
    }
  }, [auth, navigate]);

  // Fetch component details
  useEffect(() => {
    const fetchComponent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/manufacturer/components/${id}`);
        setComponent(response.data.component);
      } catch (err) {
        setError("Component not found or access denied");
        console.error("Error fetching component:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComponent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading component details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Component Details</h1>
            <button
              onClick={() => navigate("/Manufacturer/dashboard")}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Component Details</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/manufacturer/scan")}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              📷 Scan Another
            </button>
            <button
              onClick={() => navigate("/Manufacturer/dashboard")}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {component ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Component Info */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-green-400">
                ✅ Component Found
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Component Type:</span>
                  <span className="text-blue-300">
                    {component.componentName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Serial Number:</span>
                  <span className="text-blue-300">
                    {component.serialNumber}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Batch Number:</span>
                  <span className="text-blue-300">{component.batchNumber}</span>
                </div>

                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Manufacturing Date:</span>
                  <span className="text-blue-300">
                    {new Date(component.generatedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Component ID:</span>
                  <span className="text-blue-300 font-mono text-sm">
                    {component._id}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Status:</span>
                  <span className="text-green-300">✅ Verified</span>
                </div>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">QR Code</h2>

              {component.qrData ? (
                <div className="text-center">
                  <img
                    src={component.qrData}
                    alt="Component QR Code"
                    className="w-64 h-64 mx-auto bg-white p-4 rounded-lg shadow-lg"
                  />
                  <p className="text-gray-400 mt-4 text-sm">
                    QR Code for component tracking
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📷</div>
                  <p>No QR code available for this component</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Component Not Found</h2>
            <p className="text-gray-300">
              The requested component could not be found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentDetail;

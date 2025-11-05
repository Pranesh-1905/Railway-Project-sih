import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";

const ManufacturerDashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [components, setComponents] = useState([]);
  const [manufacturerDetails, setManufacturerDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [qrModal, setQrModal] = useState(null);

  const [formData, setFormData] = useState({
    item_code: "",
    component_name: "",
    specifications: {
      material: "",
      hardness: "",
      tensile_strength: "",
      surface_treatment: "",
    },
    production_date: new Date().toISOString().split("T")[0],
    warranty_period: 24,
    unit_weight: "",
    irs_specification: "",
  });

  // Global batch size state for each component type
  const [batchSizes, setBatchSizes] = useState({
    "Rail Clip": 10,
    "Fish Plate": 10,
    "Rail Pad": 10,
    "Sleeper": 10,
    "Base Plate": 10,
  });

  // Add a selectedComponentType state to track which type is being generated
  const [selectedComponentType, setSelectedComponentType] = useState("");

  // Requests state
  const [requests, setRequests] = useState([
    {
      id: 1,
      warehouse: "Central Depot",
      component: "Rail Clip",
      quantity: 5,
      requestedAt: "2024-06-01",
    },
    {
      id: 2,
      warehouse: "North Yard",
      component: "Fish Plate",
      quantity: 3,
      requestedAt: "2024-06-02",
    },
    {
      id: 3,
      warehouse: "East Storage",
      component: "Sleeper",
      quantity: 2,
      requestedAt: "2024-06-03",
    },
    {
      id: 4,
      warehouse: "West Facility",
      component: "Rail Pad",
      quantity: 8,
      requestedAt: "2024-06-04",
    },
    {
      id: 5,
      warehouse: "South Hub",
      component: "Base Plate",
      quantity: 4,
      requestedAt: "2024-06-05",
    },
    {
      id: 6,
      warehouse: "Logistics Center",
      component: "Rail Clip",
      quantity: 6,
      requestedAt: "2024-06-06",
    },
    {
      id: 7,
      warehouse: "Maintenance Shed",
      component: "Fish Plate",
      quantity: 2,
      requestedAt: "2024-06-07",
    },
    {
      id: 8,
      warehouse: "Yard Annex",
      component: "Sleeper",
      quantity: 3,
      requestedAt: "2024-06-08",
    },
    {
      id: 9,
      warehouse: "Spare Parts Bay",
      component: "Rail Pad",
      quantity: 7,
      requestedAt: "2024-06-09",
    },
    {
      id: 10,
      warehouse: "Assembly Point",
      component: "Base Plate",
      quantity: 5,
      requestedAt: "2024-06-10",
    },
  ]);

  const componentTypes = [
    {
      name: "Rail Clip",
      code: "ERC-60E1-A",
      irs: "IRS-T-40-2018",
      weight: 0.85,
    },
    {
      name: "Fish Plate",
      code: "FPL-52KG-B",
      irs: "IRS-T-12-2019",
      weight: 12.5,
    },
    { name: "Rail Pad", code: "RPD-EVA-C", irs: "IRS-T-18-2020", weight: 0.15 },
    { name: "Sleeper", code: "SLP-PSC-D", irs: "IRS-T-58-2017", weight: 285.0 },
    {
      name: "Base Plate",
      code: "BPL-CI-E",
      irs: "IRS-T-25-2018",
      weight: 18.5,
    },
    {
      name: "Rail",
      code: "RAIL-60E1",
      irs: "IRS-T-12-2009",
      weight: 60.0,
    },
  ];

  useEffect(() => {
    fetchComponents();
    fetchManufacturerDetails();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await api.get("/manufacturer/components/list");
      setComponents(response.data.components || []);
    } catch (error) {
      toast.error("Failed to fetch components");
    }
  };

  const fetchManufacturerDetails = async () => {
    try {
      const response = await api.get("/manufacturer/mydetails");
      setManufacturerDetails(response.data);
    } catch (error) {
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("specifications.")) {
      const specField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Update handleComponentSelect to set selectedComponentType
  const handleComponentSelect = (component) => {
    setFormData((prev) => ({
      ...prev,
      component_name: component.name,
      item_code: component.code,
      irs_specification: component.irs,
      unit_weight: component.weight.toString(),
    }));
    setSelectedComponentType(component.name);
  };

  const generateComponent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        production_date: new Date(formData.production_date).toISOString(),
        unit_weight: parseFloat(formData.unit_weight),
        warranty_period: parseInt(formData.warranty_period),
        batch_size: batchSizes[selectedComponentType] || 10,
      };

      const response = await api.post(
        "/manufacturer/components/generate_qr",
        payload
      );
      toast.success("Component generated successfully!");
      setComponents((prev) => [...prev, response.data.component]);
      setShowForm(true);
      // setFormData({
      //   item_code: "",
      //   component_name: "",
      //   specifications: {
      //     material: "",
      //     hardness: "",
      //     tensile_strength: "",
      //     surface_treatment: "",
      //   },
      //   production_date: new Date().toISOString().split("T")[0],
      //   warranty_period: 24,
      //   unit_weight: "",
      //   irs_specification: "",
      // });
      setSelectedComponentType("");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to generate component"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredComponents = components.filter(
    (comp) =>
      comp.component_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.item_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.batch_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate today's date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Count components generated today by type
  const todayCounts = componentTypes.reduce((acc, comp) => {
    acc[comp.name] = components.filter(c =>
      c.component_name === comp.name &&
      c.production_date &&
      new Date(c.production_date).toISOString().split('T')[0] === todayStr
    ).length;
    return acc;
  }, {});

  // Fetch production counts from backend for selected date (local calculation)
  const fetchProductionCounts = async (dateStr) => {
    setLoadingProduction(true);
    try {
      // Ensure dateStr is in YYYY-MM-DD format
      const yyyymmdd = new Date(dateStr).toISOString().split('T')[0];
      const response = await api.get("/manufacturer/components/daily_counts_local", {
        params: { date: yyyymmdd }
      });
      setProductionCounts(response.data.counts || {});
    } catch (error) {
      setProductionCounts({});
      toast.error(error.response?.data?.detail || "Failed to fetch daily production counts");
      console.error(error);
    } finally {
      setLoadingProduction(false);
    }
  };

  // Fetch all daily production counts grouped by date
  const fetchAllDailyCounts = async () => {
    try {
      const response = await api.get("/manufacturer/components/daily_counts_by_date", {
        params: { date: new Date().toISOString().split('T')[0] }
      });
      // response.data.counts_by_date is {date: {component_name: count, ...}, ...}
      return response.data.counts_by_date || {};
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to fetch daily production summary");
      return {};
    }
  };

  // Fetch on modal open and date change
 
  // Accept request handler
  const handleAcceptRequest = (req) => {
    // Simulate QR/component generation for each quantity
    for (let i = 0; i < req.quantity; i++) {
      const compType = componentTypes.find((c) => c.name === req.component);
      if (!compType) continue;
      const uuid = Math.random().toString(36).substring(2, 10) + Date.now();
      const newComponent = {
        _id: uuid,
        component_id: `COMP${Date.now()}${i}`,
        qr_code: `QR${Date.now()}${uuid.slice(-6)}`,
        item_code: compType.code,
        component_name: compType.name,
        specifications: {},
        batch_number: `BATCH${compType.code}${req.requestedAt.replace(/-/g, '')}${i+1}`,
        serial_number: `SER${Date.now()}${uuid.slice(-4)}`,
        manufacturer_id: "dummy",
        production_date: new Date().toISOString(),
        warranty_period: 24,
        unit_weight: compType.weight,
        irs_specification: compType.irs,
        qr_data: null, // Simulate no QR image
        generated_at: new Date().toISOString(),
        qc_status: "Pending",
        uuid: uuid,
      };
      setComponents((prev) => [...prev, newComponent]);
    }
    toast.success(
      `Accepted request from ${req.warehouse} for ${req.quantity} ${req.component}(s)`
    );
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-900 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Requests Sidebar */}
      <div className="w-100 bg-slate-800/60 backdrop-blur-2xl border-r border-blue-400/30 p-6 flex flex-col relative z-10 animate-slide-right">
        <h2 className="text-xl font-bold text-white mb-4 text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Warehouse Requests</h2>
        {requests.length === 0 ? (
          <div className="text-center text-gray-400 py-6">No pending requests</div>
        ) : (
          <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl border border-blue-400/20 p-4">
            <table className="w-full mb-2 text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2 text-blue-200">Warehouse</th>
                  <th className="text-left py-2 px-2 text-blue-200">Component</th>
                  <th className="text-left py-2 px-2 text-blue-200">Qty</th>
                  <th className="text-left py-2 px-2 text-blue-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-600/30 transition-colors duration-200">
                    <td className="py-2 px-2 text-gray-100">{req.warehouse}</td>
                    <td className="py-2 px-2 text-cyan-300 font-bold">{req.component}</td>
                    <td className="py-2 px-2 text-gray-100">{req.quantity}</td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg text-xs transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                      >
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10">
        {/* Header */}
        <header className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-400/20 shadow-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Manufacturer Dashboard
                </h1>
                <p className="text-blue-300">
                  Welcome, {manufacturerDetails?.name || auth.username}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                >
                  <span>➕</span>
                  <span>New Component</span>
                </button>
                <button
                  onClick={() => navigate("/manufacturer/profile")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
            <div className="bg-slate-800/60 backdrop-blur-2xl rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-lg font-semibold text-white mb-2">
                Total Components
              </h3>
              <p className="text-3xl font-bold text-blue-300">
                {components.length}
              </p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-2xl rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-lg font-semibold text-white mb-2">
                Pending QC
              </h3>
              <p className="text-3xl font-bold text-yellow-300">
                {components.filter((c) => c.qc_status === "Pending").length}
              </p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-2xl rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-lg font-semibold text-white mb-2">Approved</h3>
              <p className="text-3xl font-bold text-green-300">
                {components.filter((c) => c.qc_status === "Approved").length}
              </p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-2xl rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-lg font-semibold text-white mb-2">Rating</h3>
              <p className="text-3xl font-bold text-purple-300">
                {manufacturerDetails?.rating?.toFixed(1) || "N/A"}
              </p>
            </div>
          </div>

          {/* Component Generation Form */}
          {showForm && (
            <div className="bg-slate-800/60 backdrop-blur-2xl rounded-2xl p-8 border border-blue-400/30 mb-8 animate-scale-in hover:border-blue-400/50 transition-all duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Generate New Component
              </h2>

           

              {/* Quick Select Component Types */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Quick Select Component Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {componentTypes.map((comp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleComponentSelect(comp)}
                      className="p-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white transition-all duration-300 hover:border-blue-400/50 hover:bg-slate-600/50 transform hover:scale-105"
                    >
                      <div className="text-sm font-semibold">{comp.name}</div>
                      <div className="text-xs text-blue-300">{comp.code}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={generateComponent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Component Name
                    </label>
                    <input
                      type="text"
                      name="component_name"
                      value={formData.component_name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-slate-700/50 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300 transition-all duration-300 hover:border-blue-400/50"
                      placeholder="Enter component name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Item Code
                    </label>
                    <input
                      type="text"
                      name="item_code"
                      value={formData.item_code}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ERC-60E1-A"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Unit Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="unit_weight"
                      value={formData.unit_weight}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter weight in kg"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      IRS Specification
                    </label>
                    <input
                      type="text"
                      name="irs_specification"
                      value={formData.irs_specification}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., IRS-T-40-2018"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Production Date
                    </label>
                    <input
                      type="date"
                      name="production_date"
                      value={formData.production_date}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Warranty Period (months)
                    </label>
                    <input
                      type="number"
                      name="warranty_period"
                      value={formData.warranty_period}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="24"
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="specifications.material"
                      value={formData.specifications.material}
                      onChange={handleInputChange}
                      placeholder="Material (e.g., Spring Steel)"
                      className="p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="specifications.hardness"
                      value={formData.specifications.hardness}
                      onChange={handleInputChange}
                      placeholder="Hardness (e.g., 42-48 HRC)"
                      className="p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="specifications.tensile_strength"
                      value={formData.specifications.tensile_strength}
                      onChange={handleInputChange}
                      placeholder="Tensile Strength"
                      className="p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="specifications.surface_treatment"
                      value={formData.specifications.surface_treatment}
                      onChange={handleInputChange}
                      placeholder="Surface Treatment"
                      className="p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition duration-300 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>🏭</span>
                        <span>Generate Component</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search components by name, code, or batch number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Components Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">
                Manufactured Components
              </h2>
            </div>

            {filteredComponents.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-xl">No components found</p>
                <p>Start by generating your first component</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">
                        Component
                      </th>
                      <th className="px-6 py-4 text-left text-white font-semibold">
                        Item Code
                      </th>
                      <th className="px-6 py-4 text-left text-white font-semibold">
                        Serial No.
                      </th>
                      <th className="px-6 py-4 text-left text-white font-semibold">
                        Batch No.
                      </th>
                      <th className="px-6 py-4 text-left text-white font-semibold">
                        QC Status
                      </th>
                      <th className="px-6 py-4 text-left text-white font-semibold">
                        Weight
                      </th>
                      <th className="px-6 py-4 text-left text-white font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComponents.map((component, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="px-6 py-4 text-white">
                          {component.component_name}
                        </td>
                        <td className="px-6 py-4 text-blue-300">
                          {component.item_code}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {component.serial_number}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {/* Format batch number as BATCH-{item_code}-{batch_index} if possible */}
                          {(() => {
                            if (component.batch_number && component.item_code) {
                              // Try to extract batch index from backend batch_number (e.g., BATCH0001)
                              const match = component.batch_number.match(/BATCH(\d+)/);
                              const batchIndex = match ? match[1] : component.batch_number;
                              return `BATCH-${component.item_code}-${batchIndex}`;
                            }
                            return component.batch_number;
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              component.qc_status === "Approved"
                                ? "bg-green-600/30 text-green-300"
                                : component.qc_status === "Rejected"
                                ? "bg-red-600/30 text-red-300"
                                : "bg-yellow-600/30 text-yellow-300"
                            }`}
                          >
                            {component.qc_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {component.unit_weight} kg
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setQrModal(component.qr_data)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 text-sm"
                          >
                            View QR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* QR Modal */}
        {qrModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setQrModal(null)}
          >
            <div
              className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Component QR Code
              </h3>
              <div className="flex justify-center mb-4">
                <img
                  src={qrModal}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
              <button
                onClick={() => setQrModal(null)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-30px); }
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
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-right { animation: slide-right 1s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ManufacturerDashboard;

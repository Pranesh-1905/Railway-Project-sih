import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Fragment, useState as useReactState } from "react";

const config = {
  icon: "📦",
  gradient: "from-orange-600 to-red-700",
  bg: "from-orange-900/20 to-red-900/20",
  features: [
    "Inventory Status",
    "Stock Management",
    "Shipping Orders",
    "Storage Analytics",
  ],
};

const componentCodes = {
  Sleeper: "SLP",
  Rail: "RAIL",
  Fishplate: "FPL",
  Bolt: "BLT",
  Nut: "NUT",
  "Base Plate": "BPL",
  Switch: "SWT",
  Crossing: "CRS",
  Fastener: "FST",
  Insulator: "INS",
};

const dummyInventory = [
  {
    id: 1,
    name: "Sleeper",
    code: "SLP",
    stock: 40,
    status: "OK",
    manufacturer: "ABC Rail",
    lastRestock: "2024-06-01",
  },
  {
    id: 2,
    name: "Rail",
    code: "RAIL",
    stock: 15,
    status: "Low",
    manufacturer: "RailParts Ltd",
    lastRestock: "2024-05-28",
  },
  {
    id: 3,
    name: "Fishplate",
    code: "FPL",
    stock: 5,
    status: "Critical",
    manufacturer: "SteelWorks",
    lastRestock: "2024-05-20",
  },
  {
    id: 4,
    name: "Bolt",
    code: "BLT",
    stock: 100,
    status: "OK",
    manufacturer: "BoltMakers",
    lastRestock: "2024-06-02",
  },
  {
    id: 5,
    name: "Nut",
    code: "NUT",
    stock: 60,
    status: "OK",
    manufacturer: "BoltMakers",
    lastRestock: "2024-06-02",
  },
  {
    id: 6,
    name: "Base Plate",
    code: "BPL",
    stock: 8,
    status: "Low",
    manufacturer: "ABC Rail",
    lastRestock: "2024-05-30",
  },
  {
    id: 7,
    name: "Switch",
    code: "SWT",
    stock: 2,
    status: "Critical",
    manufacturer: "SwitchTech",
    lastRestock: "2024-05-18",
  },
  {
    id: 8,
    name: "Crossing",
    code: "CRS",
    stock: 12,
    status: "OK",
    manufacturer: "RailParts Ltd",
    lastRestock: "2024-05-25",
  },
  {
    id: 9,
    name: "Fastener",
    code: "FST",
    stock: 30,
    status: "OK",
    manufacturer: "FastenPro",
    lastRestock: "2024-06-03",
  },
  {
    id: 10,
    name: "Insulator",
    code: "INS",
    stock: 7,
    status: "Low",
    manufacturer: "InsuSafe",
    lastRestock: "2024-05-29",
  },
];

const WarehouseDashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [inventory, setInventory] = useReactState(dummyInventory);
  const [showRequest, setShowRequest] = useReactState(false);
  const [selectedItem, setSelectedItem] = useReactState(null);
  const [requestQty, setRequestQty] = useReactState(1);
  const [requestNote, setRequestNote] = useReactState("");
  const [requestSuccess, setRequestSuccess] = useReactState("");
  
  // New states for dynamic features
  const [showAddItem, setShowAddItem] = useReactState(false);
  const [showStockUpdate, setShowStockUpdate] = useReactState(false);
  const [newItem, setNewItem] = useReactState({
    name: "",
    code: "",
    stock: 0,
    manufacturer: "",
    status: "OK"
  });

  const handleFeatureClick = (feature, index) => {
    switch(index) {
      case 0: // Inventory Status
        document.getElementById('inventory-table').scrollIntoView({ behavior: 'smooth' });
        break;
      case 1: // Stock Management
        setShowStockUpdate(true);
        break;
      case 2: // Add New Item
        setShowAddItem(true);
        break;
      case 3: // Storage Analytics
        alert('Storage Analytics: Total Items: ' + inventory.length + ', Critical Items: ' + inventory.filter(item => item.status === "Critical").length);
        break;
    }
  };

  const addNewItem = (e) => {
    e.preventDefault();
    const newId = Math.max(...inventory.map(item => item.id)) + 1;
    const itemToAdd = {
      ...newItem,
      id: newId,
      lastRestock: new Date().toISOString().split('T')[0]
    };
    setInventory([...inventory, itemToAdd]);
    setNewItem({ name: "", code: "", stock: 0, manufacturer: "", status: "OK" });
    setShowAddItem(false);
  };

  const updateStock = (itemId, newStock) => {
    setInventory(inventory.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            stock: newStock, 
            status: newStock <= 5 ? "Critical" : newStock <= 15 ? "Low" : "OK",
            lastRestock: new Date().toISOString().split('T')[0]
          }
        : item
    ));
  };

  useEffect(() => {
    if (auth?.role && auth.role !== "WAREHOUSE_MANAGER") {
      navigate("/login");
      }
  }, [auth?.role, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-teal-700 flex items-center justify-center text-2xl animate-float relative opacity-80">
              📦
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-700 rounded-full blur-lg opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                Warehouse Dashboard
              </h1>
              <p className="text-blue-300">
                {currentTime.toLocaleDateString()} •{" "}
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
          >
            Sign Out
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-slate-800/60 backdrop-blur-2xl border border-blue-400/30 rounded-2xl p-10 mb-10 animate-scale-in shadow-2xl hover:border-blue-400/50 transition-all duration-500">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              Warehouse Management Center
            </h2>
            <p className="text-blue-300 text-lg mb-6">
              You're logged in as{" "}
              <span className="font-semibold text-white capitalize bg-slate-700/50 px-3 py-1 rounded-full">
                Warehouse Manager
              </span>
            </p>
            <div className="flex justify-center gap-4">
              <div className="inline-flex items-center px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-sm font-medium">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                System Active
              </div>
              <div className="inline-flex items-center px-6 py-3 bg-teal-500/20 border border-teal-500/50 rounded-full text-teal-400 text-sm font-medium">
                <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                Inventory Tracking
              </div>
            </div>
          </div>
        </div>
        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {config.features.map((feature, index) => (
            <div
              key={feature}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/50 hover:border-gray-600/50 transform hover:scale-105 transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleFeatureClick(feature, index)}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {index === 0 ? "📊" : index === 1 ? "⚙️" : index === 2 ? "➕" : "📈"}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature}</h3>
                <p className="text-gray-400 text-sm">
                  {index === 0 ? "View inventory details" : 
                   index === 1 ? "Manage stock levels" :
                   index === 2 ? "Add new components" :
                   "View analytics"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 animate-in slide-in-from-right duration-700">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-700/30 hover:border-gray-600/50 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">Total Items</p>
                <p className="text-3xl font-bold text-white mt-2">{inventory.length}</p>
                <p className="text-green-400 text-xs mt-1">↗ Active inventory</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-white text-2xl">📦</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-700/30 hover:border-gray-600/50 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">
                  {inventory.filter(item => item.status === "Low").length}
                </p>
                <p className="text-yellow-400 text-xs mt-1">⚠ Needs attention</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-white text-2xl">⚡</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-700/30 hover:border-gray-600/50 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">Critical</p>
                <p className="text-3xl font-bold text-red-400 mt-2">
                  {inventory.filter(item => item.status === "Critical").length}
                </p>
                <p className="text-red-400 text-xs mt-1">🚨 Urgent restock</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-white text-2xl">🔥</div>
              </div>
            </div>
          </div>
        </div>
        {/* Inventory Table */}
        <div id="inventory-table" className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8 animate-in slide-in-from-left duration-700 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Inventory Overview</h3>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm font-medium">
                {inventory.filter(item => item.status === "OK").length} OK
              </div>
              <div className="px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium">
                {inventory.filter(item => item.status === "Low").length} Low
              </div>
              <div className="px-4 py-2 bg-red-500/20 rounded-full text-red-400 text-sm font-medium">
                {inventory.filter(item => item.status === "Critical").length} Critical
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-700/50">
            <table className="min-w-full text-sm text-gray-300">
              <thead>
                <tr className="bg-gray-900/60 border-b border-gray-700/50">
                  <th className="px-6 py-4 text-left font-semibold text-white">Component</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Code</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Stock</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Manufacturer</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Last Restock</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-700/30 hover:bg-gray-700/30 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/40'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {item.code}
                        </div>
                        <span className="font-semibold text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs font-mono">{item.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{item.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Critical"
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : item.status === "Low"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                            : "bg-green-500/20 text-green-400 border border-green-500/50"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          item.status === "Critical" ? "bg-red-400" :
                          item.status === "Low" ? "bg-yellow-400" : "bg-green-400"
                        }`}></div>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{item.manufacturer}</td>
                    <td className="px-6 py-4 text-gray-400">{item.lastRestock}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 text-xs"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowRequest(true);
                          setRequestQty(1);
                          setRequestNote("");
                          setRequestSuccess("");
                        }}
                      >
                        📋 Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Request Modal */}
        {showRequest && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in duration-300">
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 transition-all duration-200"
                onClick={() => setShowRequest(false)}
              >
                ✕
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl">
                  📋
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  Request to Manufacturer
                </h4>
                <p className="text-gray-300">
                  Component: <span className="font-semibold text-white bg-gray-700/50 px-3 py-1 rounded-full">{selectedItem.name}</span>
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRequestSuccess("Request sent successfully!");
                  setTimeout(() => {
                    setShowRequest(false);
                    setRequestSuccess("");
                  }, 1500);
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-400 mb-2 font-medium">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={requestQty}
                    onChange={(e) => setRequestQty(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-medium">Notes (optional)</label>
                  <textarea
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Add any specific requirements or notes..."
                  />
                </div>
                {requestSuccess && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center font-medium animate-in slide-in-from-top duration-300">
                    ✅ {requestSuccess}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Send Request
                </button>
              </form>
            </div>
          </div>
        )}
        
        {/* Add New Item Modal */}
        {showAddItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in duration-300">
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 transition-all duration-200"
                onClick={() => setShowAddItem(false)}
              >
                ✕
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl flex items-center justify-center text-2xl">
                  ➕
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Add New Item</h4>
                <p className="text-gray-300">Add a new component to inventory</p>
              </div>
              <form onSubmit={addNewItem} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2 font-medium">Component Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-medium">Code</label>
                  <input
                    type="text"
                    value={newItem.code}
                    onChange={(e) => setNewItem({...newItem, code: e.target.value.toUpperCase()})}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-medium">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-medium">Manufacturer</label>
                  <input
                    type="text"
                    value={newItem.manufacturer}
                    onChange={(e) => setNewItem({...newItem, manufacturer: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Stock Update Modal */}
        {showStockUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative animate-in zoom-in duration-300">
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 transition-all duration-200"
                onClick={() => setShowStockUpdate(false)}
              >
                ✕
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-teal-700 rounded-2xl flex items-center justify-center text-2xl">
                  ⚙️
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Stock Management</h4>
                <p className="text-gray-300">Update stock quantities for existing items</p>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {inventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        {item.code}
                      </div>
                      <div>
                        <span className="text-white font-semibold">{item.name}</span>
                        <p className="text-gray-400 text-sm">Current: {item.stock}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={item.stock}
                        className="w-20 px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onBlur={(e) => {
                          const newStock = parseInt(e.target.value) || 0;
                          if (newStock !== item.stock) {
                            updateStock(item.id, newStock);
                          }
                        }}
                      />
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === "Critical" ? "bg-red-500/20 text-red-400" :
                        item.status === "Low" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ...existing cards... */}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default WarehouseDashboard;

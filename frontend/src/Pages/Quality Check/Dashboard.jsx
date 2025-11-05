import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Fragment, useState as useReactState } from "react";

const config = {
  icon: "🔍",
  gradient: "from-green-600 to-teal-700",
  bg: "from-green-900/20 to-teal-900/20",
  features: [
    "Inspection Reports",
    "Test Results", 
    "Compliance Check",
    "Quality Analytics",
  ],
};

const componentCodes = {
  Sleeper: "SLP", Rail: "RAIL", Fishplate: "FPL", Bolt: "BLT", Nut: "NUT",
  "Base Plate": "BPL", Switch: "SWT", Crossing: "CRS", Fastener: "FST", Insulator: "INS",
};

const dummyInspectionItems = [
  { id: 1, name: "Sleeper", code: "SLP", batchId: "SLP-2024-001", manufacturer: "ABC Rail", status: "Pending", priority: "High", receivedDate: "2024-06-05", qcType: "Visual" },
  { id: 2, name: "Rail", code: "RAIL", batchId: "RAIL-2024-002", manufacturer: "RailParts Ltd", status: "Pending", priority: "Critical", receivedDate: "2024-06-04", qcType: "Dimensional" },
  { id: 3, name: "Fishplate", code: "FPL", batchId: "FPL-2024-003", manufacturer: "SteelWorks", status: "In Progress", priority: "Medium", receivedDate: "2024-06-03", qcType: "Material" },
  { id: 4, name: "Bolt", code: "BLT", batchId: "BLT-2024-004", manufacturer: "BoltMakers", status: "Passed", priority: "Low", receivedDate: "2024-06-02", qcType: "Tensile" },
  { id: 5, name: "Switch", code: "SWT", batchId: "SWT-2024-005", manufacturer: "SwitchTech", status: "Failed", priority: "Critical", receivedDate: "2024-06-01", qcType: "Functional" },
];

const qcTests = [
  { name: "Visual Inspection", type: "visual", required: true },
  { name: "Dimensional Check", type: "dimensional", required: true },
  { name: "Material Testing", type: "material", required: false },
  { name: "Tensile Strength", type: "tensile", required: false },
  { name: "Surface Finish", type: "surface", required: true },
  { name: "Documentation Review", type: "documentation", required: true },
];

const QualityDashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [inspectionItems, setInspectionItems] = useReactState(dummyInspectionItems);
  const [showInspection, setShowInspection] = useReactState(false);
  const [selectedItem, setSelectedItem] = useReactState(null);
  const [showTestResults, setShowTestResults] = useReactState(false);
  const [showCompliance, setShowCompliance] = useReactState(false);
  const [testResults, setTestResults] = useReactState({});
  const [inspectionNotes, setInspectionNotes] = useReactState("");
  const [passedItems, setPassedItems] = useReactState([]);
  const [failedItems, setFailedItems] = useReactState([]);

  const handleFeatureClick = (feature, index) => {
    switch(index) {
      case 0: // Inspection Reports
        document.getElementById('inspection-table').scrollIntoView({ behavior: 'smooth' });
        break;
      case 1: // Test Results
        setShowTestResults(true);
        break;
      case 2: // Compliance Check
        setShowCompliance(true);
        break;
      case 3: // Quality Analytics
        generateAnalyticsReport();
        break;
    }
  };

  const startInspection = (item) => {
    setSelectedItem(item);
    setShowInspection(true);
    setTestResults({});
    setInspectionNotes("");
    // Update status to In Progress
    setInspectionItems(items => 
      items.map(i => i.id === item.id ? {...i, status: "In Progress"} : i)
    );
  };

  const completeInspection = (passed) => {
    if (!selectedItem) return;
    
    const updatedItem = {
      ...selectedItem,
      status: passed ? "Passed" : "Failed",
      completedDate: new Date().toISOString().split('T')[0],
      inspector: "Current User",
      notes: inspectionNotes,
      testResults: testResults
    };

    // Update main inspection list
    setInspectionItems(items => 
      items.map(i => i.id === selectedItem.id ? updatedItem : i)
    );

    // Add to appropriate results list
    if (passed) {
      setPassedItems(prev => [...prev, updatedItem]);
    } else {
      setFailedItems(prev => [...prev, updatedItem]);
    }

    setShowInspection(false);
    setSelectedItem(null);
  };

  const generateAnalyticsReport = () => {
    const total = inspectionItems.length;
    const passed = inspectionItems.filter(item => item.status === "Passed").length;
    const failed = inspectionItems.filter(item => item.status === "Failed").length;
    const pending = inspectionItems.filter(item => item.status === "Pending").length;
    const inProgress = inspectionItems.filter(item => item.status === "In Progress").length;
    
    alert(`Quality Analytics Report:
    Total Items: ${total}
    Passed: ${passed} (${((passed/total)*100).toFixed(1)}%)
    Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)
    Pending: ${pending}
    In Progress: ${inProgress}
    Pass Rate: ${((passed/(passed+failed))*100).toFixed(1)}%`);
  };

  useEffect(() => {
    if (auth?.role && auth.role !== "QUALITY_INSPECTOR") {
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-teal-700 flex items-center justify-center text-2xl animate-float relative opacity-80">
              🔍
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-700 rounded-full blur-lg opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
                Quality Check Dashboard
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
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
              Quality Control Center
            </h2>
            <p className="text-blue-300 text-lg mb-6">
              You're logged in as{" "}
              <span className="font-semibold text-white capitalize bg-slate-700/50 px-3 py-1 rounded-full">
                Quality Inspector
              </span>
            </p>
            <div className="flex justify-center gap-4">
              <div className="inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                System Active
              </div>
              <div className="inline-flex items-center px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-sm font-medium">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                {inspectionItems.length} Items in Queue
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
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {index === 0 ? "📋" : index === 1 ? "🧪" : index === 2 ? "✅" : "📊"}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature}</h3>
                <p className="text-gray-400 text-sm">
                  {index === 0 ? "View inspection queue" : 
                   index === 1 ? "Check test results" :
                   index === 2 ? "Compliance validation" :
                   "Quality metrics"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10 animate-in slide-in-from-right duration-700">
          {[
            { label: "Pending", count: inspectionItems.filter(item => item.status === "Pending").length, color: "yellow", icon: "⏳", description: "Awaiting inspection" },
            { label: "In Progress", count: inspectionItems.filter(item => item.status === "In Progress").length, color: "blue", icon: "🔄", description: "Currently testing" },
            { label: "Passed", count: inspectionItems.filter(item => item.status === "Passed").length, color: "green", icon: "✅", description: "Quality approved" },
            { label: "Failed", count: inspectionItems.filter(item => item.status === "Failed").length, color: "red", icon: "❌", description: "Needs rework" }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-700/30 hover:border-gray-600/50 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 text-${stat.color}-400`}>{stat.count}</p>
                  <p className={`text-${stat.color}-400 text-xs mt-1`}>{stat.icon} {stat.description}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-700 rounded-2xl flex items-center justify-center shadow-lg`}>
                  <div className="text-white text-2xl">{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Inspection Queue Table */}
        <div id="inspection-table" className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8 animate-in slide-in-from-left duration-700 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Quality Inspection Queue</h3>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium">
                {inspectionItems.filter(item => item.status === "Pending").length} Pending
              </div>
              <div className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
                {inspectionItems.filter(item => item.status === "In Progress").length} In Progress
              </div>
              <div className="px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm font-medium">
                {inspectionItems.filter(item => item.status === "Passed").length} Passed
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-700/50">
            <table className="min-w-full text-sm text-gray-300">
              <thead>
                <tr className="bg-gray-900/60 border-b border-gray-700/50">
                  <th className="px-6 py-4 text-left font-semibold text-white">Component</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Batch ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Priority</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">QC Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Received</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {inspectionItems.map((item, index) => (
                  <tr key={item.id} className={`border-b border-gray-700/30 hover:bg-gray-700/30 transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/40'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {item.code}
                        </div>
                        <div>
                          <span className="font-semibold text-white">{item.name}</span>
                          <p className="text-gray-400 text-xs">{item.manufacturer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs font-mono">{item.batchId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.priority === "Critical" ? "bg-red-500/20 text-red-400 border border-red-500/50" :
                        item.priority === "High" ? "bg-orange-500/20 text-orange-400 border border-orange-500/50" :
                        item.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" :
                        "bg-green-500/20 text-green-400 border border-green-500/50"
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Failed" ? "bg-red-500/20 text-red-400 border border-red-500/50" :
                        item.status === "Passed" ? "bg-green-500/20 text-green-400 border border-green-500/50" :
                        item.status === "In Progress" ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" :
                        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          item.status === "Failed" ? "bg-red-400" :
                          item.status === "Passed" ? "bg-green-400" :
                          item.status === "In Progress" ? "bg-blue-400" : "bg-yellow-400"
                        }`}></div>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{item.qcType}</td>
                    <td className="px-6 py-4 text-gray-400">{item.receivedDate}</td>
                    <td className="px-6 py-4 text-center">
                      {item.status === "Pending" || item.status === "In Progress" ? (
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 text-xs"
                          onClick={() => startInspection(item)}
                        >
                          🔍 {item.status === "Pending" ? "Start QC" : "Continue"}
                        </button>
                      ) : (
                        <span className={`px-4 py-2 rounded-lg text-xs font-medium ${
                          item.status === "Passed" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}>
                          {item.status === "Passed" ? "✅ Completed" : "❌ Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showInspection && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300">
              <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 transition-all duration-200" onClick={() => setShowInspection(false)}>✕</button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl flex items-center justify-center text-2xl">🔍</div>
                <h4 className="text-2xl font-bold text-white mb-2">Quality Control Inspection</h4>
                <p className="text-gray-300">Component: <span className="font-semibold text-white bg-gray-700/50 px-3 py-1 rounded-full">{selectedItem.name}</span> • Batch: <span className="font-semibold text-white bg-gray-700/50 px-3 py-1 rounded-full">{selectedItem.batchId}</span></p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h5 className="text-lg font-bold text-white mb-4">🧪 Quality Control Tests</h5>
                  <div className="space-y-3">
                    {qcTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${test.required ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                          <span className="text-white font-medium">{test.name}</span>
                          {test.required && <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">Required</span>}
                        </div>
                        <div className="flex space-x-2">
                          <button className={`px-3 py-1 rounded text-xs font-medium transition-all ${testResults[test.type] === 'pass' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-green-500/20'}`} onClick={() => setTestResults(prev => ({...prev, [test.type]: 'pass'}))}>✓ Pass</button>
                          <button className={`px-3 py-1 rounded text-xs font-medium transition-all ${testResults[test.type] === 'fail' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-red-500/20'}`} onClick={() => setTestResults(prev => ({...prev, [test.type]: 'fail'}))}>✗ Fail</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h5 className="text-lg font-bold text-white mb-4">📝 Inspection Notes</h5>
                  <textarea value={inspectionNotes} onChange={(e) => setInspectionNotes(e.target.value)} className="w-full h-40 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter detailed inspection notes, observations, and recommendations..." />
                  
                  <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                    <h6 className="text-white font-medium mb-2">📊 Test Summary</h6>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-green-400">
                        Passed: {Object.values(testResults).filter(r => r === 'pass').length}
                      </div>
                      <div className="text-red-400">
                        Failed: {Object.values(testResults).filter(r => r === 'fail').length}
                      </div>
                      <div className="text-gray-400">
                        Required Tests: {qcTests.filter(t => t.required).length}
                      </div>
                      <div className="text-blue-400">
                        Optional Tests: {qcTests.filter(t => !t.required).length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button onClick={() => completeInspection(true)} className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300" disabled={qcTests.filter(t => t.required).some(t => !testResults[t.type])}>✅ Mark as PASSED</button>
                <button onClick={() => completeInspection(false)} className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300">❌ Mark as FAILED</button>
              </div>
            </div>
          </div>
        )}

        {showTestResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300">
              <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 transition-all duration-200" onClick={() => setShowTestResults(false)}>✕</button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl">🧪</div>
                <h4 className="text-2xl font-bold text-white mb-2">Test Results Overview</h4>
                <p className="text-gray-300">Completed quality control test results</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h5 className="text-lg font-bold text-green-400 mb-4">✅ Passed Items ({passedItems.length})</h5>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {passedItems.map((item, index) => (
                      <div key={index} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-green-400 text-xs">{item.batchId}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Completed: {item.completedDate}</p>
                      </div>
                    ))}
                    {passedItems.length === 0 && <p className="text-gray-400 text-center py-4">No passed items yet</p>}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h5 className="text-lg font-bold text-red-400 mb-4">❌ Failed Items ({failedItems.length})</h5>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {failedItems.map((item, index) => (
                      <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-red-400 text-xs">{item.batchId}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Completed: {item.completedDate}</p>
                        {item.notes && <p className="text-gray-300 text-xs mt-2 bg-gray-700/50 p-2 rounded">{item.notes}</p>}
                      </div>
                    ))}
                    {failedItems.length === 0 && <p className="text-gray-400 text-center py-4">No failed items yet</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCompliance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-3xl shadow-2xl relative animate-in zoom-in duration-300">
              <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 transition-all duration-200" onClick={() => setShowCompliance(false)}>✕</button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center text-2xl">✅</div>
                <h4 className="text-2xl font-bold text-white mb-2">Compliance Check</h4>
                <p className="text-gray-300">Quality standards and regulatory compliance status</p>
              </div>

              <div className="grid gap-4">
                {[{
                  standard: "ISO 9001:2015", status: "Compliant", color: "green" },
                  { standard: "Railway Safety Standards", status: "Compliant", color: "green" },
                  { standard: "Material Quality Guidelines", status: "Under Review", color: "yellow" },
                  { standard: "Environmental Standards", status: "Compliant", color: "green" },
                  { standard: "Documentation Requirements", status: "Pending", color: "red" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-white font-medium">{item.standard}</span>
                    <span className={`px-4 py-2 rounded-full text-xs font-medium ${
                      item.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                      item.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                      'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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

export default QualityDashboard;

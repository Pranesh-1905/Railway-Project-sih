import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import QrScanner from "qr-scanner";

const QRScanner = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  // QR Scanner references
  const scanner = useRef(null);
  const videoRef = useRef(null);
  const qrBoxRef = useRef(null);

  // States
  const [qrOn, setQrOn] = useState(true);
  const [scannedResult, setScannedResult] = useState("");
  const [error, setError] = useState("");

  // Success handler
  const onScanSuccess = (result) => {
    console.log("QR Result:", result);
    setScannedResult(result?.data || "");
    setError("");

    const scanned = result?.data?.trim().toUpperCase();

    if (scanned === "SRI KRISHNA") {
      setScannedResult("✅ QR Code Verified");
      navigate("/manufacturer/components/68c14af80a86b8fd155aecf5");
    } else if (scanned === "SRI KIRSHNA") {
      setScannedResult("✅ QR Code Verified");
      navigate("/manufacturer/components/demopiece");
    } else {
      setScannedResult(`❌ Unrecognized QR Code: ${result.data}`);
      setError(`QR Code "${result.data}" is not recognized in the system`);
    }
  };

  // Error handler
  const onScanFail = (err) => {
    console.warn("QR Error:", err);
  };

  useEffect(() => {
    if (!auth?.role || auth.role !== "manufacturing") {
      navigate("/Manufacturer/login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (videoRef.current && !scanner.current) {
      scanner.current = new QrScanner(videoRef.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxRef.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch(() => setQrOn(false));
    }

    return () => {
      scanner.current?.stop();
      scanner.current = null;
    };
  }, []);

  useEffect(() => {
    if (!qrOn) {
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser and reload."
      );
    }
  }, [qrOn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">QR Code Scanner</h1>
        <button
          onClick={() => navigate("/Manufacturer/dashboard")}
          className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
        >
          ← Back
        </button>
      </div>

      {/* Scanner */}
      <div className="relative w-[430px] h-[430px] max-w-full border-4 border-green-400 rounded-xl overflow-hidden shadow-xl">
        <video ref={videoRef} className="w-full h-full object-cover" />
        <div
          ref={qrBoxRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Custom scanning frame */}
          <div className="relative w-64 h-64 border-2 border-green-400 rounded-lg">
            {/* Corner highlights */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
          </div>
        </div>
      </div>

      {/* Results */}
      {scannedResult && (
        <div className="mt-6 w-full max-w-lg">
          <div
            className={`p-4 rounded-lg text-center ${
              scannedResult.includes("✅")
                ? "bg-green-500/20 border border-green-500/50 text-green-200"
                : "bg-red-500/20 border border-red-500/50 text-red-200"
            }`}
          >
            {scannedResult}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Info */}
      <p className="mt-8 text-gray-400 text-center text-sm">
        Point your camera at a QR code. Scanning will start automatically.
      </p>
    </div>
  );
};

export default QRScanner;
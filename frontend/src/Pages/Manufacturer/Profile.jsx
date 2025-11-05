import { useManufacturerAuth } from "../../contexts/ManufacturerAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const ManufacturerProfile = () => {
  const { profile } = useManufacturerAuth();
  const navigate = useNavigate();

  // Fetch manufacturer details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await api.get("manufacturer/profile");
        // Assuming the response contains the updated profile information
        // You might need to update this based on your actual API response
        profile.companyName = resp.data.manufacturer.companyName;
        profile.email = resp.data.manufacturer.email;
        profile.contactNumber = resp.data.manufacturer.contactNumber;
        profile.address = resp.data.manufacturer.address;
        profile.registrationNumber = resp.data.manufacturer.registrationNumber;
        profile.createdAt = resp.data.manufacturer.createdAt;
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    };
    fetchProfile();
  }, [profile]);

  if (!profile) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-400">
          My Profile
        </h1>
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-lg">
          <p className="text-lg">
            <span className="font-semibold text-blue-300">Company Name:</span>{" "}
            {profile.companyName}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-300">Email:</span>{" "}
            {profile.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-300">Contact Number:</span>{" "}
            {profile.contactNumber}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-300">Address:</span>{" "}
            {profile.address}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-300">
              Registration Number:
            </span>{" "}
            {profile.registrationNumber}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-300">Created At:</span>{" "}
            {new Date(profile.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/manufacturer/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerProfile;

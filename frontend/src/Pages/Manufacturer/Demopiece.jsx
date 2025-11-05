import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MetallicLabel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="relative w-[50vw] min-w-[600px] h-[50vh] min-h-[400px] rounded-xl border border-gray-500 bg-[repeating-linear-gradient(45deg,#d1d5db_0px,#d1d5db_2px,#9ca3af_2px,#9ca3af_4px)] p-8 shadow-xl">
        {/* Metallic Shine Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.6),transparent,rgba(0,0,0,0.2))] mix-blend-overlay rounded-xl"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md border border-gray-400 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 px-3 py-2 text-base font-medium text-gray-700 shadow hover:from-gray-200 hover:to-gray-300"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Company Name - Now inside the plate */}
        <div className="absolute right-6 top-6 z-10">
          <div className="text-right">
            <div className="text-2xl font-extrabold tracking-widest text-gray-800 drop-shadow-sm">
              LAKSHMI LIFE
            </div>
            <div className="text-2xl font-extrabold tracking-widest text-gray-800 drop-shadow-sm">
              SCIENCES PVT LTD
            </div>
          </div>
        </div>

        {/* Details Section - Centered and larger */}
        <div className="relative flex flex-col gap-6 justify-center h-full pt-16 pb-8 px-4">
          <div className="flex items-baseline justify-between border-b-2 border-gray-400 pb-2">
            <span className="mr-4 flex-shrink-0 text-lg font-semibold tracking-wide text-gray-700">
              PART NAME:
            </span>
            <span className="flex-grow text-right text-xl font-bold text-gray-900">
              SUCTION PORT RH
            </span>
          </div>
          <div className="flex items-baseline justify-between border-b-2 border-gray-400 pb-2">
            <span className="mr-4 flex-shrink-0 text-lg font-semibold tracking-wide text-gray-700">
              PART NO:
            </span>
            <span className="flex-grow text-right text-xl font-bold text-gray-900">
              4Y2550370
            </span>
          </div>
          <div className="flex items-baseline justify-between border-b-2 border-gray-400 pb-2">
            <span className="mr-4 flex-shrink-0 text-lg font-semibold tracking-wide text-gray-700">
              NO OF CAVITY:
            </span>
            <span className="flex-grow text-right text-xl font-bold text-gray-900">
              01
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="mr-4 flex-shrink-0 text-lg font-semibold tracking-wide text-gray-700">
              PROJECT CODE:
            </span>
            <span className="flex-grow text-right text-xl font-bold text-gray-900">
              50-205663-01
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetallicLabel;
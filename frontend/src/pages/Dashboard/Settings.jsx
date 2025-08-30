import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ml-4">Settings</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6 text-gray-500">
        No settings available.
      </div>
    </div>
  );
}

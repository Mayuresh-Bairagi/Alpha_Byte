import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../context/PatientContext";
import {
  Users,
  UserPlus,
  Calendar,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  UserCircle,
  UserCircle2,
  Loader,
  RefreshCw,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { patients, loading, error, setSelectedPatient, refreshPatients } =
    usePatients();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState("name");
  const [filterDisease, setFilterDisease] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Create a unique ID generator function
  const generateUniqueId = (prefix: string, value: any) => {
    return `${prefix}-${value}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create stable keys for disease options
  const diseaseOptionKeys = useMemo(() => {
    return Array.from(new Set(patients.map((p) => p.disease))).reduce(
      (acc, disease) => {
        acc[disease] = generateUniqueId("disease", disease);
        return acc;
      },
      {} as Record<string, string>
    );
  }, [patients]);

  // Fetch data when dashboard mounts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingRecords(true);
        await refreshPatients();
      } catch (err) {
        console.error("Error loading patient data:", err);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchAllData();
  }, [refreshPatients]); // Add refreshPatients to dependency array

  const handleRefresh = async () => {
    console.log("Manual refresh triggered");
    setRefreshing(true);
    setLoadingRecords(true);
    try {
      await refreshPatients();
    } catch (error) {
      console.error("Error during manual refresh:", error);
    } finally {
      setRefreshing(false);
      setLoadingRecords(false);
    }
  };

  // Get all unique diseases for the filter dropdown
  const uniqueDiseases = Array.from(new Set(patients.map((p) => p.disease)));

  const filteredPatients = patients.filter((patient) => {
    // Filter by search term
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.disease.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by disease if selected
    const matchesDisease =
      filterDisease === "" || patient.disease === filterDisease;

    return matchesSearch && matchesDisease;
  });

  // Sort patients based on sortBy state
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "age":
        return a.age - b.age;
      case "disease":
        return a.disease.localeCompare(b.disease);
      default:
        return 0;
    }
  });

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    navigate("/profile");
  };

  // Get count statistics
  const stats = {
    total: patients.length,
    male: patients.filter((p) => p.gender === "Male").length,
    female: patients.filter((p) => p.gender === "Female").length,
    upcoming: patients.filter(
      (p) => p.nextAppointment && new Date(p.nextAppointment) > new Date()
    ).length,
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="w-full min-h-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <div className="w-full min-h-full bg-slate-50 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-red-600 text-lg font-semibold mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-slate-50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header with Refresh Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-800">
              Patient Dashboard
            </h1>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full hover:bg-gray-200 text-gray-600 ${
                refreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={refreshing}
              title="Refresh data"
            >
              <RefreshCw
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Patient
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-l-lg flex items-center ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-r-lg flex items-center ${
                  viewMode === "cards"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            label="Total Patients"
            value={stats.total}
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={<UserCircle className="h-6 w-6 text-green-600" />}
            label="Male Patients"
            value={stats.male}
            bgColor="bg-green-100"
          />
          <StatCard
            icon={<UserCircle2 className="h-6 w-6 text-purple-600" />}
            label="Female Patients"
            value={stats.female}
            bgColor="bg-purple-100"
          />
          <StatCard
            icon={<Calendar className="h-6 w-6 text-yellow-600" />}
            label="Upcoming Appointments"
            value={stats.upcoming}
            bgColor="bg-yellow-100"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Patients
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or condition..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="age">Age</option>
                <option value="disease">Disease</option>
              </select>
            </div>

            <div className="md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Disease
              </label>
              <select
                value={filterDisease}
                onChange={(e) => setFilterDisease(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option key="all-diseases" value="">
                  All
                </option>
                {uniqueDiseases.map((disease) => (
                  <option
                    key={
                      diseaseOptionKeys[disease] ||
                      generateUniqueId("disease", disease)
                    }
                    value={disease}
                  >
                    {disease}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Show loading indicator for records if needed */}
        {loadingRecords && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative mb-6 flex items-center">
            <Loader className="animate-spin h-5 w-5 mr-3" />
            <span>Loading patient records...</span>
          </div>
        )}

        {/* Patients Table or Cards */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-br from-[#4b84ff] to-[#8265ff] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Age</th>
                  <th className="py-3 px-4 text-left">Gender</th>
                  <th className="py-3 px-4 text-left">Disease</th>
                  <th className="py-3 px-4 text-left">Doctor</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedPatients.length > 0 ? (
                  sortedPatients.map((patient, index) => {
                    // Debug the patient object
                    console.log(`Rendering patient ${index}:`, patient);
                    return (
                      <tr
                        key={`patient-row-${
                          patient.id || index
                        }-${generateUniqueId("tr", index)}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{patient.name}</td>
                        <td className="py-3 px-4">{patient.age}</td>
                        <td className="py-3 px-4">{patient.gender}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              !patient.disease ||
                              patient.disease === "Not Available"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {patient.disease || "Not Available"}
                          </span>
                        </td>
                        <td className="py-3 px-4">{patient.doctor_Assigned}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handlePatientClick(patient)}
                            className="inline-flex items-center border-2 border-blue-500 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr key="no-patients-row">
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      {error ? "Error loading patients" : "No patients found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedPatients.length > 0 ? (
              sortedPatients.map((patient, index) => {
                // Debug the patient object
                console.log(`Rendering patient card ${index}:`, patient);
                return (
                  <div
                    key={`patient-card-${
                      patient.id || index
                    }-${generateUniqueId("card", index)}`}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {patient.name}
                    </h2>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600">
                        <strong>Age:</strong> {patient.age}
                      </p>
                      <p className="text-gray-600">
                        <strong>Gender:</strong> {patient.gender}
                      </p>
                      <div>
                        <strong className="text-gray-600">Disease:</strong>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              !patient.disease ||
                              patient.disease === "Not Available"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {patient.disease || "Not Available"}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        <strong>Doctor:</strong> {patient.doctor_Assigned}
                      </p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => handlePatientClick(patient)}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p
                key="no-patients-card"
                className="text-center text-gray-500 col-span-full"
              >
                {error ? "Error loading patients" : "No patients found"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
}> = ({ icon, label, value, bgColor }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className={`rounded-full ${bgColor} p-3 mr-4`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;

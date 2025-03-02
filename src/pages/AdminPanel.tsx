import React, { useState } from "react";
import { usePatients } from "../context/PatientContext";
import { Patient } from "../types/Patient";
import { Plus, Trash2, Edit, Save, X, AlertCircle, Search } from "lucide-react";

const initialFormState: Omit<Patient, "id"> = {
  name: "",
  age: 0,
  gender: "",
  disease: "",
  symptoms: [],
  medications: [],
  treatment: "",
  contactNumber: "",
  mobile_number: "",
  doctor_Assigned: "",
  lastVisit: "",
  nextAppointment: null,
};

const AdminPanel: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempSymptom, setTempSymptom] = useState("");
  const [tempMedication, setTempMedication] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setTempSymptom("");
    setTempMedication("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updatePatient({ ...formData, id: editingId });
    } else {
      addPatient({ ...formData, id: "" });
    }

    resetForm();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (patient: Patient) => {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      disease: patient.disease,
      symptoms: patient.symptoms,
      medications: patient.medications,
      treatment: patient.treatment,
      contactNumber: patient.contactNumber,
      mobile_number: patient.mobile_number || "",
      doctor_Assigned: patient.doctor_Assigned,
      lastVisit: patient.lastVisit || "",
      nextAppointment: patient.nextAppointment || null,
    });
    setEditingId(patient.id);
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deletePatient(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const addSymptom = () => {
    if (tempSymptom.trim()) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, tempSymptom.trim()],
      });
      setTempSymptom("");
    }
  };

  const removeSymptom = (index: number) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((_, i) => i !== index),
    });
  };

  const addMedication = () => {
    if (tempMedication.trim()) {
      setFormData({
        ...formData,
        medications: [...formData.medications, tempMedication.trim()],
      });
      setTempMedication("");
    }
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.doctor_Assigned.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (patientId: string) => {
    setPatientToDelete(patientId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete);
      setShowDeleteModal(false);
      setPatientToDelete(null);
    }
  };

  return (
    <div className="w-full min-h-full bg-slate-50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
                {editingId ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Patient
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Patient
                  </>
                )}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Remove email field from the form inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Doctor Assigned
                    </label>
                    <input
                      type="text"
                      name="doctor_Assigned"
                      value={formData.doctor_Assigned}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Disease</label>
                    <input
                      type="text"
                      name="disease"
                      value={formData.disease}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Last Visit
                    </label>
                    <input
                      type="date"
                      name="lastVisit"
                      value={formData.lastVisit}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Next Appointment
                    </label>
                    <input
                      type="date"
                      name="nextAppointment"
                      value={formData.nextAppointment || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Symptoms Section */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Symptoms</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={tempSymptom}
                      onChange={(e) => setTempSymptom(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-l"
                      placeholder="Add symptom"
                    />
                    <button
                      type="button"
                      onClick={addSymptom}
                      className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.symptoms.map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeSymptom(index)}
                          className="ml-2 text-blue-800 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medications Section */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Medications
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={tempMedication}
                      onChange={(e) => setTempMedication(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-l"
                      placeholder="Add medication"
                    />
                    <button
                      type="button"
                      onClick={addMedication}
                      className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.medications.map((medication, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {medication}
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="ml-2 text-green-800 hover:text-green-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Treatment Plan
                  </label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                  >
                    {editingId ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Patient
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Patient
                      </>
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 inline-flex items-center ml-2"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Patient List Section */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-600">
                    Patient List
                  </h2>
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name/Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disease
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.gender}, {patient.age} years
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.disease}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.doctor_Assigned}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                            <button
                              onClick={() => handleEdit(patient)}
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(patient.id)}
                              className="text-red-500 hover:text-red-700 inline-flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this patient? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

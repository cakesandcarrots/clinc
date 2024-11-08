import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentManagement = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5001/patients');
      console.log(response.data);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleStatusChange = async (patientId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/patients/${patientId}`, { status: newStatus });
      fetchPatients(); // Refresh the patients list
    } catch (error) {
      console.error('Error updating patient status:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-6">Patient Management</h1>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {patient.appointments.length > 0
                      ? new Date(patient.appointments[0].date).toLocaleDateString()
                      : 'No appointment'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {patient.appointments.length > 0 ? patient.appointments[0].timeSlot : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={patient.status}
                    onChange={(e) => handleStatusChange(patient._id, parseInt(e.target.value))}
                    className="text-sm text-gray-900 border rounded p-1"
                  >
                    <option value={0}>Unverified</option>
                    <option value={1}>Approved</option>
                    <option value={2}>Declined</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentManagement;

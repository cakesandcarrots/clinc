import React, { useState } from 'react';
import PatientManagement from './PatientManagement';
import AppointmentManagement from './AppointmentManagement';
import AvailabilityManagement from './AvailabilityManagement';
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            <div 
              className={`p-2 hover:bg-gray-50 rounded cursor-pointer ${activeTab === 'patients' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patients
              </span>
            </div>
            <div 
              className={`p-2 hover:bg-gray-50 rounded cursor-pointer ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointments
              </span>
            </div>
            <div 
              className={`p-2 hover:bg-gray-50 rounded cursor-pointer ${activeTab === 'availability' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setActiveTab('availability')}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Availability
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'patients' && <PatientManagement />}
        {activeTab === 'appointments' && <AppointmentManagement />}
        {activeTab === 'availability' && <AvailabilityManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;
import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Debugging step

    try {
      await axios.post('http://localhost:5001/register', formData, { withCredentials: true });
      alert('Patient registered successfully');
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        age: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error registering patient');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md my-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Patient Registration</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            type="password" id="password" name="password" required value={formData.password} onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            type="password" id="confirmPassword" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender</label>
          <select
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            id="gender" name="gender" required value={formData.gender} onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">Age</label>
          <input
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            type="number" id="age" name="age" required value={formData.age} onChange={handleChange}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;

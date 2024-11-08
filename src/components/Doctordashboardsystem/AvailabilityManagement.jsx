import { useState, useEffect } from 'react';
import axios from 'axios';

const AvailabilityManagement = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [databaseDates, setDatabaseDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const fetchAvailableDates = async () => {
    try {
      const response = await axios.get('http://localhost:5001/availability');
      const availableDates = response.data.availableDates || [];
      setSelectedDates(availableDates);
      setDatabaseDates(availableDates);
    } catch (error) {
      console.error('Error fetching available dates:', error);
      setSelectedDates([]);
      setDatabaseDates([]);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    const dateString = typeof date === 'string' ? date : formatDate(date);
    setSelectedDates(prevDates => {
      if (prevDates.includes(dateString)) {
        setDatabaseDates(prev => prev.filter(d => d !== dateString));
        return prevDates.filter(d => d !== dateString);
      } else {
        return [...prevDates, dateString];
      }
    });
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5001/availability', { availableDates: selectedDates });
      setDatabaseDates(selectedDates);
      alert('Available days saved successfully!');
    } catch (error) {
      console.error('Error saving available dates:', error);
      alert('Failed to save available days. Please try again.');
      setSelectedDates([...databaseDates]);
    }
  };

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dateFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
    const weeks = [];
    let days = [];

    const currentDateIter = new Date(startDate);
    while (currentDateIter <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(currentDateIter);
        const dateString = formatDate(currentDate);
        const isSelected = selectedDates.includes(dateString);
        const isToday = formatDate(new Date()) === dateString;
        
        days.push(
          <div
            key={dateString}
            className={`
              relative p-2 text-center cursor-pointer transition-all duration-200 ease-in-out
              ${currentDate.getMonth() !== currentMonth.getMonth() ? 'text-gray-300' : 'text-gray-700'}
              ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600 rounded-md shadow-sm' : 'hover:bg-gray-100 hover:rounded-md'}
              ${isToday ? 'border border-blue-400 rounded-md' : ''}
            `}
            onClick={() => handleDateClick(currentDate)}
          >
            <span className={`text-xs ${isSelected ? 'font-semibold' : ''}`}>
              {currentDate.getDate()}
            </span>
          </div>
        );
        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }
      weeks.push(
        <div key={currentDateIter.toISOString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="text-center font-semibold text-gray-600 p-1 text-xs">
              {dateFormat.format(new Date(2021, 0, index + 1))}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {weeks}
        </div>
      </div>
    );
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-black p-4">
            <h2 className="text-xl font-bold text-white">Availability Management</h2>
          </div>

          <div className="p-4">
            {/* Calendar Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h4 className="text-lg font-bold text-gray-800">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {renderCalendar()}
            </div>

            {/* Selected Dates Section */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Selected Dates:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDates.map(date => (
                  <span
                    key={date}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleDateClick(date)}
                  >
                    {new Date(date).toLocaleDateString()}
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-4 text-center">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Save Available Days
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManagement;
"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Replace react-toastify with react-hot-toast

const ISSERVER = typeof window === 'undefined';

const AddStudent = ({ id }) => {
  const [emails, setEmails] = useState(['']);

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    setEmails(updatedEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ISSERVER) {
      try {
        const payload = { studentEmail: emails[0], classId: id }; // Include classroomId in the payload

        const response = await axios.post('http://localhost:5000/classroom/addstudents', payload, {
          headers: {
            'x-auth-token': localStorage.getItem('teacher'),
          },
        });

        toast.success('Students added successfully'); // Use react-hot-toast
        setEmails(['']); // Reset the email fields
      } catch (error) {
        toast.error('Failed to add students'); // Use react-hot-toast
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Add Students</h1>
        {emails.map((email, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`email-${index}`}
              className="block text-gray-700 font-medium mb-2"
            >
              Student Email {index + 1}
            </label>
            <input
              type="email"
              id={`email-${index}`}
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {emails.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmailField(index)}
                className="text-red-500 text-sm mt-1"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addEmailField}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 mb-4"
        >
          Add Another Email
        </button>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Students
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
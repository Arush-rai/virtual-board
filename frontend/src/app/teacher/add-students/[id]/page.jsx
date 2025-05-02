"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
        // Send all emails at once
        const validEmails = emails.filter(email => email.trim() !== '');
        if (validEmails.length === 0) {
          toast.error('Please enter at least one email.');
          return;
        }
        const payload = { studentEmails: validEmails, classId: id };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/classroom/addstudents`, payload, {
          headers: {
            'x-auth-token': localStorage.getItem('teacher'),
          },
        });

        toast.success('Students added successfully');
        setEmails(['']);
      } catch (error) {
        toast.error('Failed to add students');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl border border-purple-200 p-10">
        <div className="flex flex-col items-center mb-8">
          <svg className="w-14 h-14 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg tracking-tight mb-2">
            Add Students
          </h1>
          <p className="text-gray-600 text-center">
            Enter student email addresses to add them to your classroom.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {emails.map((email, index) => (
            <div key={index} className="mb-2">
              <label
                htmlFor={`email-${index}`}
                className="block text-sm font-semibold text-purple-700 mb-1"
              >
                Student Email {index + 1}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id={`email-${index}`}
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  required
                  className="py-3 px-4 block w-full border-2 border-purple-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white shadow"
                  placeholder="student@example.com"
                />
                {emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmailField(index)}
                    className="text-red-500 hover:text-red-700 font-bold px-2"
                    title="Remove"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addEmailField}
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 font-semibold shadow hover:from-pink-200 hover:to-purple-200 transition-colors mb-2"
          >
            + Add Another Email
          </button>
          <button
            type="submit"
            className="w-full py-3 px-4 mt-2 inline-flex justify-center items-center gap-x-2 text-lg font-bold rounded-xl border border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors"
          >
            Add Students
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ISSERVER = typeof window === 'undefined';

const BrowseClassroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = !ISSERVER ? localStorage.getItem('student') : null;

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classroom/getbystudent`, {
      headers: {
        'x-auth-token': token,
      }
    })
      .then(res => {
        setClassrooms(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message || 'Failed to fetch classrooms');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-2 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6 sm:mb-10 drop-shadow-lg">
          🌟 Explore Classrooms 🌟
        </h1>
        {loading && (
          <div className="flex flex-col sm:flex-row justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-purple-500"></div>
            <span className="mt-4 sm:mt-0 sm:ml-4 text-lg sm:text-xl text-purple-700 font-semibold">Loading classrooms...</span>
          </div>
        )}
        {error && (
          <div className="text-center text-base sm:text-lg text-red-600 font-bold">
            Error: {error}
          </div>
        )}
        {!loading && !error && classrooms.length > 0 && (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {classrooms.map((classroom) => (
              <div
                key={classroom._id}
                className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:scale-105 transition-transform duration-200 border-2 border-purple-200 hover:border-pink-300 relative"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:-top-6 sm:-left-6">
                  <span className="inline-block bg-gradient-to-r from-blue-400 to-pink-400 text-white text-xl sm:text-2xl rounded-full p-2 sm:p-3 shadow-lg">
                    🏫
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-purple-700 mb-2 text-center">{classroom.name}</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                    Created by: {classroom.teacher?.name || classroom.teacherName || 'Unknown'}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">{classroom.id}</span>
                  <Link
                    href={`/student/view-classroom/${classroom._id}`}
                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold shadow hover:from-pink-400 hover:to-purple-400 transition-colors text-center"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && classrooms.length === 0 && (
          <div className="text-center text-base sm:text-lg text-gray-500 mt-10">
            No classrooms found. 🚫
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseClassroom;

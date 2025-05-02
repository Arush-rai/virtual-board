'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const BrowseClassroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/classroom/getall`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch classrooms');
        return res.json();
      })
      .then(data => {
        setClassrooms(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-10 drop-shadow-lg">
          🌟 Explore Classrooms 🌟
        </h1>
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
            <span className="ml-4 text-xl text-purple-700 font-semibold">Loading classrooms...</span>
          </div>
        )}
        {error && (
          <div className="text-center text-lg text-red-600 font-bold">
            Error: {error}
          </div>
        )}
        {!loading && !error && classrooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {classrooms.map((classroom) => (
              <div
                key={classroom._id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-200 border-2 border-purple-200 hover:border-pink-300 relative"
              >
                <div className="absolute -top-6 -left-6">
                  <span className="inline-block bg-gradient-to-r from-blue-400 to-pink-400 text-white text-2xl rounded-full p-3 shadow-lg">
                    🏫
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-purple-700 mb-2">{classroom.name}</h2>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created by: {classroom.teacher?.name || classroom.teacherName || 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-400"> {classroom.id}</span>
                  <Link
                    href={`/student/view-classroom/${classroom._id}`}
                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-400 hover:to-purple-400 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && classrooms.length === 0 && (
          <div className="text-center text-lg text-gray-500 mt-10">
            No classrooms found. 🚫
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseClassroom;

'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Aside = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('student') : null;

  useEffect(() => {
    if (!token) return;
    
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/classroom/getbystudent`, {
        headers: { 'x-auth-token': token },
      })
      .then((res) => {
        setClassrooms(res.data);
        setLoading(false);
      })
      .catch(() => {
        setClassrooms([]);
        setLoading(false);
      });
  }, [token]);

  return (
    <aside
      className="w-full max-w-xs m-4 rounded-2xl shadow-2xl border border-purple-200 p-6"
      style={{
        background: 'linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)',
        minHeight: '80vh',
        boxShadow: '0 8px 32px 0 rgba(76, 29, 149, 0.15)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 mb-6 text-center drop-shadow-lg">
        My Classrooms
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      ) : (
        <ul className="space-y-3">
          {classrooms.length === 0 && (
            <li className="text-gray-500 text-center py-4">
              No classrooms found. Wait for your teacher to add you.
            </li>
          )}
          
          {classrooms.map((classroom) => (
            <li key={classroom._id}>
              <Link
                href={`/student/view-classroom/${classroom._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:from-pink-200 hover:to-purple-200 shadow transition-colors font-semibold text-purple-700"
                style={{
                  border: '1px solid #d1c4e9',
                  background: 'linear-gradient(90deg, #f3e8ff 0%, #fce7f3 100%)',
                }}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-lg font-bold shadow">
                  {classroom.name?.charAt(0)?.toUpperCase() || 'C'}
                </span>
                <div className="flex-1 overflow-hidden">
                  <span className="block truncate font-medium">{classroom.name}</span>
                  <span className="block text-xs text-purple-500 truncate">{classroom.subject}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      {!loading && classrooms.length === 0 && (
        <div className="mt-8 text-center">
          <svg className="mx-auto w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm text-gray-500 mt-2">No classrooms yet</p>
        </div>
      )}
      
      {!loading && classrooms.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Select a classroom to view lectures</p>
        </div>
      )}
    </aside>
  );
};

export default Aside;
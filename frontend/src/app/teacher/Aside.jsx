'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Aside = () => {
  const [classrooms, setClassrooms] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('teacher') : null;

  useEffect(() => {
    if (!token) return;
    axios
      .get('http://localhost:5000/classroom/getbyteacher', {
        headers: { 'x-auth-token': token },
      })
      .then((res) => setClassrooms(res.data))
      .catch(() => setClassrooms([]));
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
      <ul className="space-y-3">
        {classrooms.length === 0 && (
          <li className="text-gray-400 text-center">No classrooms found.</li>
        )}
        {classrooms.map((classroom) => (
          <li key={classroom._id}>
            <Link
              href={`/teacher/manage-lectures/${classroom._id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 hover:from-pink-200 hover:to-purple-200 shadow transition-colors font-semibold text-purple-700"
              style={{
                border: '1px solid #d1c4e9',
                background: 'linear-gradient(90deg, #f3e8ff 0%, #fce7f3 100%)',
              }}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-lg font-bold shadow">
                {classroom.name?.charAt(0)?.toUpperCase() || 'C'}
              </span>
              <span className="truncate">{classroom.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <svg className="mx-auto w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m-4-4v8" />
        </svg>
        <p className="text-xs text-gray-400 mt-2">Select a classroom to manage lectures</p>
      </div>
    </aside>
  );
};

export default Aside;
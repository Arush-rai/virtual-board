'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const StudentNavbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('student');
    document.cookie = 'token=; Max-Age=0; path=/;';
    router.push('/student-login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-pink-400 shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-white text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Virtual Board
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition-colors"
          >
            About
          </Link>
          <Link
            href="/student/browse-classroom"
            className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition-colors"
          >
            Classroom
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-4 py-2 rounded-lg shadow hover:from-purple-500 hover:to-pink-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Virtual Board
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-white font-semibold hover:text-yellow-200 transition-colors">
            About
          </Link>
          <Link href="/student-login" className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors">
            Student Login
          </Link>
          <Link href="/student-signup" className="bg-white text-pink-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-pink-100 transition-colors">
            Student Signup
          </Link>
          <Link href="/teacher-login" className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors">
            Teacher Login
          </Link>
          <Link href="/teacher-signup" className="bg-white text-pink-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-pink-100 transition-colors">
            Teacher Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const TeacherNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('teacher');
    localStorage.removeItem('teacherName');
    document.cookie = 'token=; Max-Age=0; path=/;';
    router.push('/teacher-login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg mb-8 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-white text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Virtual Board
        </span>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors"
          >
            About
          </Link>
          <Link
            href="/teacher/manage-classroom"
            className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors"
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
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/teacher/manage-classroom"
              className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Classroom
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-4 py-2 rounded-lg shadow hover:from-purple-500 hover:to-pink-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TeacherNavbar;
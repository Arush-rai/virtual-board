'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [studentOpen, setStudentOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const studentRef = useRef();
  const teacherRef = useRef();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        studentRef.current &&
        !studentRef.current.contains(event.target) &&
        teacherRef.current &&
        !teacherRef.current.contains(event.target)
      ) {
        setStudentOpen(false);
        setTeacherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Link href="/" className="text-white font-semibold hover:text-yellow-200 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-white font-semibold hover:text-yellow-200 transition-colors">
            About
          </Link>
          {/* Student Dropdown */}
          <div className="relative" ref={studentRef}>
            <button
              className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition-colors"
              onClick={() => {
                setStudentOpen((prev) => !prev);
                setTeacherOpen(false);
              }}
            >
              Student
            </button>
            {studentOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                <Link href="/student-login" className="block px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-t-lg">Login</Link>
                <Link href="/student-signup" className="block px-4 py-2 text-pink-700 hover:bg-pink-50 rounded-b-lg">Signup</Link>
              </div>
            )}
          </div>
          {/* Teacher Dropdown */}
          <div className="relative" ref={teacherRef}>
            <button
              className="bg-white text-pink-600 font-bold px-4 py-2 rounded-lg shadow hover:bg-pink-100 transition-colors"
              onClick={() => {
                setTeacherOpen((prev) => !prev);
                setStudentOpen(false);
              }}
            >
              Teacher
            </button>
            {teacherOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                <Link href="/teacher-login" className="block px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-t-lg">Login</Link>
                <Link href="/teacher-signup" className="block px-4 py-2 text-pink-700 hover:bg-pink-50 rounded-b-lg">Signup</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
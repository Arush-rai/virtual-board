'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [studentOpen, setStudentOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const studentRef = useRef();
  const teacherRef = useRef();
  const mobileMenuRef = useRef(); // Ref for the mobile menu container

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns if click is outside of them
      if (
        studentRef.current &&
        !studentRef.current.contains(event.target) &&
        teacherRef.current &&
        !teacherRef.current.contains(event.target)
      ) {
        setStudentOpen(false);
        setTeacherOpen(false);
      }

      // Close mobile menu if click is outside and menu is open
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.sm:hidden.flex.flex-col') // Don't close if hamburger is clicked
      ) {
        setMenuOpen(false);
        setStudentOpen(false); // Also close dropdowns when mobile menu closes
        setTeacherOpen(false); // Also close dropdowns when mobile menu closes
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]); // Re-run effect when menuOpen changes to update clickOutside logic

  const handleNavClick = () => {
    setMenuOpen(false);
    setStudentOpen(false);
    setTeacherOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white text-2xl font-extrabold tracking-tight" onClick={handleNavClick}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Virtual Board
          </Link>
        </div>
        <button
          className="sm:hidden flex flex-col justify-center items-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : 'mb-1'}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-white font-semibold hover:text-yellow-200 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-white font-semibold hover:text-yellow-200 transition-colors">
            About
          </Link>
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
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 animate-fade-in-down">
                <Link href="/student-login" className="block px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={handleNavClick}>
                  Login
                </Link>
                <Link href="/student-signup" className="block px-4 py-2 text-pink-700 hover:bg-pink-50" onClick={handleNavClick}>
                  Signup
                </Link>
              </div>
            )}
          </div>
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
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 animate-fade-in-down">
                <Link href="/teacher-login" className="block px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={handleNavClick}>
                  Login
                </Link>
                <Link href="/teacher-signup" className="block px-4 py-2 text-pink-700 hover:bg-pink-50" onClick={handleNavClick}>
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`sm:hidden fixed top-0 left-0 w-full h-full bg-gradient-to-b from-purple-600 to-pink-500 transition-transform transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col p-4 pt-20 z-40`} // Added pt-20 to account for fixed navbar height
      >
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-white font-bold px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 transition-colors text-lg text-center"
            onClick={handleNavClick}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white font-bold px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 transition-colors text-lg text-center"
            onClick={handleNavClick}
          >
            About
          </Link>

          {/* Student Dropdown Mobile */}
          <div className="bg-purple-700 rounded-lg shadow">
            <button
              className="w-full text-center px-4 py-3 text-white font-bold hover:bg-purple-800 transition-colors flex justify-between items-center text-lg"
              onClick={() => {
                setStudentOpen(!studentOpen);
                setTeacherOpen(false);
              }}
            >
              <span>Student</span>
              <span>{studentOpen ? '▲' : '▼'}</span>
            </button>
            {studentOpen && (
              <div className="bg-white rounded-b-lg overflow-hidden animate-fade-in-down">
                <Link href="/student-login" className="block px-4 py-2 text-purple-700 hover:bg-purple-50 text-base" onClick={handleNavClick}>
                  Login
                </Link>
                <Link href="/student-signup" className="block px-4 py-2 text-pink-700 hover:bg-pink-50 text-base" onClick={handleNavClick}>
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Teacher Dropdown Mobile */}
          <div className="bg-pink-700 rounded-lg shadow">
            <button
              className="w-full text-center px-4 py-3 text-white font-bold hover:bg-pink-800 transition-colors flex justify-between items-center text-lg"
              onClick={() => {
                setTeacherOpen(!teacherOpen);
                setStudentOpen(false);
              }}
            >
              <span>Teacher</span>
              <span>{teacherOpen ? '▲' : '▼'}</span>
            </button>
            {teacherOpen && (
              <div className="bg-white rounded-b-lg overflow-hidden animate-fade-in-down">
                <Link href="/teacher-login" className="block px-4 py-2 text-purple-700 hover:bg-purple-50 text-base" onClick={handleNavClick}>
                  Login
                </Link>
                <Link href="/teacher-signup" className="block px-4 py-2 text-pink-700 hover:bg-pink-50 text-base" onClick={handleNavClick}>
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
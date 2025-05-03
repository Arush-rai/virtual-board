'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const ViewClassroom = () => {
  const { id } = useParams(); // classroom id
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('student') : null;

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch classroom info
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/classroom/getbyid/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch classroom'))
      .then(data => setClassroom(data))
      .catch(() => setClassroom(null));

    // Fetch lectures for this classroom
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lectures/getbyclassroom/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch lectures');
        return res.json();
      })
      .then(data => {
        setLectures(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
      
    // Fetch announcements
    if (token) {
      setLoadingAnnouncements(true);
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classroom/announcement/${id}`, {
        headers: { 'x-auth-token': token }
      })
        .then(res => {
          setAnnouncements(res.data);
          setLoadingAnnouncements(false);
        })
        .catch(err => {
          console.error('Failed to fetch announcements:', err);
          setAnnouncements([]);
          setLoadingAnnouncements(false);
        });
    }
  }, [id, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Classroom Header */}
        {classroom && (
          <div className="mb-10 bg-white/90 shadow-2xl rounded-3xl p-6 md:p-8 border border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 text-white text-3xl rounded-full p-3 shadow-lg">
                🏫
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg tracking-tight">
                {classroom.name}
              </h1>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold text-purple-700">Subject:</span> {classroom.subject || 'Not specified'}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold text-purple-700">Time slot:</span> {classroom.timeslot || 'Not specified'}
                  </p>
                </div>
                <div>
                  {classroom.teacher && (
                    <p className="text-gray-700 mb-1">
                      <span className="font-semibold text-purple-700">Teacher:</span> {classroom.teacher.name || 'Unknown'}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    <span className="font-semibold">Created:</span> {new Date(classroom.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Announcements Section */}
        <div className="mb-10 bg-white/90 shadow-2xl rounded-3xl p-6 md:p-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-700 flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Announcements
          </h2>
          
          {loadingAnnouncements ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No announcements available for this classroom.
            </div>
          ) : (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div 
                  key={announcement._id}
                  className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-400 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-purple-700 mb-2">{announcement.title}</h3>
                  <p className="text-gray-600 whitespace-pre-line mb-3">{announcement.content}</p>
                  
                  <div className="text-right text-gray-500 text-sm">
                    Posted on {new Date(announcement.createdAt).toLocaleDateString()} at {new Date(announcement.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lectures Section */}
        <div className="bg-white/90 shadow-2xl rounded-3xl p-6 md:p-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-100 pb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Lectures
          </h2>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mb-4"></div>
              <span className="text-lg text-purple-700 font-semibold">Loading lectures...</span>
            </div>
          )}

          {error && (
            <div className="text-center text-lg text-red-600 font-bold py-8">
              Error: {error}
            </div>
          )}

          {!loading && !error && lectures.length === 0 && (
            <div className="text-center text-lg text-gray-500 py-10">
              No lectures found for this classroom.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.map((lecture) => (
              <div
                key={lecture._id}
                className="p-6 border-2 border-purple-200 rounded-2xl shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col hover:shadow-xl transition-shadow duration-200 relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl rounded-full p-2 shadow-lg">
                    🎥
                  </span>
                </div>
                <h3 className="text-xl font-bold text-purple-700 mb-2 mt-4 text-center">Lecture {lecture.lecture_Number}</h3>
                <p className="text-gray-700 mb-1 text-center">Topic: <span className="font-semibold">{lecture.topic}</span></p>
                <p className="text-gray-500 mb-4 text-center">Time: {lecture.timeslot}</p>
                
                {/* Show material count if available */}
                {lecture.material && lecture.material.length > 0 && (
                  <p className="text-sm text-center text-blue-500 mb-4">
                    <span className="font-semibold">{lecture.material.length}</span> learning materials
                  </p>
                )}
                
                <Link
                  href={`/student/view-lecture/${lecture._id}`}
                  className="mt-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition-colors text-center"
                >
                  View Lecture
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClassroom;
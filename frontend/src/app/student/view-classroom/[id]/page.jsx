'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ViewClassroom = () => {
  const { id } = useParams(); // classroom id
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch classroom info
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/classroom/${id}`)
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
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto bg-white/90 shadow-2xl rounded-3xl p-8 border border-purple-200">
        {classroom && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-2">
              <span className="inline-block bg-gradient-to-r from-blue-400 to-pink-400 text-white text-3xl rounded-full p-3 shadow-lg">
                🏫
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg tracking-tight">
                {classroom.name}
              </h1>
            </div>
            <p className="text-gray-700 mb-2 text-lg">{classroom.description}</p>
            <div className="flex flex-wrap gap-4 items-center text-xs text-gray-400">
              <span>Classroom ID: <span className="font-semibold text-purple-500">{classroom._id}</span></span>
              {classroom.teacher?.name && (
                <span>Teacher: <span className="font-semibold text-pink-600">{classroom.teacher.name}</span></span>
              )}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-100 pb-2">Lectures</h2>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {lectures.map((lecture) => (
            <div
              key={lecture._id}
              className="p-6 border-2 border-purple-200 rounded-2xl shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col hover:scale-105 transition-transform duration-200 relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <span className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl rounded-full p-3 shadow-lg">
                  🎥
                </span>
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2 mt-6 text-center">Lecture {lecture.lecture_Number}</h3>
              <p className="text-gray-700 mb-1 text-center">Topic: <span className="font-semibold">{lecture.topic}</span></p>
              <p className="text-gray-500 mb-4 text-center">Time: {lecture.timeslot}</p>
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
  );
};

export default ViewClassroom;
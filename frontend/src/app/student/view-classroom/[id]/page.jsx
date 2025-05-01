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
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {classroom && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-700 mb-2">{classroom.name}</h1>
            <p className="text-gray-600 mb-2">{classroom.description}</p>
            <span className="text-xs text-gray-400">Classroom ID: {classroom._id}</span>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lectures</h2>

        {loading && (
          <div className="text-center text-lg text-gray-600">
            Loading lectures...
          </div>
        )}

        {error && (
          <div className="text-center text-lg text-red-600">
            Error: {error}
          </div>
        )}

        {!loading && !error && lectures.length === 0 && (
          <div className="text-center text-lg text-gray-500">
            No lectures found for this classroom.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <div key={lecture._id} className="p-4 border-2 border-purple-200 rounded-xl shadow bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Lecture {lecture.lecture_Number}</h3>
              <p className="text-gray-700 mb-1">Topic: <strong>{lecture.topic}</strong></p>
              <p className="text-gray-500 mb-2">Time: {lecture.timeslot}</p>
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
'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const ViewLecture = () => {
  const { id } = useParams(); // lecture id
  const [recordings, setRecordings] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch lecture details (including uploaded files/material)
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lectures/getbyid/${id}`)
      .then(res => setLecture(res.data))
      .catch(() => setLecture(null));

    // Fetch recordings for this lecture
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recordings/getbylecture/${id}`)
      .then(res => {
        setRecordings(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Lecture Details Box */}
        {lecture && (
          <div className="mb-10 bg-white/90 shadow-2xl rounded-3xl p-8 border border-purple-200">
            <div className="flex items-center gap-4 mb-2">
              <span className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white text-3xl rounded-full p-3 shadow-lg">
                🎥
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg tracking-tight">
                Lecture {lecture.lecture_Number}
              </h1>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mt-4">
              <p className="text-gray-700 mb-1 text-lg">
                <span className="font-semibold text-purple-700">Topic:</span> {lecture.topic}
              </p>
              <p className="text-gray-500 mb-2">
                <span className="font-semibold text-purple-700">Time:</span> {lecture.timeslot}
              </p>
              {lecture.material && lecture.material.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-purple-700 mb-2">Lecture Materials</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lecture.material.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {file.split('/').pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recordings Section */}
        <div className="bg-white/90 shadow-2xl rounded-3xl p-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-100 pb-2">Recordings</h2>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mb-4"></div>
              <span className="text-lg text-purple-700 font-semibold">Loading...</span>
            </div>
          )}

          {error && (
            <div className="text-center text-lg text-red-600 font-bold py-8">
              Error: {error}
            </div>
          )}

          {!loading && !error && recordings.length === 0 && (
            <div className="text-center text-lg text-gray-500 py-10">
              No recordings found for this lecture.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recordings.map((recording, idx) => (
              <div key={recording._id || idx} className="border-2 border-purple-200 rounded-2xl shadow-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
                <h3 className="text-xl font-semibold text-purple-700 mb-2 text-center">{recording.title || 'Recording'}</h3>   
                <p className="text-gray-500 mb-2 text-center">Date: {recording.createdAt ? new Date(recording.createdAt).toLocaleDateString() : 'N/A'}</p>
                
                {recording.screenUrl && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Screen Recording</h4>
                    <video controls className="w-full rounded-lg shadow-lg">
                      <source src={recording.screenUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

              
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLecture;
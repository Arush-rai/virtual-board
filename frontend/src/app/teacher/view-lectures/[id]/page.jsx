'use client';
import Recorder from '@/components/Recorder';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ViewLectures = () => {
  const { id } = useParams(); // Get the classroom ID from the URL
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false); // State to toggle Recorder
  const fileInputRef = useRef();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recordings/getbylecture/${id}`)
      .then(res => {
        console.log(res.data);
        
        setRecordings(Array.isArray(res.data) ? res.data : [res.data]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Upload handler
  const handleMaterialUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let file of files) {
      formData.append('material', file);
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/recordings/upload-material/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Add auth token if needed
          },
        }
      );
      alert('Material uploaded successfully!');
      // Optionally, refresh lecture/material list here
    } catch (err) {
      alert('Failed to upload material');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Lecture Recordings</h1>

        {/* Upload Material Section */}
        <div className="mb-8 flex flex-col items-center">
          <label className="font-semibold mb-2">Upload Lecture Material (PDF or any file):</label>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="mb-2"
            onChange={handleMaterialUpload}
            accept="*"
          />
          <p className="text-xs text-gray-500">Files will be uploaded to Cloudinary and attached to this lecture.</p>
        </div>

        {loading && (
          <div className="text-center text-lg text-gray-600">
            <p>Loading recordings...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-lg text-red-600">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && recordings.length === 0 && (
          <div className="text-center text-lg text-gray-500">
            No recordings found for this lecture.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recordings.map((recording, idx) => (
            <div key={recording._id || idx} className="border-2 border-purple-200 rounded-xl shadow-md p-6 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">Recording Details</h2>
              <div className="mb-4">
                <p className="text-lg text-gray-700">Title: <strong>{recording.title}</strong></p>
                <p className="text-lg text-gray-700">Duration: <strong>{recording.duration}</strong> minutes</p>
                <p className="text-lg text-gray-700">Recording Date: <strong>{new Date(recording.date || recording.createdAt).toLocaleDateString()}</strong></p>
              </div>
              {/* Screen Recording */}
              {recording.screenUrl && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Screen Recording</h3>
                  <video controls className="w-full rounded-lg shadow-lg">
                    <source src={recording.screenUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {/* Webcam Recording */}
              {recording.webcamUrl && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Webcam Recording</h3>
                  <video controls className="w-full rounded-lg shadow-lg">
                    <source src={recording.webcamUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:from-pink-500 hover:to-purple-500 transition-colors"
            onClick={() => setShowRecorder(!showRecorder)}
          >
            {showRecorder ? 'Close Recorder' : 'Start a New Recording'}
          </button>
          {showRecorder && (
            <div className="mt-6">
              <Recorder lectureId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLectures;

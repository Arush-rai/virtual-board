'use client';
import Recorder from '@/components/Recorder';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ViewLectures = () => {
  const { id } = useParams();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [materials, setMaterials] = useState([]);
  const fileInputRef = useRef();

  const handleDeleteRecording = async (recordingId) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/recordings/delete/${recordingId}`);
      setRecordings(prev => prev.filter(r => r._id !== recordingId));
    } catch (err) {
      alert('Failed to delete recording');
    }
  };

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
          },
        }
      );
      alert('Material uploaded successfully!');
      fetchMaterials();
    } catch (err) {
      alert('Failed to upload material');
    }
  };

  const fetchMaterials = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lectures/getbyid/${id}`)
      .then(res => {
        if (res.data && Array.isArray(res.data.material)) {
          setMaterials(res.data.material);
        }
      })
      .catch(() => setMaterials([]));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recordings/getbylecture/${id}`)
      .then(res => {
        setRecordings(Array.isArray(res.data) ? res.data : [res.data]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    fetchMaterials();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto bg-white/95 shadow-2xl rounded-3xl p-8 border border-purple-200">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 mb-10 drop-shadow-lg tracking-tight">
          <span className="inline-flex items-center gap-2">
            <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Lecture Recordings
          </span>
        </h1>

        {/* Upload Material Section */}
        <div className="mb-10 flex flex-col items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow">
          <label className="font-bold text-lg text-purple-700 mb-2">Upload Lecture Material (PDF or any file):</label>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="mb-2 border border-purple-300 rounded px-3 py-2 bg-white shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleMaterialUpload}
            accept="*"
          />
          <p className="text-xs text-gray-500">Files will be uploaded to Cloudinary and attached to this lecture.</p>
        </div>

        {/* View Uploaded Materials */}
        {materials.length > 0 && (
          <div className="mb-10 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-3">Lecture Materials</h3>
            <ul className="list-disc list-inside space-y-2">
              {materials.map((file, idx) => (
                <li key={idx}>
                  {file.endsWith('.pdf') ? (
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-semibold underline hover:text-purple-700 transition"
                    >
                      📄 View PDF: {file.split('/').pop()}
                    </a>
                  ) : (
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold underline hover:text-purple-700 transition"
                    >
                      ⬇️ Download File: {file.split('/').pop()}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading && (
          <div className="text-center text-lg text-gray-600 py-10">
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Loading recordings...
            </span>
          </div>
        )}

        {error && (
          <div className="text-center text-lg text-red-600 py-10">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && recordings.length === 0 && (
          <div className="text-center text-lg text-gray-500 py-10">
            No recordings found for this lecture.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recordings.map((recording, idx) => (
            <div key={recording._id || idx} className="border-2 border-purple-200 rounded-2xl shadow-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col hover:shadow-2xl transition-shadow">
              <h2 className="text-xl font-bold text-purple-700 mb-2">Recording Details</h2>
              <div className="mb-3">
                <p className="text-base text-gray-700">Title: <span className="font-semibold">{recording.title}</span></p>
                <p className="text-base text-gray-700">Duration: <span className="font-semibold">{recording.duration}</span> minutes</p>
                <p className="text-base text-gray-700">Recording Date: <span className="font-semibold">{new Date(recording.date || recording.createdAt).toLocaleDateString()}</span></p>
              </div>
              {/* Screen Recording */}
              {recording.screenUrl && (
                <div className="mb-3">
                  <h3 className="text-md font-semibold text-purple-800 mb-1">Screen Recording</h3>
                  <video controls className="w-full rounded-lg shadow-md border border-purple-200">
                    <source src={recording.screenUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {/* Webcam Recording */}
             
              {/* Delete Button */}
              <button
                className="mt-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:from-purple-500 hover:to-pink-500 transition-colors"
                onClick={() => handleDeleteRecording(recording._id)}
              >
                Delete Recording
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors text-lg"
            onClick={() => setShowRecorder(!showRecorder)}
          >
            {showRecorder ? 'Close Recorder' : 'Start a New Recording'}
          </button>
          {showRecorder && (
            <div className="mt-8">
              <Recorder lectureId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLectures;

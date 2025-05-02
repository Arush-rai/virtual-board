'use client';
import Recorder from '@/components/Recorder';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';

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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/recordings/delete/${recordingId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('teacher')
        }
      });
      setRecordings(prev => prev.filter(r => r._id !== recordingId));
    } catch (err) {
      alert('Failed to delete recording');
    }
  };

  const handleMaterialUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('material', file);

    try {
      const token = localStorage.getItem('teacher');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/lectures/material/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token
          },
        }
      );
      console.log(response.data);

      // Update materials state with the new URL
      setMaterials(prev => [...prev, response.data.materialUrl]);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert('Material uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload material: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteMaterial = async (materialUrl, index) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      const token = localStorage.getItem('teacher');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/lectures/material/${id}/${index}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      // Update the materials state
      setMaterials(prev => prev.filter((_, idx) => idx !== index));
      alert('Material deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete material');
    }
  };

  const fetchMaterials = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lectures/getbyid/${id}`)
      .then(res => {
        console.log(res.data);
        
        if (res.data && Array.isArray(res.data.material)) {
          setMaterials(res.data.material);
        }
      })
      .catch(() => setMaterials([]));
  };

  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'document';
    } else if (['ppt', 'pptx'].includes(extension)) {
      return 'presentation';
    } else {
      return 'other';
    }
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
            ref={fileInputRef}
            className="mb-2 border border-purple-300 rounded px-3 py-2 bg-white shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleMaterialUpload}
            accept="*"
          />
          <p className="text-xs text-gray-500">Files will be uploaded to Cloudinary and attached to this lecture.</p>
        </div>

        {/* Interactive Whiteboard Section */}
        <div className="mb-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-700 mb-2">Interactive Whiteboard</h2>
              <p className="text-gray-600 mb-4">Use the whiteboard to explain concepts and share your screen with students.</p>
            </div>
            <Link 
              href={`/whiteboard/${id}`} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
              Open Whiteboard
            </Link>
          </div>
        </div>

        {/* View Uploaded Materials */}
        {materials.length > 0 && (
          <div className="mb-10 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-6">Lecture Materials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((file, idx) => {
                const fileType = getFileType(file);
                const fileName = file.split('/').pop();

                return (
                  <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-purple-100 flex flex-col">

                    {/* Preview based on file type */}
                    <div className="h-40 flex items-center justify-center mb-3 bg-gray-50 rounded overflow-hidden">
                      {fileType === 'image' && (
                        <img src={file} alt={fileName} className="max-h-full max-w-full object-contain" />
                      )}

                      {fileType === 'video' && (
                        <video controls className="max-h-full max-w-full">
                          <source src={file} type={`video/${file.split('.').pop().toLowerCase()}`} />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      {fileType === 'pdf' && (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 11.5V14H3v-2.5H7zM7 7v2.5H3V7H7zm0-4.5V5H3V2.5H7zm11 0V5h-7V2.5h7zm0 4.5V10h-7V7h7zm0 4.5V14h-7v-2.5h7zM21 2.5V5h-2.5V2.5H21zm0 4.5V10h-2.5V7H21zm0 4.5V14h-2.5v-2.5H21zm0 4.5V19h-2.5v-3H21zM7 19v-3h11v3H7z" />
                          </svg>
                          <span className="text-sm text-gray-500">PDF Document</span>
                        </div>
                      )}

                      {fileType === 'document' && (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-500 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                          </svg>
                          <span className="text-sm text-gray-500">Document</span>
                        </div>
                      )}

                      {fileType === 'presentation' && (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-orange-500 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 16V3H5v13H2l10 9 10-9h-3zm-7 2v-4h2v4h3l-4 4-4-4h3z" />
                          </svg>
                          <span className="text-sm text-gray-500">Presentation</span>
                        </div>
                      )}

                      {fileType === 'other' && (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                          </svg>
                          <span className="text-sm text-gray-500">File</span>
                        </div>
                      )}
                    </div>

                    {/* File information */}
                    <div className="mt-auto">
                      {file}
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 font-semibold hover:text-purple-800 transition text-sm block truncate mb-2"
                        title={fileName}
                      >
                        {fileName}
                      </a>

                      <div className="flex justify-between items-center">
                        <a
                          href={file}
                          download
                          className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleDeleteMaterial(file, idx)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete material"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const ViewLecture = () => {
  const { id } = useParams(); // lecture id
  const [recordings, setRecordings] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Helper function to organize materials by type
  const categorizeMaterials = (materials = []) => {
    if (!Array.isArray(materials)) return { images: [], documents: [], videos: [] };
    
    return materials.reduce((acc, url) => {
      const extension = url.split('.').pop().toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        // Check if it's likely a whiteboard image
        if (url.includes('whiteboard') || url.includes('lecture_')) {
          acc.whiteboards.push(url);
        } else {
          acc.images.push(url);
        }
      } else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(extension)) {
        acc.documents.push(url);
      } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
        acc.videos.push(url);
      } else {
        acc.other.push(url);
      }
      return acc;
    }, { whiteboards: [], images: [], documents: [], videos: [], other: [] });
  };

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

  // Organize materials by type
  const materials = lecture?.material ? categorizeMaterials(lecture.material) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Lecture Details Box */}
        {lecture && (
          <div className="mb-10 bg-white/90 shadow-2xl rounded-3xl p-6 md:p-8 border border-purple-200">
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
              <p className="text-gray-500 mb-4">
                <span className="font-semibold text-purple-700">Time:</span> {lecture.timeslot}
              </p>
              
              {/* Whiteboards Section */}
              {materials && materials.whiteboards.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    Whiteboard Captures
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.whiteboards.map((url, idx) => (
                      <div key={idx} className="border border-purple-200 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative pb-[56.25%]">
                          <img 
                            src={url} 
                            alt={`Whiteboard ${idx + 1}`} 
                            className="absolute top-0 left-0 w-full h-full object-contain"
                          />
                        </div>
                        <div className="p-3 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                          <span className="text-sm font-medium text-purple-700">Whiteboard {idx + 1}</span>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Other Lecture Materials */}
              {materials && (materials.documents.length > 0 || materials.images.length > 0 || materials.videos.length > 0 || materials.other.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    Lecture Materials
                  </h3>
                  
                  {materials.documents.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Documents</h4>
                      <ul className="space-y-2">
                        {materials.documents.map((url, idx) => {
                          const fileName = url.split('/').pop();
                          const isPdf = url.toLowerCase().endsWith('.pdf');
                          
                          return (
                            <li key={idx} className="flex items-center">
                              {isPdf ? (
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                  <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              )}
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {fileName}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  
                  {materials.images.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Images</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {materials.images.map((url, idx) => (
                          <a 
                            key={idx} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <img src={url} alt={`Image ${idx + 1}`} className="w-full h-32 object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {materials.videos.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Videos</h4>
                      {materials.videos.map((url, idx) => (
                        <div key={idx} className="mb-3">
                          <video controls className="w-full rounded-lg shadow-md">
                            <source src={url} type={`video/${url.split('.').pop().toLowerCase()}`} />
                            Your browser does not support the video tag.
                          </video>
                          <div className="mt-1 text-center text-sm text-gray-500">Video {idx + 1}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {materials.other.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Other Files</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {materials.other.map((url, idx) => (
                          <li key={idx}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {url.split('/').pop()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recordings Section */}
        <div className="bg-white/90 shadow-2xl rounded-3xl p-6 md:p-8 border border-purple-200">
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
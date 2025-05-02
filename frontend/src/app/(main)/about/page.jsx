import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full bg-white/90 rounded-3xl shadow-2xl p-10 border border-purple-200">
        <div className="flex items-center gap-4 mb-6">
          <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg tracking-tight">
            About Virtual Board
          </h1>
        </div>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-bold text-purple-700">Virtual Board</span> is a modern, collaborative platform designed to revolutionize online teaching and learning. Our mission is to empower educators and students with seamless tools for virtual classrooms, interactive lectures, and resource sharing.
        </p>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <span className="font-semibold text-pink-600">Live & Recorded Lectures:</span> Teachers can record, upload, and share lectures with students for anytime access.
            </li>
            <li>
              <span className="font-semibold text-blue-600">Resource Sharing:</span> Upload and distribute PDFs, notes, and other materials with ease.
            </li>
            <li>
              <span className="font-semibold text-purple-600">Secure & Organized:</span> All content is securely stored and organized by classroom and lecture.
            </li>
            <li>
              <span className="font-semibold text-pink-600">User Friendly:</span> Clean, intuitive interface for both teachers and students.
            </li>
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Our Vision</h2>
          <p className="text-gray-700">
            We believe in making education accessible, interactive, and engaging for everyone. Virtual Board bridges the gap between traditional classrooms and the digital future, enabling learning without boundaries.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          <div>
            <span className="text-gray-500 text-sm">Contact us:</span>
            <a
              href="mailto:support@virtualboard.com"
              className="ml-2 text-purple-600 font-semibold underline hover:text-pink-600 transition"
            >
              support@virtualboard.com
            </a>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/yourproject" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600 transition">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
              </svg>
            </a>
            <a href="https://twitter.com/yourproject" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.56c-.89.39-1.84.65-2.84.77a4.93 4.93 0 0 0 2.16-2.72c-.95.56-2 .97-3.13 1.19A4.92 4.92 0 0 0 16.62 3c-2.73 0-4.94 2.21-4.94 4.94 0 .39.04.77.12 1.13C7.69 8.87 4.07 6.92 1.64 3.9c-.43.74-.67 1.6-.67 2.52 0 1.74.89 3.28 2.25 4.18-.83-.03-1.61-.25-2.29-.63v.06c0 2.43 1.73 4.46 4.03 4.92-.42.12-.87.18-1.33.18-.33 0-.64-.03-.95-.09.64 2 2.5 3.45 4.7 3.49A9.87 9.87 0 0 1 0 21.54a13.94 13.94 0 0 0 7.56 2.22c9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63A9.93 9.93 0 0 0 24 4.56z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
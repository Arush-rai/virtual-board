import React from 'react';
import Landingnavbar from '../components/Lamdingnavbar';

const Home = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-0">
      <div className="w-full">
        <Landingnavbar />
      </div>
      <div className="bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-4 sm:p-8 md:p-12 flex flex-col items-center w-full max-w-5xl mx-auto">
        {/* Logo or Hero Image */}
        <img
          src="https://img.freepik.com/free-vector/online-certification-illustration_23-2148573639.jpg"
          alt="Virtual Board Hero"
          className="w-40 h-40 object-contain mb-6 rounded-2xl shadow-lg border border-purple-100"
        />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-4 drop-shadow-lg text-center">
          Welcome to Virtual Board
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
          The all-in-one platform for teachers and students to connect, collaborate, and learn online. Manage classrooms, share resources, and experience interactive lectures with ease.
        </p>
        {/* Features Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow">
            <img src="https://img.icons8.com/color/96/000000/classroom.png" alt="Classroom" className="w-16 h-16 mb-2" />
            <h3 className="font-bold text-purple-700 mb-1">Easy Classroom Management</h3>
            <p className="text-sm text-gray-500 text-center">Create, manage, and join classrooms with a click.</p>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow">
            <img src="https://img.icons8.com/color/96/000000/video-call.png" alt="Lecture" className="w-16 h-16 mb-2" />
            <h3 className="font-bold text-blue-700 mb-1">Interactive Lectures</h3>
            <p className="text-sm text-gray-500 text-center">Attend and record live lectures, share screens, and more.</p>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-6 shadow">
            <img src="https://img.icons8.com/color/96/000000/upload-to-cloud.png" alt="Materials" className="w-16 h-16 mb-2" />
            <h3 className="font-bold text-pink-700 mb-1">Resource Sharing</h3>
            <p className="text-sm text-gray-500 text-center">Upload and access study materials, assignments, and notes.</p>
          </div>
        </div>
        {/* Call to Action */}
        <div className="flex gap-8 mb-8">
          <a
            href="/teacher-signup"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors text-center"
          >
            Teacher
          </a>
          <a
            href="/student-signup"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold shadow-lg hover:from-purple-500 hover:to-blue-500 transition-colors text-center"
          >
            Student
          </a>
        </div>
        {/* Testimonials or Footer */}
        <div className="w-full mt-6">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col items-center bg-white/80 rounded-xl p-4 shadow border border-purple-100">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Teacher" className="w-12 h-12 rounded-full mb-2" />
              <p className="text-sm text-gray-600 italic text-center">"Virtual Board made my online teaching so much easier and more interactive!"</p>
              <span className="text-xs text-purple-700 mt-1 font-semibold">- Mr. Sharma, Teacher</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 rounded-xl p-4 shadow border border-blue-100">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Student" className="w-12 h-12 rounded-full mb-2" />
              <p className="text-sm text-gray-600 italic text-center">"I love how I can access all my lectures and notes in one place!"</p>
              <span className="text-xs text-blue-700 mt-1 font-semibold">- Priya, Student</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="w-full mt-10 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Virtual Board. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home;
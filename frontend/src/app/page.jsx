import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-12 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-8 drop-shadow-lg text-center">
          Welcome to Virtual Board
        </h1>
        <p className="text-lg text-gray-600 mb-10 text-center max-w-md">
          Choose your role to get started.
        </p>
        <div className="flex gap-8">
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
      </div>
    </div>
  );
};

export default Home;
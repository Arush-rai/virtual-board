'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import React from "react";

const ISSERVER = typeof window === 'undefined';

const ManageClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem("teacher") : null;

  useEffect(() => {
    if (!ISSERVER) {
      const fetchClassrooms = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/classroom/getbyteacher`, {
            headers: { "x-auth-token": token }
          });
          setClassrooms(response.data);
        } catch (error) {
          toast.error("Failed to fetch classrooms");
        }
      };
      fetchClassrooms();
    }
  }, []);

  const deleteClassroom = async (id) => {
    if (!ISSERVER) {
      try {
        await axios.delete(`http://localhost:5000/classroom/delete/${id}`, {
          headers: { "x-auth-token": token }
        });
        setClassrooms(classrooms.filter((classroom) => classroom._id !== id));
        toast.success("Classroom deleted successfully");
      } catch (error) {
        toast.error("Failed to delete classroom");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Box with Teacher Initial */}
        <div className="flex items-center gap-4 mb-10 rounded-2xl shadow-lg border border-purple-200 px-6 py-5"
          style={{
            background: "linear-gradient(90deg, #ede9fe 0%, #fce7f3 100%)",
            backdropFilter: "blur(2px)"
          }}
        >
          {/* Teacher Initial Avatar */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl font-extrabold shadow-lg">
              {typeof window !== 'undefined'
                ? (localStorage.getItem('teacherName')?.charAt(0)?.toUpperCase() || 'T')
                : 'T'}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg">
              Classrooms
            </h1>
            <p className="text-gray-600 text-lg font-medium mt-1">
              Manage your classrooms below
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {classrooms.map((classroom) => (
            <div
              key={classroom._id}
              className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-200 border-2 border-purple-200 hover:border-pink-300 relative flex flex-col"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <span className="inline-block bg-gradient-to-r from-blue-400 to-pink-400 text-white text-2xl rounded-full p-3 shadow-lg">
                  🏫
                </span>
              </div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2 mt-6 text-center">{classroom.className || classroom.name}</h2>
              <p className="text-gray-600 text-center mb-1">Subject: <span className="font-semibold">{classroom.subject}</span></p>
              <p className="text-gray-500 text-center mb-4">Time: {classroom.timeslot}</p>
              <div className="flex flex-col gap-2 mt-auto">
                <Link
                  className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-400 hover:to-purple-400 transition-colors text-center"
                  href={`/teacher/manage-lectures/${classroom._id}`}
                >
                  View Lectures
                </Link>
                <button
                  onClick={() => deleteClassroom(classroom._id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-500 hover:to-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {classrooms.length === 0 && (
          <div className="text-center text-lg text-gray-500 mt-10">
            No classrooms found. 🚫
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClassrooms;

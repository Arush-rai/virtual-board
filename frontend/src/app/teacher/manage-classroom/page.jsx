'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const ManageClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const token = localStorage.getItem("teacher");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/classroom/getall", {
          headers: { "x-auth-token": token }
        });
        setClassrooms(response.data);
        console.log(response.data);
        
      } catch (error) {
        toast.error("Failed to fetch classrooms");
      }
    };
    fetchClassrooms();
  }, []);

  const deleteClassroom = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/classroom/delete/${id}`, {
        headers: { "x-auth-token": token }
      });
      setClassrooms(classrooms.filter((classroom) => classroom._id !== id));
      toast.success("Classroom deleted successfully");
    } catch (error) {
      toast.error("Failed to delete classroom");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Classrooms</h1>
      <div className="grid grid-cols-3 gap-4">
        {classrooms.map((classroom) => (
          <div key={classroom._id} className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">{classroom.className}</h2>
            <p className="text-gray-600">Subject: {classroom.subject}</p>
            <p className="text-gray-500">Time: {classroom.timeslot}</p>
          
            <button
              onClick={() => deleteClassroom(classroom._id)}
              className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
            >
              Delete
            </button>
            <Link className="bg-blue-500 text-white px-4 py-2 mt-2 rounded ml-2" href={`/teacher/manage-lectures/${classroom._id}`}>
              View Lectures
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageClassrooms;

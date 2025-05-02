'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import AddStudent from '../../add-students/[id]/page';

const ManageLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const token = localStorage.getItem('teacher');
  const router = useRouter();
  const { id } = useParams();
  const ISSERVER = typeof window === 'undefined';

  // Separated fetchClassroom function
  const fetchClassroom = useCallback(async () => {
    if (!ISSERVER && id) {
      try {
        const res = await axios.get(`http://localhost:5000/classroom/getbyid/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setClassroom(res.data);
      } catch {
        setClassroom(null);
      }
    }
  }, [id, token, ISSERVER]);

  // Fetch classroom details on mount and when id changes
  useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  const lectureForm = useFormik({
    initialValues: {
      lecture_Number: '',
      topic: '',
      timeslot: '',
    },

    onSubmit: (values) => {
      const payload = { ...values, classroom: id };
      if (!ISSERVER) {
        axios.post('http://localhost:5000/lectures/add', payload, {
          headers: {
            'x-auth-token': token
          }
        })
          .then(() => {
            toast.success('Lecture created Successfully');
            setShowForm(false);
            lectureForm.resetForm();
            fetchLectures();
          }).catch(() => {
            toast.error('Something went wrong');
          });
      }
    },
  });

  const fetchLectures = async () => {
    if (!ISSERVER) {
      try {
        const response = await axios.get(`http://localhost:5000/lectures/getbyclassroom/${id}`, {
          headers: { "x-auth-token": token }
        });
        setLectures(response.data);
      } catch (error) {
        toast.error("Failed to fetch lectures");
      }
    }
  };

  useEffect(() => {
    fetchLectures();
    // eslint-disable-next-line
  }, [id]);

  const deletelectures = async (lectureId) => {
    if (!ISSERVER) {
      try {
        await axios.delete(`http://localhost:5000/lectures/delete/${lectureId}`, {
          headers: { "x-auth-token": token }
        });

        setLectures(prev => prev.filter((lecture) => lecture._id !== lectureId));
        toast.success("Lecture deleted successfully");
      } catch (error) {
        toast.error("Failed to delete lecture");
      }
    }
  }

  // Handler to update classroom details after adding students
  const handleStudentAdded = () => {
    fetchClassroom();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Classroom Details */}
        {classroom && (
          <div
            className="mb-8 p-6 rounded-2xl shadow-lg border border-blue-200"
            style={{
              background: "linear-gradient(90deg, #e0e7ff 0%, #f3e8ff 100%)", // Added a nice blue/purple gradient
            }}
          >
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{classroom.name}</h2>
          </div>
        )}
        {/* Header Box for Lectures and Action Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between mb-10 rounded-2xl shadow-lg border border-purple-200 px-8 py-6 gap-4"
          style={{
            background: "linear-gradient(90deg, #ede9fe 0%, #fce7f3 100%)",
            backdropFilter: "blur(2px)"
          }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-4xl font-extrabold shadow-lg">
              📚
            </span>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg">
              Lectures
            </h1>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition-colors"
              onClick={() => setShowAddStudent(!showAddStudent)}
            >
              {showAddStudent ? 'Close Add Student' : 'Add Student'}
            </button>
            <button
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-green-500 transition-colors"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Close Form' : 'Add Lecture'}
            </button>
            {/* Show Students Button moved here */}
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-purple-500 hover:to-blue-500 transition-colors"
              onClick={() => setShowStudents((prev) => !prev)}
            >
              {showStudents ? 'Hide Students' : 'Show Students'}
            </button>
          </div>
        </div>

        {/* Students List Box moved below the header/action box */}
        {showStudents && classroom && (
          <div className="mb-8 p-6 rounded-2xl shadow-lg border border-blue-200 bg-white/80">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Students in this classroom:</h3>
            {classroom.students && classroom.students.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {classroom.students.map((student) => (
                  <li key={student._id} className="text-gray-800">
                    {student.name} <span className="text-gray-500 text-sm">({student.email})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No students added yet.</div>
            )}
          </div>
        )}

        {showAddStudent && (
          <div className="mt-4 mb-8 p-6 bg-purple-50 rounded-xl shadow-lg">
            {/* Pass the handler as a prop to AddStudent */}
            <AddStudent id={id} onStudentAdded={handleStudentAdded} />
          </div>
        )}

        {showForm && (
          <form
            onSubmit={lectureForm.handleSubmit}
            className="flex flex-col space-y-4 p-6 border rounded-2xl shadow-lg bg-white mb-8"
          >
            <label className="font-semibold text-purple-700">Lecture Number</label>
            <input
              id='lecture_Number'
              name='lecture_Number'
              placeholder="Lecture Number"
              value={lectureForm.values.lecture_Number}
              onChange={lectureForm.handleChange}
              required
              className="border-2 border-purple-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white shadow"
            />

            <label className="font-semibold text-purple-700">Topic</label>
            <input
              name="topic"
              placeholder="Topic"
              value={lectureForm.values.topic}
              onChange={lectureForm.handleChange}
              required
              className="border-2 border-purple-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white shadow"
            />

            <label className="font-semibold text-purple-700">Time</label>
            <input
              name="timeslot"
              placeholder="Schedule (e.g., Mon 10AM)"
              value={lectureForm.values.timeslot}
              onChange={lectureForm.handleChange}
              required
              className="border-2 border-purple-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white shadow"
            />

            <button className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow hover:from-purple-500 hover:to-blue-500 transition-colors mt-2' type="submit">
              Create Lecture
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lectures.map((lecture) => (
            <div key={lecture._id} className="p-6 border-2 border-purple-200 rounded-2xl shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col relative hover:scale-105 transition-transform duration-200">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <span className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white text-2xl rounded-full p-3 shadow-lg">
                  🎥
                </span>
              </div>
              <h2 className="text-xl font-bold text-purple-700 mb-2 mt-6 text-center">Lecture {lecture.lecture_Number}</h2>
              <p className="text-gray-600 text-center mb-1">Topic: <span className="font-semibold">{lecture.topic}</span></p>
              <p className="text-gray-500 text-center mb-4">Time: {lecture.timeslot}</p>
              <div className="flex flex-col gap-2 mt-auto">
                <Link
                  className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-purple-500 hover:to-blue-500 transition-colors text-center'
                  href={`/teacher/view-lectures/${lecture._id}`}
                >
                  View Lecture
                </Link>
                <button
                  onClick={() => deletelectures(lecture._id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-500 hover:to-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {lectures.length === 0 && (
          <div className="text-center text-lg text-gray-500 mt-10">
            No lectures found. 🚫
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLectures;

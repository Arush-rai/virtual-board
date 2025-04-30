'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import AddStudent from '../../add-students/[id]/page';

const ManageLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('teacher');
  const router = useRouter();
  const { id } = useParams(); // Get the classroom ID from the URL
  const ISSERVER = typeof window === 'undefined';

  const lectureForm = useFormik({
    initialValues: {
      lecture_Number: '',
      topic: '',
      timeslot: '',
    },

    onSubmit: (values) => {
      const payload = { ...values, classroom: id }; // Include classroomId in the payload
      if (!ISSERVER) {
        axios.post('http://localhost:5000/lectures/add', payload, {
          headers: {
            'x-auth-token': token
          }
        })
          .then((result) => {
            toast.success('Lecture created Successfully');
            setShowForm(false);
            lectureForm.resetForm();
            fetchLectures(); // Refetch lectures after adding....
          }).catch((err) => {
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
        console.log(response.data);
        
        setLectures(response.data);
      } catch (error) {
        toast.error("Failed to fetch lectures");
      }
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [id]); // Adding router.isReady and id as dependencies

  const deletelectures = async (id) => {
    if (!ISSERVER) {
      try {
        await axios.delete(`http://localhost:5000/lectures/delete/${id}`, {
          headers: { "x-auth-token": token }
        });
        
        setLectures(prev => prev.filter((lecture) => lecture._id !== id));
        toast.success("Lecture deleted successfully");
      } catch (error) {
        toast.error("Failed to delete lecture");
      }
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Lectures</h1>

        

        {showForm && (
          <form
            onSubmit={lectureForm.handleSubmit}
            className="flex flex-col space-y-4 p-4 border rounded-lg shadow-md bg-white mb-6"
          >
            <label>Lecture Number</label>
            <input
              id='lecture_Number'
              name='lecture_Number'
              placeholder="Lecture Number"
              value={lectureForm.values.lecture_Number}
              onChange={lectureForm.handleChange}
              required
              className="border rounded px-3 py-2"
            />

            <label>Topic</label>
            <input
              name="topic"
              placeholder="Topic"
              value={lectureForm.values.topic}
              onChange={lectureForm.handleChange}
              required
              className="border rounded px-3 py-2"
            />

            <label>Time</label>
            <input
              name="timeslot"
              placeholder="Schedule (e.g., Mon 10AM)"
              value={lectureForm.values.timeslot}
              onChange={lectureForm.handleChange}
              required
              className="border rounded px-3 py-2"
            />

            <button className='bg-blue-600 text-white px-4 py-2 rounded' type="submit">
              Create Lecture
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lectures.map((lecture) => (
            <div key={lecture._id} className="p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-semibold">{lecture.lecture_Number}</h2>
              <p className="text-gray-600">Subject: {lecture.topic}</p>
              <p className="text-gray-500">Time: {lecture.timeslot}</p>

              <button
                onClick={() => deletelectures(lecture._id)}
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
              >
                Delete
              </button>
              <Link className='bg-blue-500 text-white px-4 py-2 ml-4 rounded' href={`/teacher/view-lectures/${lecture._id}`}>View lecture </Link>
            </div>
          ))}
          <div className="justify-items-center mb-6">
          <button
            className="bg-green-500 text-white text-2xl px-3 py-1 rounded-full hover:bg-green-600"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '-':'+'}
          </button>
        </div>
        </div>
        <AddStudent id={id} /> {/* Pass the classroom ID to AddStudent component */}
      </div>
    </>
  );
};

export default ManageLectures;

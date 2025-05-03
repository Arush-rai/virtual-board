'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AddClassRoom = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('teacher') : null;

  const classroomForm = useFormik({
    initialValues: {
      name: '',
      subject: '',
      timeslot: '',
    },
    onSubmit: (values) => {
      axios.post('http://localhost:5000/classroom/add', values, {
        headers: {
          'x-auth-token': token
        }
      })
        .then(() => {
          toast.success('Class created Successfully');
          router.push('/teacher/manage-classroom');
        }).catch(() => {
          toast.error('Something went wrong');
        });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 px-2 py-12">
      <div className="w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl border border-purple-200 p-0 overflow-hidden">
        {/* Header with icon */}
        <div className="flex flex-col items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8 pb-6 border-b border-purple-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 shadow-lg mb-3">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg tracking-tight mb-1">
            Create Classroom
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Fill in the details below to create a new classroom for your students.
          </p>
        </div>
        {/* Form */}
        <form onSubmit={classroomForm.handleSubmit} className="space-y-7 p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-blue-700 mb-2">
              Class Name
            </label>
            <input
              name="name"
              id="name"
              placeholder="Enter class name"
              value={classroomForm.values.name}
              onChange={classroomForm.handleChange}
              required
              className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white shadow transition"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-blue-700 mb-2">
              Subject
            </label>
            <input
              name="subject"
              id="subject"
              placeholder="Enter subject"
              value={classroomForm.values.subject}
              onChange={classroomForm.handleChange}
              required
              className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white shadow transition"
            />
          </div>
          <div>
            <label htmlFor="timeslot" className="block text-sm font-semibold text-blue-700 mb-2">
              Schedule / Time
            </label>
            <input
              name="timeslot"
              id="timeslot"
              placeholder="e.g., Mon 10AM"
              value={classroomForm.values.timeslot}
              onChange={classroomForm.handleChange}
              required
              className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white shadow transition"
            />
          </div>
          <button
            className="w-full py-3 px-4 mt-2 inline-flex justify-center items-center gap-x-2 text-lg font-bold rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-purple-500 hover:to-blue-500 transition-colors"
            type="submit"
          >
            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Classroom
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClassRoom;
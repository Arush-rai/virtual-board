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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-10">
        <div className="flex flex-col items-center mb-8">
          <svg className="w-14 h-14 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg tracking-tight mb-2">
            Create Classroom
          </h1>
          <p className="text-gray-600 text-center">
            Fill in the details below to create a new classroom for your students.
          </p>
        </div>
        <form onSubmit={classroomForm.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-blue-700 mb-1">
              Class Name
            </label>
            <input
              name="name"
              id="name"
              placeholder="Enter class name"
              value={classroomForm.values.name}
              onChange={classroomForm.handleChange}
              required
              className="py-3 px-4 block w-full border-2 border-blue-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white shadow"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-blue-700 mb-1">
              Subject
            </label>
            <input
              name="subject"
              id="subject"
              placeholder="Enter subject"
              value={classroomForm.values.subject}
              onChange={classroomForm.handleChange}
              required
              className="py-3 px-4 block w-full border-2 border-blue-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white shadow"
            />
          </div>
          <div>
            <label htmlFor="timeslot" className="block text-sm font-semibold text-blue-700 mb-1">
              Schedule / Time
            </label>
            <input
              name="timeslot"
              id="timeslot"
              placeholder="e.g., Mon 10AM"
              value={classroomForm.values.timeslot}
              onChange={classroomForm.handleChange}
              required
              className="py-3 px-4 block w-full border-2 border-blue-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white shadow"
            />
          </div>
          <button
            className="w-full py-3 px-4 mt-2 inline-flex justify-center items-center gap-x-2 text-lg font-bold rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-purple-500 hover:to-blue-500 transition-colors"
            type="submit"
          >
            Create Classroom
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClassRoom;
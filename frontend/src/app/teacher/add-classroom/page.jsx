'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import toast from 'react-hot-toast';


const AddClassRoom = () => {

  const token = localStorage.getItem('teacher');

  const classroomForm = useFormik({
    initialValues: {
      name: '',
      subject: '',
      timeslot: '',
    },

    onSubmit: (values) => {
      console.log(values);
      axios.post('http://localhost:5000/classroom/add', values, {
        headers: {
          'x-auth-token': token
        }
      })
        .then((result) => {
          toast.success('Class created Successfully');
        }).catch((err) => {
          toast.error('Something went wrong');
        });
    },
    // validationSchema: classroomSchema
  });


  return (
    <>

      <div className="flex flex-col justify-center items-center w-screen ">
        <h1 className='text-center pt-28 text-4xl pb-6'  >Create Classroom</h1>
        <form onSubmit={classroomForm.handleSubmit} className="flex flex-col space-y-4 p-4 border rounded-lg shadow-md w-96 mt-0">
          <label htmlFor="">Class name</label>
          <input name="name" placeholder="Class Name" value={classroomForm.values.name} onChange={classroomForm.handleChange} required />
          <label htmlFor="">Subject</label>
          <input name="subject" placeholder="Subject" value={classroomForm.values.subject} onChange={classroomForm.handleChange} required />
          <label htmlFor="">Time</label>
          <input name="timeslot" placeholder="Schedule (e.g., Mon 10AM)" value={classroomForm.values.timeslot} onChange={classroomForm.handleChange} required />
          <button className='bg-blue-600 text-white' type="submit" variant="primary">Create Classroom</button>
        </form>
      </div>
    </>
  );
}
export default AddClassRoom;
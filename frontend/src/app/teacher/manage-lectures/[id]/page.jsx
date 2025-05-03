'use client';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import Link from "next/link";
import { useFormik } from "formik";
import AddStudent from "../../add-students/[id]/page";

const ManageLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [showStudents, setShowStudents] = useState(false);
  const token = localStorage.getItem('teacher');
  const router = useRouter();
  const { id } = useParams();
  const ISSERVER = typeof window === 'undefined';

  // Separated fetchClassroom function
  const fetchClassroom = useCallback(async () => {
    if (!ISSERVER && id) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/classroom/getbyid/${id}`, {
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

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    if (!ISSERVER && id && token) {
      setLoadingAnnouncements(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/classroom/announcement/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setAnnouncements(res.data);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
        toast.error('Failed to load announcements');
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    }
  }, [id, token, ISSERVER]);

  // Fetch announcements on mount and when id changes
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Announcement form handling
  const announcementForm = useFormik({
    initialValues: {
      title: '',
      content: '',
      attachments: []
    },
    onSubmit: async (values, { resetForm }) => {
      if (!ISSERVER && id) {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/classroom/announcement/${id}`, values, {
            headers: { 'x-auth-token': token }
          });
          toast.success('Announcement posted successfully');
          resetForm();
          setShowAnnouncementForm(false);
          fetchAnnouncements();
        } catch (err) {
          console.error('Failed to post announcement:', err);
          toast.error('Failed to post announcement');
        }
      }
    }
  });

  const deleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/classroom/announcement/${id}/${announcementId}`, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      toast.error('Failed to delete announcement');
    }
  };

  const lectureForm = useFormik({
    initialValues: {
      lecture_Number: '',
      topic: '',
      timeslot: '',
    },

    onSubmit: (values) => {
      const payload = { ...values, classroom: id };
      if (!ISSERVER) {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/lectures/add`, payload, {
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/lectures/getbyclassroom/${id}`, {
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
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/lectures/delete/${lectureId}`, {
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

        {/* Announcements Section */}
        <div className="mb-10 p-6 rounded-2xl shadow-lg border border-purple-200 bg-white/80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </h2>
            <button
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition-colors flex items-center"
            >
              {showAnnouncementForm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Announcement
                </>
              )}
            </button>
          </div>

          {/* Add Announcement Form */}
          {showAnnouncementForm && (
            <form 
              onSubmit={announcementForm.handleSubmit}
              className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-md border border-purple-100"
            >
              <h3 className="text-xl font-bold text-purple-700 mb-4">Post New Announcement</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Announcement title"
                  value={announcementForm.values.title}
                  onChange={announcementForm.handleChange}
                  required
                  className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Content</label>
                <textarea
                  name="content"
                  placeholder="Write your announcement here..."
                  value={announcementForm.values.content}
                  onChange={announcementForm.handleChange}
                  required
                  rows={5}
                  className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-pink-600 hover:to-purple-600 transition-colors"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          )}

          {/* Announcements List */}
          {loadingAnnouncements ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No announcements yet. Create one to keep your students informed!
            </div>
          ) : (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div 
                  key={announcement._id}
                  className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-400 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">{announcement.title}</h3>
                    <button
                      onClick={() => deleteAnnouncement(announcement._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete announcement"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-gray-600 whitespace-pre-line mb-3">{announcement.content}</p>
                  
                  <div className="text-right text-gray-500 text-sm">
                    {new Date(announcement.createdAt).toLocaleDateString()} at {new Date(announcement.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

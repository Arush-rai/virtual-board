'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const Teacherlogin = () => {
  const router = useRouter();
  const ISSERVER = typeof window === 'undefined';

  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: (values) => {
      if (!ISSERVER) {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teacher/authenticate`, values)
          .then((res) => {
            toast.success('Login Successful');
            const data = res.data;
            localStorage.setItem('teacher', data.token);
            document.cookie = "token=" + data._id;
            router.push('/teacher/manage-classroom');
          }).catch(() => {
            toast.error('Login Failed');
          });
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 px-4 py-12">
      <div className="max-w-md w-full bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <svg className="w-14 h-14 text-pink-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-500 to-blue-500 drop-shadow-lg tracking-tight">
            Teacher Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account yet?{' '}
            <Link
              className="text-blue-600 decoration-2 hover:underline font-medium"
              href="/teacher-signup"
            >
              Sign up here
            </Link>
          </p>
        </div>
        <button
          type="button"
          className="w-full py-3 px-4 mb-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow hover:bg-gray-50 transition"
        >
          <svg className="w-5 h-5 mr-2" width={20} height={20} viewBox="0 0 46 47" fill="none">
            <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4" />
            <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853" />
            <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05" />
            <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335" />
          </svg>
          Sign in with Google
        </button>
        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
          Or
        </div>
        <form onSubmit={loginForm.handleSubmit} className="space-y-6 mt-2">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-pink-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={loginForm.values.email}
              onChange={loginForm.handleChange}
              className="py-3 px-4 block w-full border-2 border-pink-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white shadow"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-semibold text-pink-700 mb-1">
                Password
              </label>
              <Link
                className="text-sm text-blue-600 decoration-2 hover:underline font-medium"
                href="/recover_password"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={loginForm.values.password}
              onChange={loginForm.handleChange}
              className="py-3 px-4 block w-full border-2 border-pink-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white shadow"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 mt-2 inline-flex justify-center items-center gap-x-2 text-lg font-bold rounded-xl border border-transparent bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Teacherlogin;

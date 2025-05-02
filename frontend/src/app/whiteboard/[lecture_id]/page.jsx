'use client';
import Whiteboard from '@/components/Whiteboard';
import { useParams } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import Link from 'next/link';

const WhiteBoardPage = () => {
  const ISSERVER = typeof window === 'undefined';
  const token = !ISSERVER ? localStorage.getItem('teacher') : null;
  const { lecture_id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <div className="absolute top-3 left-3 z-20">
        <Link 
          href={`/teacher/view-lectures/${lecture_id}`}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition-colors text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Lecture
        </Link>
      </div>
      <Whiteboard lectureId={lecture_id} />
    </div>
  )
}

export default WhiteBoardPage;
'use client';
import Recorder from '@/components/Recorder'
import { useParams } from 'next/navigation';
import React from 'react'

const viewlectures = () => {
  const { id } = useParams(); // Get the classroom ID from the URL

  return (
    <div>
      <Recorder lectureId={id} />

    </div>
  )
}

export default viewlectures

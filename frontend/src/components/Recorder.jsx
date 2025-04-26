'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Recorder = () => {
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoQuality, setVideoQuality] = useState('hd');
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const [savedVideos, setSavedVideos] = useState([]);

  useEffect(() => {
    window.onbeforeunload = function () {
      return 'Do you want to refresh the window?';
    };
  }, []);

  useEffect(() => {
    if (!isRecording) {
      setTimer(0);
    } else {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleScreenShare = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        });
        setStream(stream);
        toast.success('Screen sharing started');
      } catch (err) {
        console.error('Error accessing screen or audio:', err);
        toast.error('Error accessing screen or audio. Please try again.');
      }
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    }
  };

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecorder(mediaRecorder);
      toast.success('Recording started');
    } else {
      toast.error('No stream to record. Please start screen sharing first.');
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
      setRecorder(null);
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleDownload = () => {
    if (recordedBlob) {
      const currentDate = new Date();
      const timestamp = currentDate.toLocaleString().replace(/:/g, '-').replace(/,/g, '');
      const title = `Recording ${timestamp}`;
      const newVideo = { url: recordedBlob, title };

      setSavedVideos((prev) => [...prev, newVideo]);
      setRecordedBlob(null);
      toast.success('Video saved to page');
    }
  };

  const getVideoConstraints = (quality) => {
    const constraints = {
      video: true,
      audio: { noiseSuppression: false, echoCancellation: false },
    };

    if (quality === 'hd') {
      constraints.video = {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      };
    } else if (quality === 'sd') {
      constraints.video = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      };
    } else if (quality === 'ld') {
      constraints.video = {
        width: { ideal: 640 },
        height: { ideal: 480 },
      };
    }

    return constraints;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-12">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">🎥 Screen Recorder</h1>

        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">
            ⏱️ Recording Time: <span className="font-mono font-semibold text-blue-600">{formatTime(timer)}</span>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={toggleScreenShare}
            className={`px-6 py-3 rounded-md font-semibold text-white transition ${
              stream ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {stream ? '🛑 Stop Screen Sharing' : '🟢 Start Screen Sharing'}
          </button>

          <button
            onClick={startRecording}
            disabled={isRecording || !stream}
            className={`px-6 py-3 rounded-md font-semibold transition ${
              isRecording || !stream
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            🎬 Start Recording
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`px-6 py-3 rounded-md font-semibold transition ${
              !isRecording
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            🟥 Stop Recording
          </button>

          <button
            onClick={handleDownload}
            disabled={!recordedBlob}
            className={`px-6 py-3 rounded-md font-semibold transition ${
              !recordedBlob
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            💾 Save to Page
          </button>
        </div>

        {recordedBlob && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">🎞️ Preview</h2>
            <video src={recordedBlob} controls className="w-full rounded-md shadow-md" />
          </div>
        )}
      </div>

      {/* Saved Videos Section */}
      {savedVideos.length > 0 && (
        <div className="w-full max-w-3xl mt-10 bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📁 Saved Videos</h2>
          <div className="space-y-6">
            {savedVideos.map((video, index) => (
              <div key={index} className="border rounded-md p-4 bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{video.title}</h3>
                <video src={video.url} controls className="w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recorder;

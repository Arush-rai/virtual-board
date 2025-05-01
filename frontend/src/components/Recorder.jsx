'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Recorder = ({ lectureId }) => {
  const [screenStream, setScreenStream] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobScreen, setRecordedBlobScreen] = useState(null);
  const [recordedBlobWebcam, setRecordedBlobWebcam] = useState(null);
  const [timer, setTimer] = useState(0);
  const [savedVideos, setSavedVideos] = useState([]);

  useEffect(() => {
    window.onbeforeunload = () => {
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
        const screen = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true, // system audio
        });

        const webcam = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false, // avoid double audio
        });

        setScreenStream(screen);
        setWebcamStream(webcam);

        toast.success('Screen sharing started with webcam preview');
      } catch (err) {
        console.error('Error accessing screen or webcam:', err);
        toast.error('Could not access screen or webcam.');
      }
    } else {
      stopTracks(screenStream);
      stopTracks(webcamStream);
      setScreenStream(null);
      setWebcamStream(null);
    }
  };

  const stopTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startRecording = () => {
    if (screenStream && webcamStream) {
      const screenRecorder = new MediaRecorder(screenStream);
      const webcamRecorder = new MediaRecorder(webcamStream);
      const screenChunks = [];
      const webcamChunks = [];

      screenRecorder.ondataavailable = (e) => {
        screenChunks.push(e.data);
      };

      webcamRecorder.ondataavailable = (e) => {
        webcamChunks.push(e.data);
      };

      screenRecorder.onstop = () => {
        const blob = new Blob(screenChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobScreen(url);
      };

      webcamRecorder.onstop = () => {
        const blob = new Blob(webcamChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobWebcam(url);
      };

      screenRecorder.start();
      webcamRecorder.start();
      setIsRecording(true);
      setRecorder({ screenRecorder, webcamRecorder });
      toast.success('Recording started');
    } else {
      toast.error('Please start screen sharing first.');
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.screenRecorder.stop();
      recorder.webcamRecorder.stop();
      setIsRecording(false);
      setRecorder(null);
    }
    stopTracks(screenStream);
    stopTracks(webcamStream);
    setScreenStream(null);
    setWebcamStream(null);
  };

  const handleDownload = () => {
    if (recordedBlobScreen && recordedBlobWebcam) {
      const timestamp = new Date().toLocaleString().replace(/[:/]/g, '-').replace(/,/g, '');
      const title = `Recording ${timestamp}`;
      setSavedVideos((prev) => [
        ...prev,
        { screenUrl: recordedBlobScreen, webcamUrl: recordedBlobWebcam, title }
      ]);
      setRecordedBlobScreen(null);
      setRecordedBlobWebcam(null);
      toast.success('Videos saved to page');
    }
  };

  const handleUpload = async () => {
    if (!recordedBlobScreen || !recordedBlobWebcam) return;

    const formData = new FormData();
    formData.append('screen', await fetch(recordedBlobScreen).then((r) => r.blob()), 'screen.webm');
    formData.append('webcam', await fetch(recordedBlobWebcam).then((r) => r.blob()), 'webcam.webm');
    formData.append('title', 'Lecture Recording');
    formData.append('duration', timer);
    formData.append('type', 'screen+webcam');
    formData.append('lecture', lectureId);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/recordings/upload`, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('teacher'),
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      toast.success('Uploaded to Cloudinary!');
      setSavedVideos((prev) => [
        ...prev,
        { screenUrl: data.screenUrl, webcamUrl: data.webcamUrl, title: data.title },
      ]);
      setRecordedBlobScreen(null);
      setRecordedBlobWebcam(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-12">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">🎥 Screen + Webcam Recorder</h1>

        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">
            ⏱️ Recording Time:{' '}
            <span className="font-mono font-semibold text-blue-600">{formatTime(timer)}</span>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={toggleScreenShare}
            className={`px-6 py-3 rounded-md font-semibold text-white transition ${screenStream ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {screenStream ? '🛑 Stop Sharing' : '🟢 Start Sharing'}
          </button>

          <button
            onClick={startRecording}
            disabled={isRecording || !screenStream || !webcamStream}
            className={`px-6 py-3 rounded-md font-semibold transition ${isRecording || !screenStream || !webcamStream ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            🎬 Start Recording
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`px-6 py-3 rounded-md font-semibold transition ${!isRecording ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
          >
            🟥 Stop Recording
          </button>

          <button
            onClick={handleDownload}
            disabled={!recordedBlobScreen || !recordedBlobWebcam}
            className={`px-6 py-3 rounded-md font-semibold transition ${!recordedBlobScreen || !recordedBlobWebcam ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
          >
            💾 Save to Page
          </button>

          <button
            onClick={handleUpload}
            disabled={!recordedBlobScreen || !recordedBlobWebcam}
            className={`px-6 py-3 rounded-md font-semibold transition ${!recordedBlobScreen || !recordedBlobWebcam ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            ☁️ Upload to Cloud
          </button>
        </div>

        {recordedBlobScreen && recordedBlobWebcam && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">🎞️ Preview</h2>
            <div className="space-y-4">
              <video src={recordedBlobScreen} controls className="w-full rounded-md shadow-md" />
              <video src={recordedBlobWebcam} controls className="w-full rounded-md shadow-md" />
            </div>
          </div>
        )}
      </div>

      {/* Webcam Preview (only shown live) */}
      {webcamStream && (
        <video
          ref={(video) => {
            if (video) video.srcObject = webcamStream;
          }}
          autoPlay
          muted
          className="fixed bottom-6 right-6 w-40 h-28 border-4 border-white rounded-lg shadow-lg z-50"
        />
      )}

      {/* Saved Videos */}
      {savedVideos.length > 0 && (
        <div className="w-full max-w-3xl mt-10 bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📁 Saved Videos</h2>
          <div className="space-y-6">
            {savedVideos.map((video, index) => (
              <div key={index} className="border rounded-md p-4 bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{video.title}</h3>
                <div className="space-y-4">
                  <video src={video.screenUrl} controls className="w-full rounded-md" />
                  <video src={video.webcamUrl} controls className="w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recorder;

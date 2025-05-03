'use client';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Recorder = ({ lectureId }) => {
  const [combinedStream, setCombinedStream] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedBlobWebcam, setRecordedBlobWebcam] = useState(null);
  const [timer, setTimer] = useState(0);
  const [savedVideos, setSavedVideos] = useState([]);
  const videoPreviewRef = useRef(null);

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
        // Get screen stream with audio
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true, // Get system audio
        });

        // Get microphone audio
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        // Get webcam for picture-in-picture
        const webcam = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false, // No audio from webcam to avoid duplication
        });

        // Create a combined stream with all audio and video tracks
        const combinedTracks = [
          ...screenStream.getVideoTracks(),
          ...screenStream.getAudioTracks(),
          ...micStream.getAudioTracks()
        ];
        
        const combined = new MediaStream(combinedTracks);
        
        setCombinedStream(combined);
        setWebcamStream(webcam);

        // Show the stream in the preview
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = combined;
        }

        toast.success('Screen sharing started with audio and webcam preview');
      } catch (err) {
        console.error('Error accessing screen, audio or webcam:', err);
        toast.error('Could not access screen, audio or webcam.');
      }
    } else {
      stopTracks(combinedStream);
      stopTracks(webcamStream);
      setCombinedStream(null);
      setWebcamStream(null);
    }
  };

  const stopTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startRecording = () => {
    if (combinedStream && webcamStream) {
      // Configure for better quality and compatibility
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 3000000, // 3 Mbps
        audioBitsPerSecond: 128000,  // 128 kbps
      };
      
      try {
        // Main recorder for screen + audio
        const mainRecorder = new MediaRecorder(combinedStream, options);
        // Secondary recorder for webcam
        const webcamRecorder = new MediaRecorder(webcamStream, options);
        
        const mainChunks = [];
        const webcamChunks = [];

        mainRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) mainChunks.push(e.data);
        };

        webcamRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) webcamChunks.push(e.data);
        };

        mainRecorder.onstop = () => {
          const blob = new Blob(mainChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedBlob(url);
        };

        webcamRecorder.onstop = () => {
          const blob = new Blob(webcamChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedBlobWebcam(url);
        };

        // Start recording with a suitable time slice
        mainRecorder.start(1000);  // capture data in 1-second chunks
        webcamRecorder.start(1000);
        
        setIsRecording(true);
        setRecorder({ mainRecorder, webcamRecorder });
        toast.success('Recording started with combined audio');
      } catch (err) {
        console.error('Error starting recorder:', err);
        toast.error('Recording failed to start: ' + (err.message || 'Unknown error'));
      }
    } else {
      toast.error('Please start screen sharing first.');
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.mainRecorder.stop();
      recorder.webcamRecorder.stop();
      setIsRecording(false);
      setRecorder(null);
    }
    stopTracks(combinedStream);
    stopTracks(webcamStream);
    setCombinedStream(null);
    setWebcamStream(null);
  };

  const handleSaveToPage = () => {
    if (recordedBlob && recordedBlobWebcam) {
      const timestamp = new Date().toLocaleString().replace(/[:/]/g, '-').replace(/,/g, '');
      const title = `Recording ${timestamp}`;
      setSavedVideos((prev) => [
        ...prev,
        { mainUrl: recordedBlob, webcamUrl: recordedBlobWebcam, title }
      ]);
      toast.success('Videos saved to page');
    }
  };

  const handleUpload = async () => {
    if (!recordedBlob || !recordedBlobWebcam) {
      toast.error('No recordings available to upload');
      return;
    }
    
    toast.loading('Preparing recordings...');
    
    try {
      // Convert URLs to actual Blobs
      const screenBlob = await fetch(recordedBlob).then(r => r.blob());
      const webcamBlob = await fetch(recordedBlobWebcam).then(r => r.blob());
      
      // Create two separate FormData objects - one for each file
      // First upload the main recording
      const mainFormData = new FormData();
      mainFormData.append('material', screenBlob, `screen_recording_${Date.now()}.webm`);
      
      toast.loading('Uploading screen recording...');
      const mainRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/lectures/material/${lectureId}`,
        mainFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': localStorage.getItem('teacher')
          }
        }
      );
      
      // Then upload the webcam recording
      const webcamFormData = new FormData();
      webcamFormData.append('material', webcamBlob, `webcam_recording_${Date.now()}.webm`);
      
      toast.loading('Uploading webcam recording...');
      const webcamRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/lectures/material/${lectureId}`,
        webcamFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': localStorage.getItem('teacher')
          }
        }
      );
      
      toast.dismiss();
      toast.success('Recordings uploaded successfully!');
      
      // Save metadata about the recordings
      const metadata = {
        title: `Lecture Recording ${new Date().toLocaleDateString()}`,
        screenUrl: mainRes.data.materialUrl,
        webcamUrl: webcamRes.data.materialUrl,
        duration: timer,
        uploadedAt: new Date().toISOString()
      };
      
      // Add to saved videos
      setSavedVideos(prev => [...prev, {
        mainUrl: mainRes.data.materialUrl,
        webcamUrl: webcamRes.data.materialUrl,
        title: metadata.title
      }]);
      
      // Reset recorded blobs
      setRecordedBlob(null);
      setRecordedBlobWebcam(null);
      
    } catch (err) {
      toast.dismiss();
      console.error('Error uploading recordings:', err);
      toast.error(err.response?.data?.error || 'Failed to upload recordings');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col items-center justify-start px-4 py-12">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8 border border-purple-200">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 mb-6">
          🎥 Lecture Recorder
        </h1>

        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">
            ⏱️ Recording Time:{' '}
            <span className="font-mono font-semibold text-purple-600">{formatTime(timer)}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={toggleScreenShare}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition shadow-md ${
              combinedStream 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            }`}
          >
            {combinedStream ? '🛑 Stop Sharing' : '🟢 Share Screen & Audio'}
          </button>

          <button
            onClick={startRecording}
            disabled={isRecording || !combinedStream || !webcamStream}
            className={`px-6 py-3 rounded-lg font-semibold transition shadow-md ${
              isRecording || !combinedStream || !webcamStream 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
            }`}
          >
            🎬 Start Recording
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`px-6 py-3 rounded-lg font-semibold transition shadow-md ${
              !isRecording 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
            }`}
          >
            🟥 Stop Recording
          </button>

          <button
            onClick={handleSaveToPage}
            disabled={!recordedBlob || !recordedBlobWebcam}
            className={`px-6 py-3 rounded-lg font-semibold transition shadow-md ${
              !recordedBlob || !recordedBlobWebcam 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
            }`}
          >
            💾 Save to Page
          </button>

          <button
            onClick={handleUpload}
            disabled={!recordedBlob || !recordedBlobWebcam}
            className={`px-6 py-3 rounded-lg font-semibold transition shadow-md ${
              !recordedBlob || !recordedBlobWebcam 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white'
            }`}
          >
            ☁️ Upload to Cloud
          </button>
        </div>

        {/* Live Preview */}
        {combinedStream && !isRecording && (
          <div className="mt-4 relative">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">📺 Live Preview</h2>
            <video 
              ref={videoPreviewRef}
              autoPlay 
              muted 
              className="w-full rounded-xl shadow-md border border-purple-200"
            />
          </div>
        )}

        {/* Recording Preview */}
        {recordedBlob && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">🎞️ Recording Preview</h2>
            <div className="space-y-4">
              <video src={recordedBlob} controls className="w-full rounded-xl shadow-md" />
              <p className="text-center text-sm text-gray-600">
                👆 Combined screen and audio recording
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Webcam Preview (only shown live) - Picture-in-Picture */}
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
        <div className="w-full max-w-4xl mt-10 bg-white shadow-2xl rounded-2xl p-6 border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
            <span className="mr-2">📁</span>Saved Recordings
          </h2>
          <div className="space-y-6">
            {savedVideos.map((video, index) => (
              <div key={index} className="border rounded-lg p-5 bg-gradient-to-r from-purple-50 to-pink-50 shadow">
                <h3 className="text-lg font-semibold text-purple-700 mb-3">{video.title}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 mb-1">Main Recording</h4>
                    <video src={video.mainUrl} controls className="w-full rounded-md border border-purple-100" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 mb-1">Webcam</h4>
                    <video src={video.webcamUrl} controls className="w-full rounded-md border border-purple-100" />
                  </div>
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

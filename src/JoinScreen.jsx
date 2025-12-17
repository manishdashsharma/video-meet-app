import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalCameraTrack, useLocalMicrophoneTrack, LocalUser } from "agora-rtc-react";

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MicOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
  </svg>
);

const MicOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
  </svg>
);

const CameraOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 7l-7 5 7 5V7z"></path>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const CameraOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>
  </svg>
);

const JoinScreen = () => {
  const navigate = useNavigate();
  const [appId, setAppId] = useState("31abcadd269e48b5a860e67f33ffc9be");
  const [channel, setChannel] = useState("test-channel");
  const [token, setToken] = useState("007eJxTYDh7ImDF1jTdcr3fVwtdE325S3qknW6ktno/E9S/yfqvWVCBwdgwMSk5MSXFyMwy1cQiyTTRwswg1cw8zdg4LS3ZMin16RqnzIZARoZQMS4GRigE8XkYSlKLS3STMxLz8lJzGBgAMAkhrQ==");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const handleJoin = () => {
    if (appId && channel) {
      navigate(`/video-call/channel/${channel}`, {
        state: { appId, channel, token, initialMicOn: micOn, initialCameraOn: cameraOn }
      });
    }
  };

  return (
    <div className="h-screen w-screen flex text-white" style={{ backgroundColor: '#3D3D3D' }}>
      {/* Left Side - Video Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6">
        <div className="w-full max-w-2xl rounded-3xl overflow-hidden" style={{ backgroundColor: '#0A0A0A', aspectRatio: '4/3' }}>
          <div className="w-full h-full flex items-center justify-center">
            {cameraOn ? (
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                playVideo={true}
                playAudio={false}
              />
            ) : (
              <UserIcon />
            )}
          </div>
        </div>

        {/* Test Devices - Centered Below Video */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMicOn(!micOn)}
            className="p-3 rounded-lg transition-all hover:bg-opacity-80"
            style={{ backgroundColor: micOn ? '#142C8E' : '#ED5C5C' }}
          >
            {micOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className="p-3 rounded-lg transition-all hover:bg-opacity-80"
            style={{ backgroundColor: cameraOn ? '#142C8E' : '#ED5C5C' }}
          >
            {cameraOn ? <CameraOnIcon /> : <CameraOffIcon />}
          </button>
        </div>
      </div>

      {/* Right Side - Join Form */}
      <div className="w-150 flex flex-col items-center justify-center p-12" style={{ backgroundColor: '#1C2C56' }}>
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold mb-4">{channel || 'Demo classroom'}</h1>
          <p className="text-lg mb-12" style={{ color: '#E8F1FF' }}>
            Enter the classroom to meet your student
          </p>

          {/* Hidden inputs for development - keep them functional but hidden */}
          <input
            type="hidden"
            onChange={(e) => setAppId(e.target.value)}
            value={appId}
          />
          <input
            type="hidden"
            onChange={(e) => setChannel(e.target.value)}
            value={channel}
          />
          <input
            type="hidden"
            onChange={(e) => setToken(e.target.value)}
            value={token}
          />

          <button
            onClick={handleJoin}
            disabled={!appId || !channel}
            className="w-full py-4 rounded-2xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            style={{ backgroundColor: '#142C8E', color: '#FFFFFF' }}
          >
            Enter classroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;

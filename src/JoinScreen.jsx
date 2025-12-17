import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m8.66-15l-3 5.2M8.34 14.8l-3 5.2M23 12h-6m-6 0H5m15.66 8.66l-3-5.2M8.34 9.2l-3-5.2"></path>
  </svg>
);

const JoinScreen = () => {
  const navigate = useNavigate();
  const [appId, setAppId] = useState("31abcadd269e48b5a860e67f33ffc9be");
  const [channel, setChannel] = useState("test-channel");
  const [token, setToken] = useState("");

  const handleJoin = () => {
    if (appId && channel) {
      navigate(`/video-call/channel/${channel}`, {
        state: { appId, channel, token }
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col relative text-white" style={{ backgroundColor: '#3D3D3D' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1C2C56' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#142C8E' }}>
            <UserIcon />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{channel || 'Classroom'}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 4.5 6 7.5 9 4.5"></polyline>
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
            <InfoIcon />
          </button>
          <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
            <SettingsIcon />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Video Preview Box */}
        <div className="mb-12">
          <div className="w-64 h-48 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
            <UserIcon />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Test the classroom</h1>
          <p className="text-lg" style={{ color: '#D9D9D9' }}>
            Preview your video and audio, or explore your teaching tools
          </p>
        </div>

        {/* Join Form */}
        <div className="flex flex-col gap-4 w-full max-w-md px-4">
          <input
            className="px-4 py-3 rounded-lg text-white placeholder-gray-400 border-2 transition-all focus:outline-none focus:border-opacity-100"
            style={{
              backgroundColor: '#1C2C56',
              borderColor: '#90B8F8',
              borderOpacity: 0.3
            }}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="App ID"
            value={appId}
          />
          <input
            className="px-4 py-3 rounded-lg text-white placeholder-gray-400 border-2 transition-all focus:outline-none focus:border-opacity-100"
            style={{
              backgroundColor: '#1C2C56',
              borderColor: '#90B8F8',
              borderOpacity: 0.3
            }}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Channel Name"
            value={channel}
          />
          <input
            className="px-4 py-3 rounded-lg text-white placeholder-gray-400 border-2 transition-all focus:outline-none focus:border-opacity-100"
            style={{
              backgroundColor: '#1C2C56',
              borderColor: '#90B8F8',
              borderOpacity: 0.3
            }}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token (optional)"
            value={token}
          />
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-center gap-3 px-6 py-5" style={{ backgroundColor: '#0A0A0A' }}>
        <button
          onClick={handleJoin}
          disabled={!appId || !channel}
          className="px-10 py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
          style={{ backgroundColor: '#142C8E' }}
        >
          Join Channel
        </button>
      </div>
    </div>
  );
};

export default JoinScreen;

import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useLocalScreenTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import Whiteboard from "./Whiteboard";

const MicOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const MicOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const CameraOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z"></path>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const CameraOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>
  </svg>
);

const LeaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
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

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);


const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const WhiteboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
    <path d="M2 2l7.586 7.586"></path>
    <circle cx="11" cy="11" r="2"></circle>
  </svg>
);

const VideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { appId, channel, token, initialMicOn = true, initialCameraOn = true } = location.state || {};

  const [micOn, setMic] = useState(initialMicOn);
  const [cameraOn, setCamera] = useState(initialCameraOn);
  const [screenSharing, setScreenSharing] = useState(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [whiteboardData, setWhiteboardData] = useState(null);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const { screenTrack } = useLocalScreenTrack(screenSharing, {}, "disable");

  useJoin({ appid: appId, channel: channel || id, token: token || null }, true);
  usePublish([localMicrophoneTrack, localCameraTrack, screenTrack]);

  const remoteUsers = useRemoteUsers();

  // Detect if any remote user is sharing screen
  // Screen share comes through as a video track from a remote user
  const remoteScreenShare = remoteUsers.find(user => {
    if (!user.videoTrack) return false;
    const track = user.videoTrack;

    // Check various properties that indicate screen share
    // 1. Track ID might contain 'screen'
    if (track._ID && (track._ID.toLowerCase().includes('screen'))) {
      console.log('Screen share detected via _ID:', track._ID);
      return true;
    }

    // 2. Track label might indicate screen share
    if (track.label && track.label.toLowerCase().includes('screen')) {
      console.log('Screen share detected via label:', track.label);
      return true;
    }

    // 3. Check if track type is screen (Agora specific)
    if (track.isScreenTrack || track.getMediaStreamTrack()?.label?.toLowerCase().includes('screen')) {
      console.log('Screen share detected via track type');
      return true;
    }

    return false;
  });

  const handleWhiteboardUpdate = (data) => {
    // Broadcast whiteboard updates to other users
    setWhiteboardData(data);
  };

  const handleScreenShare = () => {
    setScreenSharing((prev) => !prev);
  };

  const getGridClasses = (count) => {
    if (count >= 7) return "grid-cols-3";
    if (count >= 5) return "grid-cols-3";
    if (count >= 3) return "grid-cols-2";
    if (count === 2) return "grid-cols-2";
    if (count === 1) return "grid-cols-1";
    return "grid-cols-1";
  };

  const gridClasses = getGridClasses(remoteUsers.length);

  const handleLeave = () => {
    navigate('/');
  };

  return (
    <div className="h-screen w-screen flex flex-col relative text-white" style={{ backgroundColor: '#3D3D3D' }}>
      <div className={`flex-1 p-4 flex ${(screenSharing && screenTrack) || whiteboardOpen || remoteScreenShare ? 'flex-row' : 'items-center justify-center'} gap-4`}>
        {remoteScreenShare && !screenSharing && !whiteboardOpen ? (
          <>
            {/* Remote User's Screen Share on Left */}
            <div className="flex-1 rounded-xl relative shadow-lg flex items-center justify-center" style={{ backgroundColor: '#1C2C56', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <RemoteUser
                  user={remoteScreenShare}
                  playVideo={true}
                  playAudio={true}
                />
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-sm font-medium z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}>
                {remoteScreenShare.uid}'s screen
              </div>
            </div>

            {/* Videos on Right Side */}
            <div className="flex flex-col gap-4" style={{ width: '320px' }}>
              {/* Local User */}
              <div className="rounded-2xl overflow-hidden shadow-xl border relative" style={{ backgroundColor: '#000000', borderColor: '#3D3D3D', height: '240px' }}>
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
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1C2C56' }}>
                    <UserIcon />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                  You
                </div>
              </div>

              {/* Other Remote Users (excluding the screen share) */}
              {remoteUsers.filter(user => user !== remoteScreenShare).map((user) => (
                <div
                  key={user.uid}
                  className="rounded-2xl overflow-hidden shadow-xl border relative"
                  style={{ backgroundColor: '#1C2C56', borderColor: '#3D3D3D', height: '240px' }}
                >
                  {user.hasVideo ? (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <RemoteUser
                        user={user}
                        playVideo={true}
                        playAudio={true}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    {user.uid}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : whiteboardOpen ? (
          <>
            {/* Whiteboard on Left */}
            <div className="flex-1 rounded-xl relative shadow-lg overflow-hidden" style={{ backgroundColor: '#1C2C56' }}>
              <Whiteboard
                embedded={true}
                onUpdate={handleWhiteboardUpdate}
                remoteData={whiteboardData}
              />
            </div>

            {/* Videos on Right Side */}
            <div className="flex flex-col gap-4" style={{ width: '320px' }}>
              {/* Local User */}
              <div className="rounded-2xl overflow-hidden shadow-xl border relative" style={{ backgroundColor: '#000000', borderColor: '#3D3D3D', height: '240px' }}>
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
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1C2C56' }}>
                    <UserIcon />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                  local
                </div>
              </div>

              {/* Remote Users */}
              {remoteUsers.map((user) => (
                <div
                  key={user.uid}
                  className="rounded-2xl overflow-hidden shadow-xl border relative"
                  style={{ backgroundColor: '#1C2C56', borderColor: '#3D3D3D', height: '240px' }}
                >
                  {user.hasVideo ? (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <RemoteUser
                        user={user}
                        playVideo={true}
                        playAudio={true}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    remote
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : screenSharing && screenTrack ? (
          <>
            {/* Screen Share on Left */}
            <div className="flex-1 rounded-xl relative shadow-lg flex items-center justify-center" style={{ backgroundColor: '#1C2C56', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <video
                  ref={(ref) => {
                    if (ref && screenTrack) {
                      screenTrack.play(ref);
                    }
                  }}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-sm font-medium z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}>
                screen share
              </div>
            </div>

            {/* Videos on Right Side */}
            <div className="flex flex-col gap-4" style={{ width: '320px' }}>
              {/* Local User */}
              <div className="rounded-2xl overflow-hidden shadow-xl border" style={{ backgroundColor: '#000000', borderColor: '#3D3D3D', height: '240px' }}>
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
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1C2C56' }}>
                    <UserIcon />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                  local
                </div>
              </div>

              {/* Remote Users */}
              {remoteUsers.map((user) => (
                <div
                  key={user.uid}
                  className="rounded-2xl overflow-hidden shadow-xl border relative"
                  style={{ backgroundColor: '#1C2C56', borderColor: '#3D3D3D', height: '240px' }}
                >
                  {user.hasVideo ? (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <RemoteUser
                        user={user}
                        playVideo={true}
                        playAudio={true}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    remote
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : remoteUsers.length > 0 ? (
          /* Remote Users Grid (when not screen sharing) */
          <div className={`max-w-4xl w-full h-full grid ${gridClasses} gap-4`}>
            {remoteUsers.map((user) => (
              <div
                key={user.uid}
                className="rounded-xl relative shadow-lg flex items-center justify-center"
                style={{
                  backgroundColor: '#1C2C56',
                  overflow: 'hidden'
                }}
              >
                {user.hasVideo ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <RemoteUser
                      user={user}
                      playVideo={true}
                      playAudio={true}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-sm font-medium z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}>
                  {user.uid}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Waiting State */
          <div className="flex flex-col items-center justify-center h-full">
            <UserIcon />
            <p className="mt-4 text-xl" style={{ color: '#D9D9D9' }}>
              Waiting for other users to join...
            </p>
          </div>
        )}
      </div>

      {/* Local User Overlay - Only show when NOT screen sharing, whiteboard, or viewing remote screen share */}
      {!screenSharing && !whiteboardOpen && !remoteScreenShare && (
        <div className="absolute top-6 right-6 w-64 h-48 rounded-2xl overflow-hidden shadow-2xl z-20 border" style={{ backgroundColor: '#000000', borderColor: '#3D3D3D' }}>
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
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1C2C56' }}>
              <UserIcon />
            </div>
          )}
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            You
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-center gap-4 px-8 py-6" style={{ backgroundColor: '#0A0A0A' }}>
        {/* Mic Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMic((a) => !a)}
            className="p-3 rounded-xl transition-all hover:bg-opacity-80"
            style={{ backgroundColor: micOn ? '#1C2C56' : '#ED5C5C' }}
          >
            {micOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button className="p-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 4.5 6 7.5 9 4.5"></polyline>
            </svg>
          </button>
        </div>

        {/* Camera Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCamera((a) => !a)}
            className="p-3 rounded-xl transition-all hover:bg-opacity-80"
            style={{ backgroundColor: cameraOn ? '#1C2C56' : '#ED5C5C' }}
          >
            {cameraOn ? <CameraOnIcon /> : <CameraOffIcon />}
          </button>
          <button className="p-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 4.5 6 7.5 9 4.5"></polyline>
            </svg>
          </button>
        </div>

        {/* Share Screen */}
        <button
          onClick={handleScreenShare}
          className="p-3 rounded-xl transition-all hover:bg-opacity-80"
          style={{ backgroundColor: screenSharing ? '#00C38A' : '#1C2C56' }}
        >
          <ShareIcon />
        </button>

        {/* Whiteboard */}
        <button
          onClick={() => setWhiteboardOpen(!whiteboardOpen)}
          className="p-3 rounded-xl transition-all hover:bg-opacity-80"
          style={{ backgroundColor: whiteboardOpen ? '#00C38A' : '#1C2C56' }}
        >
          <WhiteboardIcon />
        </button>

        {/* Chat */}
        <button className="p-3 rounded-xl transition-all hover:bg-opacity-80" style={{ backgroundColor: '#1C2C56' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        {/* Leave Button */}
        <button
          onClick={handleLeave}
          className="px-6 py-3 rounded-xl transition-all hover:opacity-90 ml-4 font-semibold"
          style={{ backgroundColor: '#ED5C5C' }}
        >
          <div className="flex items-center gap-2">
            <LeaveIcon />
            <span>Leave</span>
          </div>
        </button>
      </div>
    </div>
  );
};

const VideoCallScreen = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <VideoCall />
    </AgoraRTCProvider>
  );
};

export default VideoCallScreen;

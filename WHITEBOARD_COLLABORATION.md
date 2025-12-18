# Whiteboard Real-Time Collaboration Guide

This document explains how to implement full real-time collaboration for the whiteboard feature using Agora RTM (Real-Time Messaging).

## Current Status

✅ **Working:**
- Whiteboard UI with tldraw
- Layout integration (whiteboard on left, videos on right)
- Local drawing and editing
- Data structure ready for syncing

❌ **Not Yet Implemented:**
- Broadcasting whiteboard updates to other users
- Receiving and applying updates from other users
- Real-time synchronization across different clients

## What is Agora RTM?

Agora RTM (Real-Time Messaging) is a separate SDK from Agora RTC that allows sending text messages and data between users in real-time. While RTC handles video/audio streams, RTM handles data messages.

**Key Differences:**
- **RTC (Real-Time Communication)**: Audio/video streams
- **RTM (Real-Time Messaging)**: Text messages, custom data, signaling

## Implementation Steps

### Step 1: Install Agora RTM SDK

```bash
npm install agora-rtm-sdk
```

### Step 2: Create RTM Client

Create a new file: `src/useRTM.js`

```javascript
import { useState, useEffect, useCallback } from 'react';
import AgoraRTM from 'agora-rtm-sdk';

export const useRTM = (appId, channel, uid) => {
  const [rtmClient, setRtmClient] = useState(null);
  const [rtmChannel, setRtmChannel] = useState(null);
  const [isRTMConnected, setIsRTMConnected] = useState(false);
  const [messageCallback, setMessageCallback] = useState(null);

  // Initialize RTM client
  useEffect(() => {
    if (!appId) return;

    const client = AgoraRTM.createInstance(appId);
    setRtmClient(client);

    return () => {
      if (rtmChannel) {
        rtmChannel.leave();
      }
      if (client) {
        client.logout();
      }
    };
  }, [appId]);

  // Login and join channel
  useEffect(() => {
    if (!rtmClient || !channel || !uid) return;

    const loginAndJoin = async () => {
      try {
        // Login to RTM
        await rtmClient.login({ uid: uid.toString() });
        console.log('RTM logged in');

        // Create and join channel
        const channelInstance = rtmClient.createChannel(channel);
        setRtmChannel(channelInstance);

        // Set up message listener
        channelInstance.on('ChannelMessage', (message, memberId) => {
          console.log('Received RTM message from', memberId, ':', message);
          if (messageCallback) {
            messageCallback(message, memberId);
          }
        });

        await channelInstance.join();
        console.log('RTM channel joined');
        setIsRTMConnected(true);
      } catch (error) {
        console.error('RTM login/join error:', error);
      }
    };

    loginAndJoin();
  }, [rtmClient, channel, uid]);

  // Send message function
  const sendMessage = useCallback(
    async (data) => {
      if (!rtmChannel || !isRTMConnected) {
        console.warn('RTM not connected, cannot send message');
        return;
      }

      try {
        // Convert data to string (RTM only sends strings)
        const messageText = JSON.stringify(data);
        await rtmChannel.sendMessage({ text: messageText });
        console.log('RTM message sent');
      } catch (error) {
        console.error('Failed to send RTM message:', error);
      }
    },
    [rtmChannel, isRTMConnected]
  );

  // Register message callback
  const onMessage = useCallback((callback) => {
    setMessageCallback(() => callback);
  }, []);

  return {
    sendMessage,
    onMessage,
    isRTMConnected,
  };
};
```

### Step 3: Update VideoCallScreen.jsx

Add RTM hook to your VideoCallScreen component:

```javascript
import { useRTM } from './useRTM';

const VideoCall = () => {
  // ... existing code ...

  const [whiteboardData, setWhiteboardData] = useState(null);

  // Add RTM hook
  const { sendMessage, onMessage, isRTMConnected } = useRTM(
    appId,
    channel,
    'whiteboard-' + Date.now() // Generate unique user ID
  );

  // Handle receiving whiteboard updates from other users
  useEffect(() => {
    if (!isRTMConnected) return;

    onMessage((message, memberId) => {
      try {
        const data = JSON.parse(message.text);
        if (data.type === 'whiteboard-update') {
          // Apply the received whiteboard data
          setWhiteboardData(data.snapshot);
        }
      } catch (error) {
        console.error('Failed to parse RTM message:', error);
      }
    });
  }, [isRTMConnected, onMessage]);

  // Handle sending whiteboard updates to other users
  const handleWhiteboardUpdate = useCallback((snapshot) => {
    // Don't send too frequently - debounce updates
    if (isRTMConnected && whiteboardOpen) {
      sendMessage({
        type: 'whiteboard-update',
        snapshot: snapshot,
        timestamp: Date.now(),
      });
    }
  }, [isRTMConnected, whiteboardOpen, sendMessage]);

  // ... rest of the component ...
};
```

### Step 4: Optimize with Debouncing

Whiteboard updates happen very frequently (every brush stroke, every move). To prevent overwhelming the network:

```javascript
import { useCallback, useRef } from 'react';

const VideoCall = () => {
  // ... existing code ...

  const debounceTimerRef = useRef(null);

  const handleWhiteboardUpdate = useCallback((snapshot) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer - only send after 100ms of no changes
    debounceTimerRef.current = setTimeout(() => {
      if (isRTMConnected && whiteboardOpen) {
        sendMessage({
          type: 'whiteboard-update',
          snapshot: snapshot,
          timestamp: Date.now(),
        });
      }
    }, 100); // Wait 100ms before sending
  }, [isRTMConnected, whiteboardOpen, sendMessage]);

  // ... rest of the component ...
};
```

### Step 5: Handle Large Data (Optional)

RTM has a message size limit (32KB per message). If your whiteboard data is large, you may need to:

1. **Compress the data:**
```javascript
import pako from 'pako'; // Install: npm install pako

const compressData = (data) => {
  const json = JSON.stringify(data);
  const compressed = pako.deflate(json);
  return btoa(String.fromCharCode.apply(null, compressed));
};

const decompressData = (compressed) => {
  const binary = atob(compressed);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decompressed = pako.inflate(bytes, { to: 'string' });
  return JSON.parse(decompressed);
};
```

2. **Send only changes (deltas) instead of full snapshots:**
```javascript
// In Whiteboard.jsx
const handleChange = () => {
  // Instead of sending full snapshot
  // const snapshot = editor.store.getSnapshot();

  // Send only the changes
  const changes = editor.store.getChanges();
  if (onSyncUpdate && changes.length > 0) {
    onSyncUpdate({ type: 'delta', changes });
  }
};
```

## Complete Integration Example

Here's how your VideoCallScreen.jsx should look with RTM:

```javascript
import { useRTM } from './useRTM';
import { useCallback, useRef, useEffect } from 'react';

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

  // RTC setup (existing)
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const { screenTrack } = useLocalScreenTrack(screenSharing, {}, "disable");

  useJoin({ appid: appId, channel: channel || id, token: token || null }, true);
  usePublish([localMicrophoneTrack, localCameraTrack, screenTrack]);

  const remoteUsers = useRemoteUsers();

  // RTM setup (NEW)
  const { sendMessage, onMessage, isRTMConnected } = useRTM(
    appId,
    channel,
    'user-' + Date.now()
  );

  const debounceTimerRef = useRef(null);

  // Receive whiteboard updates from other users
  useEffect(() => {
    if (!isRTMConnected) return;

    onMessage((message, memberId) => {
      try {
        const data = JSON.parse(message.text);
        if (data.type === 'whiteboard-update') {
          setWhiteboardData(data.snapshot);
        }
      } catch (error) {
        console.error('Failed to parse RTM message:', error);
      }
    });
  }, [isRTMConnected, onMessage]);

  // Send whiteboard updates to other users (debounced)
  const handleWhiteboardUpdate = useCallback((snapshot) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isRTMConnected && whiteboardOpen) {
        sendMessage({
          type: 'whiteboard-update',
          snapshot: snapshot,
          timestamp: Date.now(),
        });
      }
    }, 100);
  }, [isRTMConnected, whiteboardOpen, sendMessage]);

  // ... rest of your component code ...

  return (
    <div className="h-screen w-screen flex flex-col relative text-white" style={{ backgroundColor: '#3D3D3D' }}>
      {/* ... existing JSX ... */}

      {whiteboardOpen && (
        <div className="flex-1 rounded-xl relative shadow-lg overflow-hidden">
          <Whiteboard
            embedded={true}
            onUpdate={handleWhiteboardUpdate}
            remoteData={whiteboardData}
          />
        </div>
      )}

      {/* ... rest of JSX ... */}
    </div>
  );
};
```

## Testing the Collaboration

1. **Open two browser windows** (or use incognito mode for the second window)
2. **Join the same channel** in both windows
3. **Click the whiteboard button** in one window
4. **Draw something** - you should see the drawing appear in the other window
5. **Both users can draw simultaneously** and see each other's changes

## Troubleshooting

### Issue: Messages not sending
- Check if `isRTMConnected` is true
- Check browser console for RTM errors
- Verify appId is correct
- Make sure both users are in the same channel

### Issue: Messages received but whiteboard not updating
- Check if `remoteData` is being passed to Whiteboard component
- Look for errors in the WhiteboardContent component
- Verify the snapshot structure is valid

### Issue: Too many messages / lag
- Increase debounce time (from 100ms to 300ms or more)
- Send only deltas instead of full snapshots
- Compress large data before sending

## Performance Optimization Tips

1. **Debounce Updates**: Don't send every single change, batch them
2. **Only Send When Whiteboard is Open**: Check `whiteboardOpen` before sending
3. **Send Deltas Instead of Full State**: Only send what changed, not the entire canvas
4. **Compress Large Data**: Use pako or similar library to compress JSON
5. **Throttle Based on User Activity**: If user is idle, reduce sync frequency

## Security Considerations

1. **Validate Message Source**: Always verify the sender before applying changes
2. **Sanitize Data**: Never trust incoming data, validate structure
3. **Rate Limiting**: Prevent spam by limiting message frequency per user
4. **Use RTM Token**: For production, generate RTM tokens (similar to RTC tokens)

## Cost Considerations

- RTM messages are counted separately from RTC usage
- Agora charges based on number of messages and DAU (Daily Active Users)
- Optimize by reducing message frequency and size
- See Agora pricing page for current rates

## Next Steps

1. Implement the `useRTM.js` hook
2. Add RTM initialization to VideoCallScreen
3. Test with two browser windows
4. Add compression if data is large
5. Implement error handling and reconnection logic
6. Add loading indicators while syncing

## Resources

- [Agora RTM SDK Documentation](https://docs.agora.io/en/real-time-messaging/overview/product-overview)
- [Agora RTM API Reference](https://api-ref.agora.io/en/rtm-sdk/web/1.x/index.html)
- [tldraw Collaboration Guide](https://tldraw.dev/docs/collaboration)
- [Agora Pricing](https://www.agora.io/en/pricing/)

---

**Note**: This is a basic implementation. For production use, consider:
- Implementing conflict resolution for simultaneous edits
- Adding user cursors so you can see where others are drawing
- Storing whiteboard state in a database for persistence
- Adding undo/redo synchronization
- Implementing user permissions (who can draw, who can only view)

import { Tldraw, useEditor } from 'tldraw';
import { useEffect, useRef } from 'react';
import 'tldraw/tldraw.css';

const WhiteboardContent = ({ onSyncUpdate, remoteData }) => {
  const editor = useEditor();
  const debounceTimerRef = useRef(null);
  const isApplyingRemoteDataRef = useRef(false);

  // Listen for local changes and broadcast them (with debouncing)
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      // Don't broadcast changes that came from remote data
      if (isApplyingRemoteDataRef.current) return;

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce: wait 150ms after last change before broadcasting
      debounceTimerRef.current = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        if (onSyncUpdate) {
          onSyncUpdate(snapshot);
        }
      }, 150);
    };

    const unsubscribe = editor.store.listen(handleChange);

    return () => {
      unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [editor, onSyncUpdate]);

  // Apply remote data updates
  useEffect(() => {
    if (!editor || !remoteData) return;

    try {
      // Set flag to prevent broadcasting our own remote updates
      isApplyingRemoteDataRef.current = true;

      // Apply the remote snapshot to the local editor
      editor.store.loadSnapshot(remoteData);

      // Reset flag after a short delay
      setTimeout(() => {
        isApplyingRemoteDataRef.current = false;
      }, 100);
    } catch (error) {
      console.error('Failed to apply remote whiteboard data:', error);
      isApplyingRemoteDataRef.current = false;
    }
  }, [editor, remoteData]);

  return null;
};

const Whiteboard = ({ embedded = false, onUpdate, remoteData }) => {
  const handleSyncUpdate = (snapshot) => {
    // Send updates to parent component for broadcasting
    if (onUpdate) {
      onUpdate(snapshot);
    }
  };

  if (embedded) {
    // Embedded mode - just the canvas without header
    return (
      <div className="w-full h-full">
        <Tldraw>
          <WhiteboardContent onSyncUpdate={handleSyncUpdate} remoteData={remoteData} />
        </Tldraw>
      </div>
    );
  }

  // Full-screen mode with header (not used currently)
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#3D3D3D' }}>
      {/* Tldraw Canvas */}
      <div className="flex-1 ">
        <Tldraw>
          <WhiteboardContent onSyncUpdate={handleSyncUpdate} />
        </Tldraw>
      </div>
    </div>
  );
};

export default Whiteboard;

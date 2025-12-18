import { Tldraw, useEditor } from 'tldraw';
import { useEffect } from 'react';
import 'tldraw/tldraw.css';

const WhiteboardContent = ({ onSyncUpdate, remoteData }) => {
  const editor = useEditor();

  // Listen for local changes and broadcast them
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const snapshot = editor.store.getSnapshot();
      if (onSyncUpdate) {
        onSyncUpdate(snapshot);
      }
    };

    const unsubscribe = editor.store.listen(handleChange);

    return () => {
      unsubscribe();
    };
  }, [editor, onSyncUpdate]);

  // Apply remote data updates
  useEffect(() => {
    if (!editor || !remoteData) return;

    try {
      // Apply the remote snapshot to the local editor
      editor.store.loadSnapshot(remoteData);
    } catch (error) {
      console.error('Failed to apply remote whiteboard data:', error);
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

import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinScreen from "./JoinScreen";
import VideoCallScreen from "./VideoCallScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinScreen />} />
        <Route path="/video-call/channel/:id" element={<VideoCallScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
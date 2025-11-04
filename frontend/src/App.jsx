import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import UploadImage from "./pages/upload_image";
import UploadVideo from "./pages/upload_video";
import UploadAudio from "./pages/upload_audio";
import Upload from "./pages/upload";
import NavBar from "./components/Navbar";

const App = () => {
  return (
    <div
      className="w-full h-full overflow-x-hidden bg-[#050505] text-white font-roboto"
      style={{
        overflowY: "overlay", // smoother scroll
        overscrollBehaviorY: "none", // disable scroll bounce
      }}
    >
      {/* ✅ Fixed Navbar */}
      <NavBar />

      {/* ✅ Content area with top padding (navbar height) */}
      <main className="mt-[70px] overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/upload-image" element={<UploadImage />} />
          <Route path="/upload-video" element={<UploadVideo />} />
          <Route path="/upload-audio" element={<UploadAudio />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

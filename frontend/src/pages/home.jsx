import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Camera,
  Mic,
  Github, // Added for footer
  Linkedin, // Added for footer
  Twitter, // Added for footer
} from "lucide-react";

const Home = () => {
  return (
    <div className="text-neutral-200 bg-[#050505] font-roboto overflow-x-hidden selection:bg-cyan-400 selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Navbar />
      </motion.div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-gradient-to-b from-[#050505] via-[#0a1124] to-[#000000]">
        {/* Animated background globs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.1, 0.08, 0.12, 0.07],
            scale: [1, 1.2, 1, 0.9, 1],
            x: [0, -50, 30, 20, 0],
            y: [0, 20, -40, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-cyan-500/30 blur-3xl rounded-full"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.06, 0.1, 0.05, 0.08],
            scale: [1, 1, 1.1, 0.95, 1],
            x: [0, 40, -30, -10, 0],
            y: [0, -30, 50, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 5, // Stagger the animations
          }}
          className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-pink-500/30 blur-3xl rounded-full"
        ></motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            // Pulsing glow effect on the text shadow
            filter: [
              "drop-shadow(0 0 10px rgba(0,191,255,0.4))",
              "drop-shadow(0 0 18px rgba(0,191,255,0.7))",
              "drop-shadow(0 0 10px rgba(0,191,255,0.4))",
            ],
          }}
          transition={{
            duration: 1,
            // Transition for the pulse
            filter: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
          }}
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-500 z-10"
        >
          Multi-Modal Deepfake Detection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-gray-300 max-w-2xl text-lg md:text-xl leading-relaxed z-10 px-4"
        >
          Detect deepfakes in{" "}
          <span className="text-cyan-400 font-semibold">images</span>,{" "}
          <span className="text-blue-400 font-semibold">videos</span>, and{" "}
          <span className="text-pink-400 font-semibold">audio</span> using
          cutting-edge AI technology designed for authenticity verification and
          digital safety.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-10 z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold text-lg shadow-[0_0_25px_rgba(0,191,255,0.4)] hover:shadow-[0_0_35px_rgba(255,0,255,0.4)] transition-all duration-300 ease-in-out"
          >
            <Link to="/upload">Start Detection</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= ABOUT / FEATURES SECTION ================= */}
      <section className="relative py-28 px-6 bg-gradient-to-b from-[#0a1124] via-[#070d1b] to-[#050505] text-center">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400"
          >
            Why Choose Our Detector?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(0,191,255,0.25)",
              }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,191,255,0.1)] transition-all duration-300 ease-in-out"
            >
              <Cpu className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">AI-Powered Engine</h3>
              <p className="text-gray-400">
                Uses deep neural networks trained on vast datasets to ensure
                accurate and reliable deepfake detection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(255,0,255,0.2)",
              }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,191,255,0.1)] transition-all duration-300 ease-in-out"
            >
              <ShieldCheck className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Verified Integrity</h3>
              <p className="text-gray-400">
                Every result is confidence-scored to help users distinguish
                real from manipulated content effortlessly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(0,100,255,0.25)",
              }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,191,255,0.1)] transition-all duration-300 ease-in-out"
            >
              {/* ENHANCEMENT: Using both icons to show multi-modal */}
              <div className="flex justify-center gap-x-4 w-full mb-4">
                <Camera className="w-10 h-10 text-blue-400" />
                <Mic className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                Multi-Modal Detection
              </h3>
              <p className="text-gray-400">
                Detects deepfakes in visual, audio, and video media — ensuring
                total coverage for modern threats.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= UPLOAD SECTION (KEEPING COMMENTS) ================= */}
      <section
        id="services"
        className="py-28 px-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000] relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,191,255,0.08),transparent_60%)] pointer-events-none"></div>

        {/* <h2 className="text-4xl font-bold mb-12 text-center text-gray-100">
          Choose a Detection Type
        </h2> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full"> */}
        {/* Image Detection */}
        {/* <Link
            to="/upload-image"
            className="bg-neutral-900 border border-gray-700 rounded-xl p-10 text-center text-2xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-md"
          >
            🖼️ Predict Image
          </Link> */}

        {/* Video Detection */}
        {/* <Link
            to="/upload-video"
            className="bg-neutral-900 border border-gray-700 rounded-xl p-10 text-center text-2xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-md"
          >
            🎥 Predict Video
          </Link> */}

        {/* Audio Detection */}
        {/* <Link
            to="/upload-audio"
            className="bg-neutral-900 border border-gray-700 rounded-xl p-10 text-center text-2xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-md"
          >
            🎤 Predict Audio
          </Link>
        </div> */}
      </section>

      {/* ================= FOOTER ================= */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="text-center py-10 border-t border-white/10 text-gray-400 bg-[#050505] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,0,255,0.07),transparent_70%)] pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-2xl font-semibold mb-3 text-cyan-400">
            Deepfake Detection Portal
          </h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Empowering users to identify manipulated content and preserve
            digital authenticity through AI innovation.
          </p>

          {/* ENHANCEMENT: Icon-based social links */}
          <div className="flex justify-center gap-8 mb-6">
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>

          <p className="text-sm">
            © {new Date().getFullYear()} Deepfake Detection Portal | Built with{" "}
            <span className="text-pink-400">MERN</span> +{" "}
            <span className="text-cyan-400">Python</span>
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
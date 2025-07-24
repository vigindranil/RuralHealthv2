
import { Wrench } from 'lucide-react';

export default function WorkInProgress() {
  return (
    // Main container with a light background and overflow-hidden for the blurred shapes
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-50 text-center px-6">

      {/* Colorful blurred background shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-3000" />

      {/* The main content card */}
      <main className="relative z-10 max-w-lg w-full bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200">

        {/* Animated Icon with a vibrant gradient background */}
        <div className="mb-8 inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 animate-float shadow-lg">
          <Wrench className="h-10 w-10 text-white" />
        </div>

        {/* Main Heading with a colorful text gradient */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Work in Progress
        </h1>

        {/* Sub-heading with a friendly emoji */}
        <p className="text-lg text-slate-600 pt-2 mb-8">
          Our team is currently working on this feature. It's going to be great! 💪
        </p>

        {/* A bright, solid "Coming Soon" badge */}
        <div className="inline-block bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-full mb-8 shadow-md hover:bg-blue-700 transition-colors">
          Coming Soon
        </div>

        {/* Footer Message */}
        <footer className="text-sm text-slate-500">
          <p>Thanks for your patience 🚀</p>
        </footer>
      </main>
    </div>
  );
}
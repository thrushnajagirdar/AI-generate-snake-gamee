import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 gap-8 relative overflow-hidden tear-effect">
      {/* Static Noise Overlay */}
      <div className="fixed inset-[-50%] bg-static z-50"></div>
      
      <header className="text-center z-10 w-full border-b-4 border-magenta pb-4 mb-4">
        <h1 className="text-2xl md:text-4xl font-pixel tracking-tighter mb-2 glitch-text text-cyan" data-text="SYS.OP // SNAKE.EXE">
          SYS.OP // SNAKE.EXE
        </h1>
        <p className="text-magenta tracking-widest text-xs uppercase">STATUS: KERNEL ACTIVE</p>
      </header>

      <main className="z-10 w-full max-w-5xl flex flex-col lg:flex-row items-start justify-center gap-12">
        <div className="flex-1 w-full flex justify-center border-2 border-cyan p-1 relative">
          <div className="absolute top-0 left-0 w-2 h-2 bg-magenta"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-magenta"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-magenta"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-magenta"></div>
          <SnakeGame />
        </div>
        
        <div className="w-full lg:w-96 flex flex-col justify-center border-2 border-magenta p-1 relative">
          <div className="absolute top-0 left-0 w-2 h-2 bg-cyan"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-cyan"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan"></div>
          <MusicPlayer />
        </div>
      </main>
      
      <footer className="absolute bottom-4 text-[10px] text-cyan z-10 glitch-text" data-text="V 1.0.4 // END OF LINE">
        V 1.0.4 // END OF LINE
      </footer>
    </div>
  );
}

import React from 'react';

const Expo3DPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-md">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Warpala Expo City - 3D Interface
        </h1>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
            Backend Connected
          </span>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/30">
            UE5 Native Bridge
          </span>
        </div>
      </header>
      
      <main className="flex-1 relative overflow-hidden group">
        {/* Placeholder for Unreal Engine Pixel Streaming or Local Viewport */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900/20 flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-6 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <h2 className="text-2xl font-light text-gray-400 tracking-widest uppercase animate-pulse">
            Connecting to 3D Visualization...
          </h2>
          <p className="mt-4 text-gray-500 max-w-md text-center text-sm">
            Please ensure <strong>WarpalaUE5.exe</strong> or the Unreal Editor is running. 
            The city is being procedurally generated via API data.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-6 opacity-40">
            <div className="p-4 border border-gray-800 rounded-lg text-center">
              <div className="text-cyan-400 font-bold mb-1">LUMEN</div>
              <div className="text-[10px] text-gray-600">DYNAMIC GI</div>
            </div>
            <div className="p-4 border border-gray-800 rounded-lg text-center">
              <div className="text-purple-400 font-bold mb-1">NANITE</div>
              <div className="text-[10px] text-gray-600">HI-POLY MESH</div>
            </div>
            <div className="p-4 border border-gray-800 rounded-lg text-center">
              <div className="text-green-400 font-bold mb-1">AI</div>
              <div className="text-[10px] text-gray-600">NPC CROWDS</div>
            </div>
          </div>
        </div>

        {/* HUD Overlay Simulation */}
        <div className="absolute bottom-8 left-8 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl max-w-xs shadow-2xl transition-transform group-hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-xs font-bold uppercase tracking-tighter text-gray-300">Live Traffic Control</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Drone Density</span>
              <span className="text-cyan-400">85%</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[85%]"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Visitor AI</span>
              <span className="text-purple-400">Active</span>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="p-4 bg-gray-950 border-t border-gray-900 flex justify-between text-[10px] uppercase tracking-widest text-gray-600 font-medium">
        <div>Warpala OS v3.0.0-alpha</div>
        <div className="flex gap-6">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Coordinates: 0.0, 0.0, 0.0</span>
          <span className="hover:text-purple-400 cursor-pointer transition-colors">Sector: Central Hub</span>
          <span className="text-gray-400">Status: Standby</span>
        </div>
      </footer>
    </div>
  );
};

export default Expo3DPage;

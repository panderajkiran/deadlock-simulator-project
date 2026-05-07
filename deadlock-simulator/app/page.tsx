"use client";

import AlgorithmResult from "@/components/AlgorithmResult";
import ExecutionSteps from "@/components/ExecutionSteps";
import MatrixInput from "@/components/MatrixInput";
import RAGraph from "@/components/RAGraph";
import useSimulatorStore from "@/store/simulatorStore";
import { isSafeResult } from "@/lib/banker";

export default function Home() {
  const store = useSimulatorStore();
  const { result } = store;

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      {/* Left Panel - Sidebar */}
      <aside className="w-[380px] h-full bg-[#1e293b] border-r border-slate-700 flex flex-col shadow-2xl z-20 overflow-hidden shrink-0">
        <div className="p-6 bg-[#0f172a]/50 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20 text-xl">
              D
            </div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              DEADLOCK<br/><span className="text-blue-500 text-sm tracking-widest">SIMULATOR</span>
            </h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]">
          <MatrixInput />
        </div>

        <div className="p-4 bg-[#0f172a]/30 border-t border-slate-700 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">OS Lab Visualization Tool</p>
        </div>
      </aside>

      {/* Right Panel - Content Area */}
      <main className="flex-1 h-full flex flex-col p-8 gap-6 overflow-y-auto relative custom-scrollbar">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Top Section: Graph and Result Summary */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Main Graph - Takes 8 columns or full if no result */}
          <div className={`${result ? "col-span-8" : "col-span-12"} flex flex-col transition-all duration-500 min-h-0`}>
            <RAGraph />
          </div>

          {/* Result Card - Shown on the right if result exists */}
          {result && (
            <div className="col-span-4 min-h-0 animate-in slide-in-from-right-8 duration-500">
              <AlgorithmResult />
            </div>
          )}
        </div>

        {/* Bottom Section: Step-by-Step Execution */}
        {result && (
          <div className="min-h-[350px] bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6 animate-in slide-in-from-bottom-8 duration-500 shrink-0">
            <ExecutionSteps />
          </div>
        )}
        
        {!result && (
          <div className="h-[100px] flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-2xl shrink-0">
            <p className="text-slate-500 font-bold tracking-widest uppercase animate-pulse">Configure inputs and click "Run Banker's Algorithm" to start</p>
          </div>
        )}
      </main>
    </div>
  );
}

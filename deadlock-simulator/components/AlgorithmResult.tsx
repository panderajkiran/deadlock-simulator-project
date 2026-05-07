"use client";

import useSimulatorStore from "@/store/simulatorStore";
import { isSafeResult } from "@/lib/banker";

export default function AlgorithmResult() {
  const store = useSimulatorStore();
  const { result } = store;

  if (!result) return null;

  const isSafe = isSafeResult(result);

  return (
    <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700 p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-300 h-full">
      <h2 className="text-2xl font-black text-white tracking-tight">
        Algorithm Result
      </h2>

      <div className={`p-6 rounded-xl border-2 ${
        isSafe 
          ? "bg-emerald-500/5 border-emerald-500/20" 
          : "bg-rose-500/5 border-rose-500/20"
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg ${
            isSafe ? "bg-emerald-500 shadow-emerald-500/20" : "bg-rose-500 shadow-rose-500/20"
          }`}>
            {isSafe ? "✓" : "!"}
          </div>
          <h3 className={`text-xl font-black tracking-wider uppercase ${
            isSafe ? "text-emerald-400" : "text-rose-400"
          }`}>
            {isSafe ? "Safe State" : "Deadlock Detected"}
          </h3>
        </div>

        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
          {isSafe 
            ? "A valid execution sequence exists. No deadlock will occur under the current configuration."
            : "No safe sequence was found. The system is in an unsafe state and deadlock has been detected."}
        </p>

        {isSafe && (
          <div className="bg-[#0f172a]/50 rounded-lg p-4 border border-slate-700/50">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Safe Sequence:</p>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {result.sequence.map((pId, idx) => (
                <div key={idx} className="flex items-center gap-3 shrink-0">
                  <div className="bg-blue-600 px-4 py-2 rounded font-black text-white shadow-lg shadow-blue-500/20">
                    P{pId}
                  </div>
                  {idx < result.sequence.length - 1 && (
                    <span className="text-slate-600 font-bold">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Steps</p>
          <p className="text-3xl font-black text-white">{result.steps.length}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
          <p className={`text-3xl font-black ${isSafe ? "text-emerald-400" : "text-rose-400"}`}>
            {isSafe ? "SAFE" : "UNSAFE"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <button 
          onClick={() => store.runAlgorithm()}
          className="py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          Run Again
        </button>
        <button 
          onClick={() => store.resetStep()}
          className="py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all active:scale-95"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

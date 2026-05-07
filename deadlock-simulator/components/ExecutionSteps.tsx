"use client";

import useSimulatorStore from "@/store/simulatorStore";

export default function ExecutionSteps() {
  const store = useSimulatorStore();
  const { currentStep, result } = store;

  if (!result) return null;

  const totalSteps = result.steps.length;
  const currentStepData = result.steps[Math.min(currentStep, totalSteps - 1)];

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        Step-by-Step Execution
      </h2>

      {/* Main Info Box */}
      <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 shadow-lg">
        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">
          Step {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
        </p>
        <p className="text-lg font-bold text-blue-50 text-shadow-sm">
          {currentStepData.action}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Work Vector */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Work Vector</p>
          <div className="flex gap-2 flex-wrap">
            {currentStepData.work.map((val, idx) => (
              <div key={idx} className="w-10 h-10 bg-blue-900/30 border border-blue-500/20 rounded flex items-center justify-center font-black text-blue-400 shadow-inner">
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Process Status */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col min-h-[180px]">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Process Status</p>
          <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar max-h-[120px]">
            {currentStepData.finish.map((isDone, idx) => {
              const isCurrent = currentStepData.process === idx;
              return (
                <div key={idx} className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  isCurrent 
                    ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/5" 
                    : "bg-slate-900/50 border-slate-800"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-sm ${isCurrent ? "text-blue-400" : "text-slate-400"}`}>
                      P{idx}:
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isDone ? "text-emerald-400" : isCurrent ? "text-blue-400" : "text-slate-500"
                    }`}>
                      {isDone ? "✅ Finished" : isCurrent ? "▶ Checking" : "⏳ Waiting"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-12 gap-3 mt-2">
        <button
          onClick={() => store.setStep(0)}
          disabled={currentStep === 0}
          className="col-span-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs border border-slate-700"
        >
          First
        </button>
        <button
          onClick={() => store.prevStep()}
          disabled={currentStep === 0}
          className="col-span-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs border border-slate-700"
        >
          Prev
        </button>
        <button
          onClick={() => store.nextStep()}
          disabled={currentStep >= totalSteps - 1}
          className="col-span-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
        >
          Next Step
        </button>
        <button
          onClick={() => store.setStep(totalSteps - 1)}
          disabled={currentStep >= totalSteps - 1}
          className="col-span-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs border border-slate-700"
        >
          Last
        </button>
      </div>
    </div>
  );
}

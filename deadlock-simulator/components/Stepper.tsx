"use client";

import useSimulatorStore from "@/store/simulatorStore";
import { isSafeResult } from "@/lib/banker";

export default function Stepper() {
  const store = useSimulatorStore();
  const { currentStep, result } = store;

  const totalSteps = result?.steps.length || 0;
  const isAtEnd = currentStep >= totalSteps;

  return (
    <div className="p-4 flex flex-col md:flex-row justify-between items-center bg-white rounded-lg gap-4">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-slate-800 whitespace-nowrap">Step-by-Step Execution</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => store.prevStep()}
            disabled={currentStep === 0 || !result}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 transition"
          >
            &lt;
          </button>
          
          <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600 min-w-[60px] text-center">
            {result ? `${Math.min(currentStep + 1, totalSteps)} / ${totalSteps}` : "0 / 0"}
          </div>

          <button
            onClick={() => store.nextStep()}
            disabled={isAtEnd || !result}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 transition"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => store.loadPreset("safe")}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152945] text-white rounded text-sm font-medium transition whitespace-nowrap"
        >
          Generate Safe Scenario
        </button>
        <button
          onClick={() => store.loadPreset("deadlock")}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152945] text-white rounded text-sm font-medium transition whitespace-nowrap"
        >
          Generate Deadlock Scenario
        </button>
      </div>
    </div>
  );
}

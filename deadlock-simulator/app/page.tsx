"use client";

import MatrixInput from "@/components/MatrixInput";
import ResultPanel from "@/components/ResultPanel";
import RAGraph from "@/components/RAGraph";
import Stepper from "@/components/Stepper";
import AdvancedFeatures from "@/components/AdvancedFeatures";
import useSimulatorStore from "@/store/simulatorStore";

export default function Home() {
  const store = useSimulatorStore();

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-900 dark:text-slate-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Deadlock Simulator
          </h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of Banker's Algorithm and Resource
            Allocation Graph
          </p>
        </div>

        {/* Main Layout */}
        <div className="space-y-8">
          {/* Top: Matrix Input + Result Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MatrixInput />
            </div>
            <div>
              <ResultPanel />
            </div>
          </div>

          {/* Run Algorithm Button */}
          <div className="flex justify-center">
            <button
              onClick={() => store.runAlgorithm()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-lg transition shadow-lg"
            >
              ▶️ Run Banker's Algorithm
            </button>
          </div>

          {/* Graph */}
          <RAGraph />

          {/* Stepper */}
          <Stepper />

          {/* Advanced Features */}
          <AdvancedFeatures />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>© 2024 Deadlock Simulator — Educational Tool for OS Concepts</p>
        </div>
      </main>
    </div>
  );
}

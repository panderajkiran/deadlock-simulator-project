"use client";

import useSimulatorStore from "@/store/simulatorStore";
import { isSafeResult } from "@/lib/banker";

export default function ResultPanel() {
  const store = useSimulatorStore();
  const { result } = store;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Algorithm Result
      </h2>

      {!result ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Click "Run Algorithm" to execute Banker's Algorithm
          </p>
        </div>
      ) : (
        <div>
          {/* Result Status */}
          {isSafeResult(result) ? (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 mb-6 rounded">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                ✅ SAFE STATE
              </h3>
              <p className="text-green-600 dark:text-green-200 mb-4">
                A valid execution sequence exists. No deadlock will occur.
              </p>

              <div className="bg-white dark:bg-slate-700 rounded p-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Safe Sequence:
                </p>
                <div className="flex flex-wrap gap-3">
                  {result.sequence.map((process, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="px-4 py-2 bg-blue-500 text-white rounded font-bold">
                        P{process}
                      </div>
                      {idx < result.sequence.length - 1 && (
                        <div className="mx-2 text-slate-700 dark:text-slate-300 font-bold">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-6 rounded">
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
                ⛔ DEADLOCK DETECTED
              </h3>
              <p className="text-red-600 dark:text-red-200 mb-4">
                The system is in an unsafe state. Deadlock has been detected.
              </p>

              <div className="bg-white dark:bg-slate-700 rounded p-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Deadlocked Processes:
                </p>
                <div className="flex flex-wrap gap-3">
                  {result.deadlockedProcesses.map((process) => (
                    <div
                      key={process}
                      className="px-4 py-2 bg-red-500 text-white rounded font-bold"
                    >
                      P{process}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Execution Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-100 dark:bg-slate-700 rounded p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
                Total Steps
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {result.steps.length}
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 rounded p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
                Status
              </p>
              <p
                className={`text-3xl font-bold ${
                  isSafeResult(result)
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isSafeResult(result) ? "SAFE" : "UNSAFE"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => store.runAlgorithm()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition"
            >
              Run Again
            </button>
            <button
              onClick={() => store.resetStep()}
              className="px-6 py-2 bg-slate-400 hover:bg-slate-300 text-slate-900 rounded font-medium transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import useSimulatorStore from "@/store/simulatorStore";
import { isSafeResult } from "@/lib/banker";

export default function Stepper() {
  const store = useSimulatorStore();
  const { config, result, currentStep } = store;

  if (!result) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          Run the algorithm first to see step-by-step execution
        </p>
      </div>
    );
  }

  const totalSteps = result.steps.length;
  const isAtEnd = currentStep >= totalSteps;
  const currentStepData = result.steps[Math.min(currentStep, totalSteps - 1)];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Step-by-Step Execution
      </h2>

      {/* Step Counter */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Step {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
        </p>
        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
          {currentStepData?.action}
        </p>
      </div>

      {/* Step Details */}
      {currentStepData && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Work Vector
            </p>
            <div className="flex gap-2 mt-2">
              {currentStepData.work.map((val, i) => (
                <div
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-sm font-mono font-bold"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Process Status
            </p>
            <div className="mt-2 space-y-1">
              {currentStepData.finish.map((finished, i) => (
                <div
                  key={i}
                  className={`text-sm font-mono px-2 py-1 rounded ${
                    finished
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : i === currentStepData.process
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  P{i}:{" "}
                  {finished
                    ? "✓ Complete"
                    : i === currentStepData.process
                      ? "▶ Checking"
                      : "⏳ Waiting"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => store.resetStep()}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          First
        </button>
        <button
          onClick={() => store.prevStep()}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <button
          onClick={() => store.nextStep()}
          disabled={isAtEnd}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          onClick={() => store.setStep(totalSteps - 1)}
          disabled={isAtEnd}
          className="px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Last
        </button>
      </div>

      {/* Summary at End */}
      {isAtEnd && (
        <div
          className={`p-4 rounded border-l-4 ${
            isSafeResult(result)
              ? "bg-green-50 dark:bg-green-900/20 border-green-500"
              : "bg-red-50 dark:bg-red-900/20 border-red-500"
          }`}
        >
          <p
            className={`font-bold text-lg ${
              isSafeResult(result)
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {isSafeResult(result)
              ? "✅ Safe Sequence Found"
              : "⛔ Deadlock Detected"}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            {isSafeResult(result)
              ? `Sequence: ${result.sequence.map((p) => `P${p}`).join(" → ")}`
              : `Deadlocked: ${result.deadlockedProcesses.map((p) => `P${p}`).join(", ")}`}
          </p>
        </div>
      )}
    </div>
  );
}

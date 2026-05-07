"use client";

import useSimulatorStore from "@/store/simulatorStore";
import { useState } from "react";

function Accordion({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[#1e3a5f] text-white flex justify-between items-center text-sm font-semibold"
      >
        {title}
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
          ^
        </span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}

export default function MatrixInput() {
  const store = useSimulatorStore();
  const { config } = store;
  const { processes, resources, allocation, max, available } = config;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        store.importScenario(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Dimension Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider">System Configuration</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              PROCESSES
            </label>
            <div className="flex border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
              <input
                type="number"
                min="1"
                max="8"
                value={processes}
                onChange={(e) =>
                  store.setProcesses(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full px-3 py-2 bg-transparent text-center font-bold text-slate-800 dark:text-slate-100 outline-none"
              />
              <div className="flex flex-col border-l border-slate-300 dark:border-slate-600">
                <button onClick={() => store.setProcesses(Math.min(8, processes + 1))} className="px-2 flex-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">▲</button>
                <button onClick={() => store.setProcesses(Math.max(1, processes - 1))} className="px-2 flex-1 border-t border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">▼</button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              RESOURCES
            </label>
            <div className="flex border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
              <input
                type="number"
                min="1"
                max="8"
                value={resources}
                onChange={(e) =>
                  store.setResources(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full px-3 py-2 bg-transparent text-center font-bold text-slate-800 dark:text-slate-100 outline-none"
              />
              <div className="flex flex-col border-l border-slate-300 dark:border-slate-600">
                <button onClick={() => store.setResources(Math.min(8, resources + 1))} className="px-2 flex-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">▲</button>
                <button onClick={() => store.setResources(Math.max(1, resources - 1))} className="px-2 flex-1 border-t border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">▼</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Accordion title="Allocation Matrix (Current Holdings)">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2 text-[10px] font-bold text-slate-400 uppercase">Process</th>
                {Array.from({ length: resources }).map((_, j) => (
                  <th key={j} className="p-2 text-[10px] font-bold text-slate-400 uppercase text-center">R{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: processes }).map((_, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-700/50">
                  <td className="p-2 text-xs font-bold text-slate-600 dark:text-slate-400">P{i}</td>
                  {Array.from({ length: resources }).map((_, j) => (
                    <td key={`${i}-${j}`} className="p-1">
                      <input
                        type="number"
                        min="0"
                        value={allocation[i][j]}
                        onChange={(e) =>
                          store.setAllocation(i, j, Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className={`w-full p-2 text-center text-sm font-medium rounded-md bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500 outline-none transition-all ${
                          allocation[i][j] > max[i][j] ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-slate-700 dark:text-slate-200"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>

      <Accordion title="Max Demand Matrix (Upper Limit)">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2 text-[10px] font-bold text-slate-400 uppercase">Process</th>
                {Array.from({ length: resources }).map((_, j) => (
                  <th key={j} className="p-2 text-[10px] font-bold text-slate-400 uppercase text-center">R{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: processes }).map((_, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-700/50">
                  <td className="p-2 text-xs font-bold text-slate-600 dark:text-slate-400">P{i}</td>
                  {Array.from({ length: resources }).map((_, j) => (
                    <td key={`${i}-${j}`} className="p-1">
                      <input
                        type="number"
                        min="0"
                        value={max[i][j]}
                        onChange={(e) =>
                          store.setMax(i, j, Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full p-2 text-center text-sm font-medium rounded-md bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500 outline-none transition-all text-slate-700 dark:text-slate-200"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>

      <Accordion title="Available Resources (Global Pool)">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2 text-[10px] font-bold text-slate-400 uppercase">Source</th>
                {Array.from({ length: resources }).map((_, j) => (
                  <th key={j} className="p-2 text-[10px] font-bold text-slate-400 uppercase text-center">R{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 dark:border-slate-700/50">
                <td className="p-2 text-xs font-bold text-slate-600 dark:text-slate-400">System</td>
                {Array.from({ length: resources }).map((_, j) => (
                  <td key={j} className="p-1">
                    <input
                      type="number"
                      min="0"
                      value={available[j]}
                      onChange={(e) =>
                        store.setAvailable(j, Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-full p-2 text-center text-sm font-medium rounded-md bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500 outline-none transition-all text-slate-700 dark:text-slate-200"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Accordion>

      {/* Control Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => store.runAlgorithm()}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="text-xl">🚀</span>
          RUN BANKER'S ALGORITHM
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => store.exportScenario()}
            className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg border border-slate-300 dark:border-slate-600 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>📥</span> Export
          </button>
          
          <label className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg border border-slate-300 dark:border-slate-600 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
            <span>📤</span> Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => store.loadPreset("safe")}
            className="py-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 transition-all"
          >
            LOAD SAFE CASE
          </button>
          <button
            onClick={() => store.loadPreset("deadlock")}
            className="py-2 text-xs bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 font-bold rounded-lg border border-rose-200 dark:border-rose-800/50 hover:bg-rose-100 transition-all"
          >
            LOAD DEADLOCK CASE
          </button>
        </div>
      </div>
    </div>
  );
}


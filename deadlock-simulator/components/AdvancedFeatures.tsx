"use client";

import { useRef } from "react";
import useSimulatorStore from "@/store/simulatorStore";

export default function AdvancedFeatures() {
  const store = useSimulatorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      config: store.config,
      result: store.result,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `deadlock-simulator-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.config) {
          store.setConfig(data.config);
          store.setResult(data.result ?? null);
        }
      } catch (err) {
        alert("Failed to import file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Advanced Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Presets */}
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Load Presets
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => store.loadPreset("safe")}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition"
            >
              Safe State Example
            </button>
            <button
              onClick={() => store.loadPreset("deadlock")}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition"
            >
              Deadlock Example
            </button>
          </div>
        </div>

        {/* Import/Export */}
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Import/Export
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition"
            >
              📥 Export Scenario
            </button>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium transition"
              >
                📤 Import Scenario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-slate-700 dark:text-slate-300">
        <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          ℹ️ About Banker's Algorithm
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Detects unsafe states and deadlock scenarios</li>
          <li>Ensures system proceeds only to safe states</li>
          <li>Prevents circular wait conditions</li>
        </ul>
      </div>
    </div>
  );
}

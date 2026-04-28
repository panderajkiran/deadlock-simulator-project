"use client";

import useSimulatorStore from "@/store/simulatorStore";

export default function MatrixInput() {
  const store = useSimulatorStore();
  const { config } = store;
  const { processes, resources, allocation, max, available } = config;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Configuration
      </h2>

      {/* Dimension Controls */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Processes
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => store.setProcesses(Math.max(1, processes - 1))}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max="8"
              value={processes}
              onChange={(e) =>
                store.setProcesses(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            />
            <button
              onClick={() => store.setProcesses(Math.min(8, processes + 1))}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Resources
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => store.setResources(Math.max(1, resources - 1))}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max="8"
              value={resources}
              onChange={(e) =>
                store.setResources(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            />
            <button
              onClick={() => store.setResources(Math.min(8, resources + 1))}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Three-Column Layout: Allocation | Max | Available */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Allocation Matrix */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            Allocation (A)
          </h3>
          <div className="overflow-x-auto">
            <table className="border-collapse border border-slate-300 dark:border-slate-600">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    P / R
                  </th>
                  {Array.from({ length: resources }).map((_, j) => (
                    <th
                      key={j}
                      className="border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300"
                    >
                      R{j}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: processes }).map((_, i) => (
                  <tr key={i}>
                    <td className="border border-slate-300 dark:border-slate-600 px-2 py-1 font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 text-xs">
                      P{i}
                    </td>
                    {Array.from({ length: resources }).map((_, j) => (
                      <td
                        key={`${i}-${j}`}
                        className="border border-slate-300 dark:border-slate-600 p-1"
                      >
                        <input
                          type="number"
                          min="0"
                          value={allocation[i][j]}
                          onChange={(e) =>
                            store.setAllocation(
                              i,
                              j,
                              Math.max(0, parseInt(e.target.value) || 0),
                            )
                          }
                          className={`w-12 px-2 py-1 border rounded text-center text-sm font-mono ${
                            allocation[i][j] > max[i][j]
                              ? "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-900 dark:text-red-200"
                              : "border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Max Matrix */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            Max (M)
          </h3>
          <div className="overflow-x-auto">
            <table className="border-collapse border border-slate-300 dark:border-slate-600">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    P / R
                  </th>
                  {Array.from({ length: resources }).map((_, j) => (
                    <th
                      key={j}
                      className="border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300"
                    >
                      R{j}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: processes }).map((_, i) => (
                  <tr key={i}>
                    <td className="border border-slate-300 dark:border-slate-600 px-2 py-1 font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 text-xs">
                      P{i}
                    </td>
                    {Array.from({ length: resources }).map((_, j) => (
                      <td
                        key={`${i}-${j}`}
                        className="border border-slate-300 dark:border-slate-600 p-1"
                      >
                        <input
                          type="number"
                          min="0"
                          value={max[i][j]}
                          onChange={(e) =>
                            store.setMax(
                              i,
                              j,
                              Math.max(0, parseInt(e.target.value) || 0),
                            )
                          }
                          className="w-12 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center text-sm font-mono dark:bg-slate-700 dark:text-white"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Vector */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            Available (V)
          </h3>
          <div className="overflow-x-auto">
            <table className="border-collapse border border-slate-300 dark:border-slate-600">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Resource
                  </th>
                  <th className="border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: resources }).map((_, j) => (
                  <tr key={j}>
                    <td className="border border-slate-300 dark:border-slate-600 px-2 py-1 font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 text-xs">
                      R{j}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-600 p-1">
                      <input
                        type="number"
                        min="0"
                        value={available[j]}
                        onChange={(e) =>
                          store.setAvailable(
                            j,
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="w-12 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center text-sm font-mono dark:bg-slate-700 dark:text-white"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => store.loadPreset("safe")}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition"
        >
          Load Safe State
        </button>
        <button
          onClick={() => store.loadPreset("deadlock")}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition"
        >
          Load Deadlock State
        </button>
      </div>
    </div>
  );
}

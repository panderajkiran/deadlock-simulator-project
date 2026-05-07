"use client";

import { create } from "zustand";
import {
  runBankersAlgorithm,
  SimulatorState,
  AlgorithmResult,
} from "@/lib/banker";

interface SimulatorStore {
  config: SimulatorState;
  result: AlgorithmResult | null;
  currentStep: number;

  setProcesses: (n: number) => void;
  setResources: (m: number) => void;
  setAllocation: (i: number, j: number, val: number) => void;
  setMax: (i: number, j: number, val: number) => void;
  setAvailable: (j: number, val: number) => void;
  setConfig: (config: SimulatorState) => void;

  runAlgorithm: () => void;
  setResult: (result: AlgorithmResult | null) => void;

  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetStep: () => void;

  loadPreset: (preset: "safe" | "deadlock") => void;
  exportScenario: () => void;
  importScenario: (json: string) => void;
}

const initialState: SimulatorState = {
  processes: 3,
  resources: 3,
  allocation: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  max: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  available: [0, 0, 0],
};

const cloneConfig = (config: SimulatorState): SimulatorState => ({
  processes: config.processes,
  resources: config.resources,
  allocation: config.allocation.map((row) => [...row]),
  max: config.max.map((row) => [...row]),
  available: [...config.available],
});

const useSimulatorStore = create<SimulatorStore>((set) => ({
  config: cloneConfig(initialState),
  result: null,
  currentStep: 0,

  setProcesses: (n) => {
    set((state) => {
      const oldN = state.config.processes;
      if (n === oldN) return {};

      const allocation = state.config.allocation.map((row) => [...row]);
      const max = state.config.max.map((row) => [...row]);

      if (n > oldN) {
        for (let i = oldN; i < n; i++) {
          allocation.push(new Array(state.config.resources).fill(0));
          max.push(new Array(state.config.resources).fill(0));
        }
      } else {
        allocation.splice(n);
        max.splice(n);
      }

      return {
        config: {
          ...state.config,
          processes: n,
          allocation,
          max,
        },
      };
    });
  },

  setResources: (m) => {
    set((state) => {
      const oldM = state.config.resources;
      if (m === oldM) return {};

      const allocation = state.config.allocation.map((row) => [...row]);
      const max = state.config.max.map((row) => [...row]);
      const available = [...state.config.available];

      if (m > oldM) {
        for (let i = 0; i < state.config.processes; i++) {
          for (let j = oldM; j < m; j++) {
            allocation[i].push(0);
            max[i].push(0);
          }
        }
        for (let j = oldM; j < m; j++) {
          available.push(0);
        }
      } else {
        for (let i = 0; i < state.config.processes; i++) {
          allocation[i].splice(m);
          max[i].splice(m);
        }
        available.splice(m);
      }

      return {
        config: {
          ...state.config,
          resources: m,
          allocation,
          max,
          available,
        },
      };
    });
  },

  setAllocation: (i, j, val) => {
    set((state) => {
      const allocation = state.config.allocation.map((row) => [...row]);
      allocation[i][j] = val;
      return { config: { ...state.config, allocation } };
    });
  },

  setMax: (i, j, val) => {
    set((state) => {
      const max = state.config.max.map((row) => [...row]);
      max[i][j] = val;
      return { config: { ...state.config, max } };
    });
  },

  setAvailable: (j, val) => {
    set((state) => {
      const available = [...state.config.available];
      available[j] = val;
      return { config: { ...state.config, available } };
    });
  },

  setConfig: (config) => {
    set({
      config: cloneConfig(config),
      result: null,
      currentStep: 0,
    });
  },

  runAlgorithm: () => {
    set((state) => {
      const result = runBankersAlgorithm(state.config);
      return { result, currentStep: 0 };
    });
  },

  setResult: (result) => {
    set({ result, currentStep: 0 });
  },

  nextStep: () => {
    set((state) =>
      state.result && state.currentStep < state.result.steps.length
        ? { currentStep: state.currentStep + 1 }
        : {},
    );
  },

  prevStep: () => {
    set((state) =>
      state.currentStep > 0 ? { currentStep: state.currentStep - 1 } : {},
    );
  },

  setStep: (step) => {
    set((state) =>
      state.result && step >= 0 && step <= state.result.steps.length
        ? { currentStep: step }
        : {},
    );
  },

  resetStep: () => {
    set({ currentStep: 0, result: null });
  },

  loadPreset: (preset) => {
    if (preset === "safe") {
      set({
        config: cloneConfig({
          processes: 3,
          resources: 3,
          allocation: [
            [0, 1, 0],
            [2, 0, 0],
            [3, 0, 2],
          ],
          max: [
            [7, 5, 3],
            [3, 2, 2],
            [9, 0, 2],
          ],
          available: [3, 3, 2],
        }),
        result: null,
        currentStep: 0,
      });
    } else if (preset === "deadlock") {
      set({
        config: cloneConfig({
          processes: 3,
          resources: 3,
          allocation: [
            [2, 0, 0],
            [0, 1, 0],
            [0, 0, 2],
          ],
          max: [
            [6, 0, 0],
            [0, 7, 0],
            [0, 0, 6],
          ],
          available: [0, 0, 0],
        }),
        result: null,
        currentStep: 0,
      });
    }
  },

  exportScenario: () => {
    const state = useSimulatorStore.getState().config;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "deadlock_scenario.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },

  importScenario: (json) => {
    try {
      const parsed = JSON.parse(json) as SimulatorState;
      if (parsed.processes && parsed.resources && parsed.allocation && parsed.max && parsed.available) {
        set({
          config: cloneConfig(parsed),
          result: null,
          currentStep: 0,
        });
      } else {
        alert("Invalid scenario file format.");
      }
    } catch (e) {
      alert("Failed to parse scenario file.");
    }
  },
}));

export default useSimulatorStore;

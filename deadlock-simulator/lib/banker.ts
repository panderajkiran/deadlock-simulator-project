/**
 * Banker's Algorithm Implementation
 * Detects safe states and deadlock scenarios
 */

export interface SimulatorState {
  processes: number;
  resources: number;
  allocation: number[][];
  max: number[][];
  available: number[];
}

export interface StepLog {
  step: number;
  process: number;
  work: number[];
  finish: boolean[];
  need: number[];
  action: string;
}

export interface SafeResult {
  safe: true;
  sequence: number[];
  steps: StepLog[];
}

export interface DeadlockResult {
  safe: false;
  deadlockedProcesses: number[];
  steps: StepLog[];
}

export type AlgorithmResult = SafeResult | DeadlockResult;

/**
 * Compute the Need matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
 */
export function computeNeed(
  max: number[][],
  allocation: number[][],
): number[][] {
  return max.map((row, i) => row.map((val, j) => val - allocation[i][j]));
}

/**
 * Validate input constraints
 * - Allocation cannot exceed Max
 * - All values must be non-negative
 */
export function validateInputs(state: SimulatorState): string | null {
  const { processes, resources, allocation, max, available } = state;

  for (let i = 0; i < processes; i++) {
    for (let j = 0; j < resources; j++) {
      if (allocation[i][j] < 0 || max[i][j] < 0 || available[j] < 0) {
        return `Negative values not allowed`;
      }
      if (allocation[i][j] > max[i][j]) {
        return `P${i}: Allocation exceeds Max for Resource R${j}`;
      }
    }
  }
  return null;
}

/**
 * Run Banker's Algorithm
 * Returns either a safe sequence or identifies deadlocked processes
 */
export function runBankersAlgorithm(state: SimulatorState): AlgorithmResult {
  const { processes: n, resources: m, allocation, max, available } = state;
  const need = computeNeed(max, allocation);

  const work = [...available];
  const finish = Array(n).fill(false);
  const sequence: number[] = [];
  const steps: StepLog[] = [];

  let stepCount = 0;
  let changed = true;

  while (changed && sequence.length < n) {
    changed = false;

    for (let i = 0; i < n; i++) {
      // If process i is not finished and Need[i] <= Work
      if (!finish[i] && need[i].every((val, j) => val <= work[j])) {
        // Process i can proceed
        const action = `P${i} can proceed (Need ≤ Work)`;
        steps.push({
          step: stepCount++,
          process: i,
          work: [...work],
          finish: [...finish],
          need: [...need[i]],
          action,
        });

        // Release resources
        for (let j = 0; j < m; j++) {
          work[j] += allocation[i][j];
        }

        finish[i] = true;
        sequence.push(i);
        changed = true;
        break; // Restart from the beginning
      }
    }
  }

  // Log final state
  steps.push({
    step: stepCount,
    process: -1,
    work: [...work],
    finish: [...finish],
    need: [],
    action: "Algorithm complete",
  });

  // Check if all processes finished
  const deadlockedProcesses = finish
    .map((f, i) => (f ? -1 : i))
    .filter((i) => i !== -1);

  if (deadlockedProcesses.length > 0) {
    return {
      safe: false,
      deadlockedProcesses,
      steps,
    };
  }

  return {
    safe: true,
    sequence,
    steps,
  };
}

/**
 * Helper to check if result is safe
 */
export function isSafeResult(
  result: AlgorithmResult | null,
): result is SafeResult {
  return result !== null && result.safe === true;
}

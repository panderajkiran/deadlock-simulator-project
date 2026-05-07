# Deadlock Simulator — One-Day Execution Plan

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · D3.js v7 · Zustand  
> **Goal:** Interactive web app — Banker's Algorithm + Resource Allocation Graph visualization

---

## Project Structure

```
deadlock-simulator/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               ← main UI
│   └── globals.css
├── lib/
│   ├── banker.ts              ← pure algorithm (no React)
│   └── ragDetect.ts           ← DFS cycle detection
├── components/
│   ├── MatrixInput.tsx        ← dynamic table inputs
│   ├── ResultPanel.tsx        ← safe/unsafe + sequence
│   ├── RAGraph.tsx            ← D3 force graph
│   └── Stepper.tsx            ← step-by-step simulation
├── store/
│   └── simulatorStore.ts      ← Zustand global state
├── public/
└── package.json
```

---
manual deopoy

## Phase 1 — Project Setup (30 min)

**Goal:** Scaffold Next.js project, install all dependencies, verify dev server runs.

```bash
npx create-next-app@latest deadlock-simulator \
  --typescript --tailwind --app --eslint --src-dir=false
cd deadlock-simulator
npm install d3 zustand framer-motion
npm install -D @types/d3
```

### Tasks
- [ ] Init Next.js 14 with App Router + TypeScript + Tailwind
- [ ] Install D3.js, Zustand, framer-motion
- [ ] Delete boilerplate from `app/page.tsx` and `globals.css`
- [ ] Set up base layout with a dark/neutral theme in `globals.css`
- [ ] Confirm `npm run dev` runs without errors

### Deliverable
Clean project scaffold running at `localhost:3000`.

---

## Phase 2 — Core Algorithm: `lib/banker.ts` (45 min)

**Goal:** Pure TypeScript implementation of Banker's Algorithm. No React, fully testable.

### Data Structures

```typescript
export interface SimulatorState {
  processes: number;       // n
  resources: number;       // m
  allocation: number[][];  // n x m
  max: number[][];         // n x m
  available: number[];     // 1 x m
}

export interface SafeResult {
  safe: true;
  sequence: number[];      // e.g. [1, 3, 0, 2]
  steps: StepLog[];
}

export interface DeadlockResult {
  safe: false;
  deadlockedProcesses: number[];
  steps: StepLog[];
}

export interface StepLog {
  step: number;
  process: number;
  work: number[];
  finish: boolean[];
  action: string;
}
```

### Algorithm

```typescript
// 1. Compute Need matrix
export function computeNeed(max: number[][], allocation: number[][]): number[][] {
  return max.map((row, i) => row.map((val, j) => val - allocation[i][j]));
}

// 2. Safety Algorithm
export function runBankersAlgorithm(state: SimulatorState): SafeResult | DeadlockResult {
  const { processes: n, resources: m, allocation, max, available } = state;
  const need = computeNeed(max, allocation);
  const work = [...available];
  const finish = Array(n).fill(false);
  const sequence: number[] = [];
  const steps: StepLog[] = [];
  let changed = true;

  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      if (!finish[i] && need[i].every((val, j) => val <= work[j])) {
        // Process i can proceed
        steps.push({ step: steps.length, process: i, work: [...work],
                     finish: [...finish], action: `P${i} allocated` });
        work.forEach((_, j) => { work[j] += allocation[i][j]; });
        finish[i] = true;
        sequence.push(i);
        changed = true;
      }
    }
  }

  const deadlockedProcesses = finish.map((f, i) => f ? -1 : i).filter(i => i !== -1);
  if (deadlockedProcesses.length > 0) return { safe: false, deadlockedProcesses, steps };
  return { safe: true, sequence, steps };
}
```

### Validation

```typescript
export function validateInputs(state: SimulatorState): string | null {
  // Need[i][j] must be >= 0 (Allocation cannot exceed Max)
  for (let i = 0; i < state.processes; i++)
    for (let j = 0; j < state.resources; j++)
      if (state.max[i][j] < state.allocation[i][j])
        return `P${i}: Allocation exceeds Max for Resource R${j}`;
  return null;
}
```

### Deliverable
`lib/banker.ts` — exports `runBankersAlgorithm`, `computeNeed`, `validateInputs`. Test manually in browser console before moving on.

---

## Phase 3 — Zustand Store: `store/simulatorStore.ts` (20 min)

**Goal:** Single source of truth for all matrix state and results.

```typescript
import { create } from 'zustand';
import { SimulatorState, SafeResult, DeadlockResult } from '@/lib/banker';

interface Store {
  config: SimulatorState;
  result: SafeResult | DeadlockResult | null;
  currentStep: number;
  setProcesses: (n: number) => void;
  setResources: (m: number) => void;
  setAllocation: (i: number, j: number, val: number) => void;
  setMax: (i: number, j: number, val: number) => void;
  setAvailable: (j: number, val: number) => void;
  setResult: (r: SafeResult | DeadlockResult | null) => void;
  nextStep: () => void;
  resetStep: () => void;
  loadPreset: (preset: 'safe' | 'deadlock') => void;
}
```

### Tasks
- [ ] Create store with all setters
- [ ] `loadPreset('safe')` — classic Banker's textbook example (5 processes, 3 resources)
- [ ] `loadPreset('deadlock')` — a known deadlock scenario for demo
- [ ] Matrix resize: when processes/resources count changes, pad or trim matrices

### Deliverable
`store/simulatorStore.ts` — all state accessible globally without prop drilling.

---

## Phase 4 — Matrix Input UI: `components/MatrixInput.tsx` (45 min)

**Goal:** Dynamic tables for Allocation, Max, and Available that update the store on every cell change.

### Tasks
- [ ] Render `n x m` table for Allocation and Max matrices
- [ ] Render `1 x m` row for Available vector
- [ ] Each cell: `<input type="number" min="0">` — updates store on `onChange`
- [ ] Highlight cell in red if `allocation[i][j] > max[i][j]` (instant validation)
- [ ] "Processes" and "Resources" number selectors at the top (range: 1–8)
- [ ] Row labels: P0, P1, P2 ... Column labels: R0, R1, R2 ...
- [ ] "Load Example" button → calls `loadPreset('safe')` or `loadPreset('deadlock')`

### UI Layout

```
┌──────────────────────────────────────────────────────┐
│  Processes: [3 ▲▼]    Resources: [3 ▲▼]              │
│                                                      │
│  ALLOCATION          MAX               AVAILABLE     │
│     R0  R1  R2          R0  R1  R2      R0  R1  R2  │
│ P0 [0] [1] [0]     P0 [7] [5] [3]    [3] [3] [2]   │
│ P1 [2] [0] [0]     P1 [3] [2] [2]                   │
│ P2 [3] [0] [2]     P2 [9] [0] [2]                   │
│                                                      │
│  [ Run Algorithm ]   [ Load Safe ]  [ Load Deadlock ]│
└──────────────────────────────────────────────────────┘
```

### Deliverable
`components/MatrixInput.tsx` — fully interactive matrix tables.

---

## Phase 5 — Connect Logic + Results: `components/ResultPanel.tsx` (30 min)

**Goal:** Run algorithm on submit, display result clearly.

### Tasks
- [ ] "Run Algorithm" button → calls `validateInputs` then `runBankersAlgorithm`
- [ ] Display **SAFE STATE** in green with animated safe sequence badges: `P1 → P3 → P0 → P2`
- [ ] Display **DEADLOCK DETECTED** in red, list stuck processes
- [ ] Show computed Need matrix below result
- [ ] Error toast if validation fails (e.g. allocation exceeds max)

### Styling
```
SAFE STATE ✓                         DEADLOCK DETECTED ✗
Safe sequence:                       Deadlocked processes:
P1 → P3 → P0 → P2                   P0, P2
(animated slide-in per badge)        (highlighted in red)
```

### Deliverable
`components/ResultPanel.tsx` — plugged into store, shows result on compute.

---

## Phase 6 — Resource Allocation Graph: `components/RAGraph.tsx` (60 min)

**Goal:** D3 force-directed graph showing system state visually.

### Node Types
| Node | Shape | Color |
|------|-------|-------|
| Process Pi | Circle (r=28) | Blue |
| Resource Rj | Square (40x40) | Orange |

### Edge Types
| Edge | Direction | Style |
|------|-----------|-------|
| Allocation | Resource → Process | Solid arrow |
| Request (Need > 0) | Process → Resource | Dashed arrow |
| Deadlock cycle | Any involved | Red highlight |

### Implementation Steps

```typescript
// 1. Build nodes array
const nodes = [
  ...processes.map((_, i) => ({ id: `P${i}`, type: 'process', index: i })),
  ...resources.map((_, j) => ({ id: `R${j}`, type: 'resource', index: j })),
];

// 2. Build edges from Allocation and Need matrices
const links = [];
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    if (allocation[i][j] > 0)
      links.push({ source: `R${j}`, target: `P${i}`, type: 'allocation', weight: allocation[i][j] });
    if (need[i][j] > 0)
      links.push({ source: `P${i}`, target: `R${j}`, type: 'request', weight: need[i][j] });
  }
}

// 3. D3 force simulation
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(120))
  .force('charge', d3.forceManyBody().strength(-400))
  .force('center', d3.forceCenter(width / 2, height / 2));
```

### Tasks
- [ ] SVG canvas with D3 force layout
- [ ] Circles for processes, squares for resources, labels on both
- [ ] Solid arrows for allocation edges, dashed for request edges
- [ ] Edge weight label (instance count)
- [ ] Red color on deadlocked nodes/cycle edges
- [ ] Graph re-renders whenever matrix state changes (use `useEffect` on store data)
- [ ] Drag nodes to reposition (D3 drag behavior)

### Deliverable
`components/RAGraph.tsx` — live-updating force graph, updates on every matrix change.

---

## Phase 7 — Step-by-Step Simulation: `components/Stepper.tsx` (30 min)

**Goal:** Walk through the Safety Algorithm one iteration at a time.

### UI
```
Step 2 / 5                          [ ← Prev ] [ Next → ]

  Checking P1:
  Need:   [1, 2, 2]
  Work:   [5, 3, 2]
  Need ≤ Work? ✓ → P1 can proceed
  Work after: [7, 5, 2]

  Finish: [ P0 ✓ ] [ P1 ✓ ] [ P2 · ] [ P3 · ] [ P4 · ]
```

### Tasks
- [ ] Pull `result.steps` from store
- [ ] "Next Step" / "Prev Step" buttons update `currentStep` in store
- [ ] Highlight current process row in MatrixInput table (pass `activeProcess` prop)
- [ ] Animate row highlight with framer-motion
- [ ] Show Work array updating step by step
- [ ] Finish[] checkmarks fill in as processes complete

### Deliverable
`components/Stepper.tsx` — interactive step-through of algorithm execution.

---

## Phase 8 — Advanced Features (30 min)

**Goal:** Random generator, export. These are bonus — implement if time allows.

### Random Input Generator
```typescript
export function generateRandomState(n: number, m: number, makeSafe: boolean): SimulatorState {
  // Generate random Max matrix
  // Generate Allocation where allocation[i][j] <= max[i][j]
  // Set Available such that sum(available) + sum(allocated) = total
  // If makeSafe=false, skew available to force deadlock
}
```

### Tasks
- [ ] "Generate Safe" button → random input guaranteed to have safe sequence
- [ ] "Generate Deadlock" button → random input guaranteed to deadlock
- [ ] Export as PNG using `html-to-image` library: `npm install html-to-image`
- [ ] Export scenario as JSON (download blob with current matrix state)
- [ ] Import JSON to restore a saved scenario

---

## Phase 9 — Polish & Deploy (20 min)

### UI Polish
- [ ] Responsive layout: matrices stack vertically on mobile
- [ ] Dark mode support via Tailwind `dark:` classes
- [ ] Empty state on first load: prompt user to enter data or load a preset
- [ ] Loading spinner during algorithm run (even if instant — shows it's working)
- [ ] Keyboard shortcut: `Enter` triggers Run Algorithm

### Deployment
```bash
# Push to GitHub
git init && git add . && git commit -m "initial commit"
gh repo create deadlock-simulator --public --push

# Deploy to Vercel (automatic on push, or manual)
npx vercel --prod
```

### Tasks
- [ ] Add `README.md` with live URL, algorithm explanation, screenshots
- [ ] Set `NEXT_PUBLIC_APP_URL` env var on Vercel
- [ ] Test on mobile viewport
- [ ] Verify D3 graph renders correctly in production build

---

## Viva Preparation

### Four Deadlock Conditions (Coffman, 1971)
| Condition | Meaning |
|-----------|---------|
| Mutual Exclusion | Only one process can use a resource at a time |
| Hold and Wait | A process holds resources while waiting for more |
| No Preemption | Resources cannot be forcibly taken from a process |
| Circular Wait | A circular chain of processes, each waiting on the next |

> All four must hold simultaneously for deadlock to occur.

### Banker's Algorithm — Key Points
- **Invented by:** Edsger W. Dijkstra (1965)
- **Type:** Deadlock avoidance (not detection)
- **Core idea:** Before granting a resource request, simulate worst-case allocation. Only grant if the resulting state is safe.
- **Safe state:** A sequence P1, P2, ..., Pn exists where every process can eventually complete.
- **Unsafe state:** No such sequence exists — deadlock may occur (but isn't guaranteed).
- **Time complexity:** O(n² × m) where n = processes, m = resource types

### Need Matrix
```
Need[i][j] = Max[i][j] − Allocation[i][j]
```
Represents how many more resources process i may still request.

### Resource Allocation Graph Rules
- **No cycle** → No deadlock
- **Cycle + single instance per resource** → Deadlock guaranteed
- **Cycle + multiple instances per resource** → Deadlock possible (need Banker's to confirm)

### Common Exam Questions
1. *"Is this state safe?"* → Run Safety Algorithm, show Work/Finish trace
2. *"What is the safe sequence?"* → The order processes complete in the simulation
3. *"Why is Banker's conservative?"* → It assumes every process will request its maximum
4. *"Difference between detection and avoidance?"* → Avoidance prevents deadlock proactively; detection finds it after it happens

---

## Build Order (One Day)

| Time | Phase | Output |
|------|-------|--------|
| 9:00 AM | Phase 1 — Setup | Project scaffold running |
| 9:30 AM | Phase 2 — Algorithm | `lib/banker.ts` complete |
| 10:15 AM | Phase 3 — Store | Zustand store wired |
| 10:35 AM | Phase 4 — Matrix Input | Tables + validation |
| 11:20 AM | Phase 5 — Results | Run + display output |
| 11:50 AM | Phase 6 — RAG | D3 force graph live |
| 12:50 PM | Phase 7 — Stepper | Step-by-step sim |
| 1:20 PM | Phase 8 — Extras | Random gen + export |
| 1:50 PM | Phase 9 — Deploy | Live on Vercel |

> **Total:** ~5 hours of focused work. Start with Phase 2 (`banker.ts`) — it's the foundation. Everything else is UI around it.

---

## Quick Commands Reference

```bash
# Dev
npm run dev

# Test banker.ts manually (paste in browser console after import)
import { runBankersAlgorithm } from './lib/banker';

# Build for production
npm run build && npm start

# Deploy
npx vercel --prod
```

---

*Focus on visualization and clarity. A clean UI with solid algorithm logic + the RAG animation will make the viva impressive.*

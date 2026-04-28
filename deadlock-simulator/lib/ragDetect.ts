/**
 * Resource Allocation Graph (RAG) Cycle Detection
 * Detects cycles using DFS (indicates potential deadlock)
 */

export interface GraphNode {
  id: string;
  type: "process" | "resource";
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "allocation" | "request"; // allocation: R→P, request: P→R
}

/**
 * Build RAG from allocation and request matrices
 * Allocation[i][j] > 0: resource j is allocated to process i (edge R_j → P_i)
 * Request: need[i][j] > 0: process i requests resource j (edge P_i → R_j)
 */
export function buildRAG(
  allocation: number[][],
  need: number[][],
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const n = allocation.length;
  const m = allocation[0]?.length || 0;

  // Add process nodes
  for (let i = 0; i < n; i++) {
    nodes.push({ id: `P${i}`, type: "process" });
  }

  // Add resource nodes
  for (let j = 0; j < m; j++) {
    nodes.push({ id: `R${j}`, type: "resource" });
  }

  // Add edges: Allocation[i][j] > 0 means R_j → P_i
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (allocation[i][j] > 0) {
        edges.push({
          source: `R${j}`,
          target: `P${i}`,
          type: "allocation",
        });
      }
    }
  }

  // Add edges: Need[i][j] > 0 means P_i → R_j
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (need[i][j] > 0) {
        edges.push({
          source: `P${i}`,
          target: `R${j}`,
          type: "request",
        });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Detect cycles in RAG using DFS
 * Returns array of node IDs involved in cycles
 */
export function detectCycles(nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const adjList = new Map<string, string[]>();
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const cycleNodes = new Set<string>();

  // Build adjacency list
  for (const node of nodes) {
    adjList.set(node.id, []);
  }
  for (const edge of edges) {
    adjList.get(edge.source)?.push(edge.target);
  }

  // DFS to detect cycles
  function dfs(nodeId: string, path: string[]): boolean {
    visited.add(nodeId);
    inStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, [...path])) {
          // Mark cycle nodes
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart >= 0) {
            path.slice(cycleStart).forEach((n) => cycleNodes.add(n));
          }
          return true;
        }
      } else if (inStack.has(neighbor)) {
        // Back edge found - cycle detected
        const cycleStart = path.indexOf(neighbor);
        if (cycleStart >= 0) {
          path.slice(cycleStart).forEach((n) => cycleNodes.add(n));
        }
        cycleNodes.add(neighbor);
        return true;
      }
    }

    inStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id, []);
    }
  }

  return Array.from(cycleNodes);
}

/**
 * Check if a process is in a deadlock (part of a cycle)
 */
export function isProcessDeadlocked(
  processId: string,
  cycleNodes: string[],
): boolean {
  return cycleNodes.includes(processId);
}

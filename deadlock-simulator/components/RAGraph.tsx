"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import useSimulatorStore from "@/store/simulatorStore";
import { buildRAG, detectCycles } from "@/lib/ragDetect";
import { computeNeed } from "@/lib/banker";

export default function RAGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const store = useSimulatorStore();
  const { config, result } = store;

  useEffect(() => {
    if (!svgRef.current) return;

    const { allocation, max } = config;
    const need = computeNeed(max, allocation);
    const { nodes, edges } = buildRAG(allocation, need);
    const cycleNodes = detectCycles(nodes, edges);

    // Set dimensions
    const width = 800;
    const height = 400;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(edges as any)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d: any) =>
        d.type === "allocation" ? "#3b82f6" : "#f97316",
      )
      .attr("stroke-width", 2)
      .attr("marker-end", (d: any) =>
        d.type === "allocation" ? "url(#arrowblue)" : "url(#arroworange)",
      )
      .attr("stroke-dasharray", (d: any) =>
        d.type === "request" ? "5,5" : "0",
      );

    // Draw nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes as any)
      .enter()
      .append("circle")
      .attr("r", (d: any) => (d.type === "process" ? 25 : 20))
      .attr("fill", (d: any) =>
        d.type === "process"
          ? cycleNodes.includes(d.id)
            ? "#ef4444"
            : "#3b82f6"
          : "#f97316",
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .call(drag(simulation) as any);

    // Draw labels
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes as any)
      .enter()
      .append("text")
      .text((d: any) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")
      .attr("fill", "#fff");

    // Add arrowheads
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowblue")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 28)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3, 0 6")
      .attr("fill", "#3b82f6");

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arroworange")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 28)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3, 0 6")
      .attr("fill", "#f97316");

    // Update on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [config]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Resource Allocation Graph
      </h2>

      <div className="bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
        <svg ref={svgRef} className="mx-auto" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500"></div>
          <span className="text-slate-700 dark:text-slate-300">
            Solid blue: Allocation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-1 bg-orange-500"
            style={{ borderBottom: "2px dashed" }}
          ></div>
          <span className="text-slate-700 dark:text-slate-300">
            Dashed orange: Request
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-slate-700 dark:text-slate-300">
            Red process: Deadlocked
          </span>
        </div>
      </div>
    </div>
  );
}

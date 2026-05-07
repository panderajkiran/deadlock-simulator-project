"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useSimulatorStore from "@/store/simulatorStore";
import { buildRAG, detectCycles } from "@/lib/ragDetect";
import { computeNeed } from "@/lib/banker";

export default function RAGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const store = useSimulatorStore();
  const { config, result } = store;
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    observer.observe(containerRef.current);
    
    // Initial size
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const { allocation, max } = config;
    const need = computeNeed(max, allocation);
    const { nodes, edges } = buildRAG(allocation, need);
    const cycleNodes = detectCycles(nodes, edges);

    const { width, height } = dimensions;
    const radius = 25;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Definitions for markers
    const defs = svg.append("defs");

    // Allocation arrow (blue)
    defs.append("marker")
      .attr("id", "arrow-allocation")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 32)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#60a5fa");

    // Request arrow (orange)
    defs.append("marker")
      .attr("id", "arrow-request")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 32)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#fb923c");

    // Create simulation with boundary constraints
    const simulation = d3
      .forceSimulation(nodes as any)
      .force("link", d3.forceLink(edges as any).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(radius * 2));

    // Draw links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d: any) => d.type === "allocation" ? "#60a5fa" : "#fb923c")
      .attr("stroke-width", 2.5)
      .attr("marker-end", (d: any) => `url(#arrow-${d.type})`)
      .attr("stroke-dasharray", (d: any) => d.type === "request" ? "6,4" : "none")
      .attr("opacity", 0.8);

    // Draw nodes
    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(nodes as any)
      .enter()
      .append("g")
      .call(drag(simulation) as any);

    nodeGroup.append("circle")
      .attr("r", radius)
      .attr("fill", (d: any) => {
        if (d.type === "process") {
          return cycleNodes.includes(d.id) ? "#ef4444" : "#3b82f6";
        }
        return "#f59e0b";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))");

    nodeGroup.append("text")
      .text((d: any) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .attr("fill", "#fff")
      .attr("pointer-events", "none");

    // Update on simulation tick with boundary constraints
    simulation.on("tick", () => {
      // Constrain nodes within box with some padding
      const padding = 25; // Additional padding so balls don't touch the edge
      const bottomPadding = 45; // Extra padding for the bottom edge
      nodes.forEach((d: any) => {
        d.x = Math.max(radius + padding, Math.min(width - radius - padding, d.x));
        d.y = Math.max(radius + padding, Math.min(height - radius - bottomPadding, d.y));
      });

      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
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
      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
    }
  }, [config, dimensions]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Resource Allocation Graph
        </h2>
        <div className="flex gap-4 text-xs">
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
             <span className="text-slate-300">Process</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded bg-[#f59e0b]"></div>
             <span className="text-slate-300">Resource</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-full bg-[#ef4444] animate-pulse"></div>
             <span className="text-red-400 font-medium">Deadlock</span>
           </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-700 grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider font-bold">
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-8 bg-[#60a5fa]"></div>
          <span className="text-slate-400">Allocation Edge (R → P)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-8 bg-[#fb923c] border-b border-dashed"></div>
          <span className="text-slate-400">Request Edge (P → R)</span>
        </div>
      </div>
    </div>
  );
}


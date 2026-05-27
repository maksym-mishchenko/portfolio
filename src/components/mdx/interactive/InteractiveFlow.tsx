"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Node,
  Edge,
  ConnectionLineType,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface InteractiveFlowProps {
  nodes: string; // JSON string: [{id, data: {label}, position: {x, y}, type?, style?}]
  edges: string; // JSON string: [{id, source, target, animated?, label?, type?}]
  height?: string;
  minimap?: boolean;
  controls?: boolean;
  interactive?: boolean; // Allow dragging nodes
  fitView?: boolean;
}

export function InteractiveFlow({
  nodes: nodesStr,
  edges: edgesStr,
  height = "500px",
  minimap = true,
  controls = true,
  interactive = true,
  fitView = true,
}: InteractiveFlowProps) {
  const initialNodes: Node[] = useMemo(() => {
    if (!nodesStr) return [];
    const parsed = JSON.parse(nodesStr);
    return parsed.map((node: any) => ({
      ...node,
      draggable: interactive,
      style: {
        background: "var(--color-surface)",
        color: "var(--color-foreground)",
        border: "2px solid var(--color-border)",
        borderRadius: "8px",
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: 500,
        ...node.style,
      },
    }));
  }, [nodesStr, interactive]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!edgesStr) return [];
    const parsed = JSON.parse(edgesStr);
    return parsed.map((edge: any) => ({
      ...edge,
      type: edge.type || "smoothstep",
      animated: edge.animated ?? true,
      style: {
        stroke: edge.animated ? "var(--color-accent)" : "var(--color-border)",
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edge.animated ? "var(--color-accent)" : "var(--color-border)",
      },
      labelStyle: {
        fill: "var(--color-foreground)",
        fontSize: "12px",
      },
      labelBgStyle: {
        fill: "var(--color-surface)",
      },
    }));
  }, [edgesStr]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div
      className="my-8 rounded-xl border border-border bg-surface/50 relative"
      style={{
        height,
        overflow: "hidden",
        isolation: "isolate",
        // Override React Flow dark-mode defaults to match site palette
        "--xy-background-color-default": "transparent",
        "--xy-node-background-color-default": "var(--color-surface)",
        "--xy-edge-label-background-color-default": "var(--color-surface)",
      } as React.CSSProperties}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={fitView}
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1.5 }}
        nodesDraggable={interactive}
        nodesConnectable={false}
        elementsSelectable={interactive}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      >
        <Background color="var(--color-border)" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}

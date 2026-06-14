"use client";

import { type CSSProperties, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ConnectionLineType,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MdxJsonError, isRecord, parseMdxJsonProp } from "./mdx-json";

interface InteractiveFlowProps {
  nodes: string; // JSON string: [{id, data: {label}, position: {x, y}, type?, style?}]
  edges: string; // JSON string: [{id, source, target, animated?, label?, type?}]
  height?: string;
  minimap?: boolean;
  controls?: boolean;
  interactive?: boolean; // Allow dragging nodes
  fitView?: boolean;
}

function isFlowNodeArray(value: unknown): value is Node[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === "string" &&
        isRecord(item.data) &&
        isRecord(item.position) &&
        typeof item.position.x === "number" &&
        typeof item.position.y === "number"
    )
  );
}

function isFlowEdgeArray(value: unknown): value is Edge[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === "string" &&
        typeof item.source === "string" &&
        typeof item.target === "string"
    )
  );
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
  const nodesResult = useMemo(
    () => parseMdxJsonProp(nodesStr, "nodes", isFlowNodeArray),
    [nodesStr]
  );
  const edgesResult = useMemo(
    () => parseMdxJsonProp(edgesStr, "edges", isFlowEdgeArray),
    [edgesStr]
  );

  const initialNodes: Node[] = useMemo(() => {
    const parsed = nodesResult.value ?? [];
    return parsed.map((node) => ({
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
  }, [nodesResult.value, interactive]);

  const initialEdges: Edge[] = useMemo(() => {
    const parsed = edgesResult.value ?? [];
    return parsed.map((edge) => ({
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
  }, [edgesResult.value]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const parseError = nodesResult.error ?? edgesResult.error;

  if (parseError) return <MdxJsonError component="InteractiveFlow" error={parseError} />;

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
      } as CSSProperties}
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
        {controls && <Controls showInteractive={interactive} />}
        {minimap && (
          <MiniMap
            pannable
            zoomable
            nodeColor="var(--color-surface)"
            maskColor="rgba(0, 0, 0, 0.35)"
          />
        )}
      </ReactFlow>
    </div>
  );
}

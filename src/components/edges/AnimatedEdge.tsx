'use client';

import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import { X } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { EDGE_CONFIG } from '@/constants/workflow';
import { cn } from '@/lib/utils';

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = selected ? EDGE_CONFIG.SELECTED_COLOR : EDGE_CONFIG.DEFAULT_COLOR;
  const strokeWidth = selected ? EDGE_CONFIG.SELECTED_WIDTH : EDGE_CONFIG.DEFAULT_WIDTH;
  const opacity = selected ? 1 : 0.85;

  return (
    <>
      {/* Base Cable Line */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          opacity,
          cursor: 'pointer',
          ...style,
        }}
      />

      {/* Synchronous SVG Data Packet Particle */}
      <circle
        r={EDGE_CONFIG.PARTICLE_RADIUS}
        fill={EDGE_CONFIG.PARTICLE_COLOR}
        style={{ filter: `drop-shadow(0 0 6px ${EDGE_CONFIG.PARTICLE_COLOR})` }}
      >
        <animateMotion path={edgePath} dur={EDGE_CONFIG.PARTICLE_ANIMATION_DURATION} repeatCount="indefinite" />
      </circle>

      {/* Edge Detach / Delete Button on Cable Midpoint */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteEdge(id);
            }}
            title="Detach / Remove Connection"
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border border-rose-500/40 bg-[#12141A] text-rose-400 shadow-lg backdrop-blur-md transition-all duration-150 hover:scale-125 hover:bg-rose-600 hover:text-white",
              selected ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

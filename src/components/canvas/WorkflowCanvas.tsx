'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '@/store/useWorkflowStore';
import {
  TriggerNode,
  AiNode,
  HttpRequestNode,
  TransformNode,
  OutputNode,
} from '@/components/nodes/CustomNodes';
import { AnimatedEdge } from '@/components/edges/AnimatedEdge';
import { useTheme } from '@/components/theme/ThemeProvider';
import { NodeType } from '@/types/workflow';
import { NODE_TYPES } from '@/constants/workflow';
import { cn } from '@/lib/utils';

// Canvas Theme Palette Tokens
const CANVAS_THEME_CONFIG = {
  dark: {
    dotColor: '#1C2030',
    bgClass: 'bg-[#090A0E]',
    maskColor: 'rgba(9, 10, 14, 0.75)',
    minimapClass: '!border-[#1C1F2B] !bg-[#12141A]/90 !rounded-xl !overflow-hidden !shadow-2xl',
  },
  light: {
    dotColor: '#CBD5E1',
    bgClass: 'bg-[#F8FAFC]',
    maskColor: 'rgba(241, 245, 249, 0.75)',
    minimapClass: '!border-slate-300 !bg-white/95 !rounded-xl !overflow-hidden !shadow-xl',
  },
} as const;

// MiniMap Color Palette by Node Type
const MINIMAP_NODE_COLORS: Record<NodeType, string> = {
  [NODE_TYPES.TRIGGER]: '#F59E0B',
  [NODE_TYPES.AI_PROMPT]: '#6366F1',
  [NODE_TYPES.HTTP_REQUEST]: '#06B6D4',
  [NODE_TYPES.TRANSFORM]: '#10B981',
  [NODE_TYPES.OUTPUT]: '#EC4899',
};

export function WorkflowCanvas() {
  const { theme, isDark } = useTheme();
  const themeConfig = isDark ? CANVAS_THEME_CONFIG.dark : CANVAS_THEME_CONFIG.light;

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    selectNode,
    selectEdge,
  } = useWorkflowStore();

  // Register Custom Node Types
  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      [NODE_TYPES.TRIGGER]: TriggerNode,
      [NODE_TYPES.AI_PROMPT]: AiNode,
      [NODE_TYPES.HTTP_REQUEST]: HttpRequestNode,
      [NODE_TYPES.TRANSFORM]: TransformNode,
      [NODE_TYPES.OUTPUT]: OutputNode,
    }),
    []
  );

  // Register Custom Edge Types (Framer Motion Cable Connections with Detach Button)
  const edgeTypes = useMemo<EdgeTypes>(
    () => ({
      default: AnimatedEdge,
      animatedEdge: AnimatedEdge,
    }),
    []
  );

  return (
    <div className={cn("relative h-full w-full bg-[#090A0E] dark:bg-[#090A0E] light:bg-[#F8FAFC] overflow-hidden")}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        reconnectRadius={20}
        onNodeClick={(_, node) => selectNode(node.id)}
        onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => {
          selectNode(null);
          selectEdge(null);
        }}
        fitView
        colorMode={theme}
        defaultEdgeOptions={{
          type: 'animatedEdge',
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color={themeConfig.dotColor}
          className={cn(themeConfig.bgClass)}
        />

        <Controls
          className={cn("!border-[#1C1F2B] !bg-[#12141A]/90 !text-slate-300 !shadow-2xl !backdrop-blur-md")}
        />

        <MiniMap
          nodeColor={(n) => MINIMAP_NODE_COLORS[n.type as NodeType] || MINIMAP_NODE_COLORS.output}
          maskColor={themeConfig.maskColor}
          className={cn(themeConfig.minimapClass)}
        />
      </ReactFlow>
    </div>
  );
}



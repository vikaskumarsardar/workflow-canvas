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

export function WorkflowCanvas() {
  const { theme } = useTheme();
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
      trigger: TriggerNode,
      ai_prompt: AiNode,
      http_request: HttpRequestNode,
      transform: TransformNode,
      output: OutputNode,
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
    <div className="relative h-full w-full bg-[#090A0E] dark:bg-[#090A0E] light:bg-[#F8FAFC] overflow-hidden">
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
          color={theme === 'dark' ? '#1C2030' : '#CBD5E1'}
          className={theme === 'dark' ? 'bg-[#090A0E]' : 'bg-[#F8FAFC]'}
        />

        <Controls
          className="!border-[#1C1F2B] !bg-[#12141A]/90 !text-slate-300 !shadow-2xl !backdrop-blur-md"
        />

        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'trigger') return '#F59E0B';
            if (n.type === 'ai_prompt') return '#6366F1';
            if (n.type === 'http_request') return '#06B6D4';
            if (n.type === 'transform') return '#10B981';
            return '#EC4899';
          }}
          maskColor={theme === 'dark' ? 'rgba(9, 10, 14, 0.75)' : 'rgba(241, 245, 249, 0.75)'}
          className={
            theme === 'dark'
              ? '!border-[#1C1F2B] !bg-[#12141A]/90 !rounded-xl !overflow-hidden !shadow-2xl'
              : '!border-slate-300 !bg-white/95 !rounded-xl !overflow-hidden !shadow-xl'
          }
        />
      </ReactFlow>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Bot, Globe, Sliders, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { NodeType } from '@/types/workflow';

const nodeTemplates: {
  type: NodeType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}[] = [
  {
    type: 'trigger',
    title: 'Event Trigger',
    description: 'Webhook, Cron or API event listener',
    icon: Zap,
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/10 hover:border-amber-500/40',
    badge: 'START',
  },
  {
    type: 'ai_prompt',
    title: 'AI Agent Processor',
    description: 'GPT-4o or Claude prompt agent',
    icon: Bot,
    color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10 hover:border-indigo-500/40',
    badge: 'AI',
  },
  {
    type: 'http_request',
    title: 'HTTP Request',
    description: 'External REST API GET/POST dispatch',
    icon: Globe,
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10 hover:border-cyan-500/40',
    badge: 'API',
  },
  {
    type: 'transform',
    title: 'Data Mapper',
    description: 'JSON transform script & filter',
    icon: Sliders,
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:border-emerald-500/40',
    badge: 'MAPPER',
  },
  {
    type: 'output',
    title: 'Debug Inspector',
    description: 'Output preview & audit logger',
    icon: CheckCircle2,
    color: 'text-pink-400 border-pink-500/20 bg-pink-500/10 hover:border-pink-500/40',
    badge: 'OUTPUT',
  },
];

export function NodeLibrary() {
  const addNode = useWorkflowStore((s) => s.addNode);

  const handleAdd = (type: NodeType) => {
    const position = {
      x: 320,
      y: 180,
    };
    addNode(type, position);
  };

  return (
    <aside className="z-20 flex w-72 flex-col border-r border-[#1C1F2B] bg-[#0D0E12] p-4 text-slate-200">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Node Catalog
          </h2>
        </div>
        <span className="rounded bg-[#181B26] px-1.5 py-0.5 font-mono text-[10px] text-slate-500 border border-[#232738]">
          5 Nodes
        </span>
      </div>

      <p className="mb-4 text-xs text-slate-500 leading-normal">
        Click or spawn nodes to build multi-stage automated pipelines.
      </p>

      {/* Node Templates List */}
      <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
        {nodeTemplates.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.type}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAdd(item.type)}
              className="group flex flex-col gap-2 rounded-xl border border-[#1C1F2B] bg-[#12141A] p-3 text-left transition-all hover:border-slate-700 hover:bg-[#161922] hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${item.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-white">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded border border-[#262B3D] bg-[#181B26] px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                    {item.badge}
                  </span>
                  <Plus className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-indigo-400" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}

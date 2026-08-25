'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Sparkles,
  Workflow,
  Layers,
  Terminal,
  ChevronDown,
  Plus,
  Trash2,
  FolderKanban,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useTheme } from '@/components/theme/ThemeProvider';

export function Header({ onOpenLogs }: { onOpenLogs: () => void }) {
  const {
    flows,
    activeFlowId,
    nodes,
    edges,
    isExecuting,
    runWorkflow,
    clearCanvas,
    executionLogs,
    switchFlow,
    createNewFlow,
    deleteFlow,
  } = useWorkflowStore();

  const { theme, toggleTheme } = useTheme();

  const [isFlowDropdownOpen, setIsFlowDropdownOpen] = useState(false);
  const activeFlow = flows.find((f) => f.id === activeFlowId) || flows[0];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#1C1F2B] bg-[#0B0C0E]/90 px-6 backdrop-blur-md">
      {/* Brand & Multi-Flow Switcher Dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-md">
            <Workflow className="h-4 w-4" />
          </div>
          <h1 className="text-sm font-semibold text-slate-100 tracking-tight hidden sm:block">
            AI Pipeline Studio
          </h1>
        </div>

        <div className="h-4 w-px bg-[#1C1F2B] hidden sm:block" />

        {/* Multi-Flow Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFlowDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-[#1C1F2B] bg-[#12141A] px-3 py-1.5 text-xs text-slate-200 transition-all hover:border-slate-700 hover:bg-[#181B24]"
          >
            <FolderKanban className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold max-w-[160px] truncate">{activeFlow.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>

          <AnimatePresence>
            {isFlowDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-[#1C1F2B] bg-[#0E1018] p-2 shadow-2xl backdrop-blur-xl z-50 text-xs"
              >
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#1C1F2B] mb-1">
                  <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                    My Flow Canvases ({flows.length})
                  </span>
                  <button
                    onClick={() => {
                      createNewFlow();
                      setIsFlowDropdownOpen(false);
                    }}
                    className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <Plus className="h-3 w-3" />
                    <span>New Flow</span>
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1">
                  {flows.map((flow) => (
                    <div
                      key={flow.id}
                      onClick={() => {
                        switchFlow(flow.id);
                        setIsFlowDropdownOpen(false);
                      }}
                      className={`group flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${
                        flow.id === activeFlowId
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : 'text-slate-300 hover:bg-[#161824]'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          {flow.id === activeFlowId && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                          <span className="font-medium truncate">{flow.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 truncate">{flow.description}</span>
                      </div>

                      {flows.length > 1 && flow.id === activeFlowId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFlow(flow.id);
                            setIsFlowDropdownOpen(false);
                          }}
                          title="Delete Flow"
                          className="text-slate-600 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Counter Badges */}
      <div className="hidden items-center gap-4 md:flex">
        <div className="flex items-center gap-1.5 rounded-lg border border-[#1C1F2B] bg-[#12141A] px-3 py-1 text-xs text-slate-400">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>Nodes: <strong className="text-slate-200">{nodes.length}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-[#1C1F2B] bg-[#12141A] px-3 py-1 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Edges: <strong className="text-slate-200">{edges.length}</strong></span>
        </div>
        <button
          onClick={onOpenLogs}
          className="flex items-center gap-1.5 rounded-lg border border-[#1C1F2B] bg-[#12141A] px-3 py-1 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
        >
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          <span>Logs: <strong className="text-slate-200">{executionLogs.length}</strong></span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Theme Mode Toggle (Sun/Moon) */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="flex items-center justify-center rounded-lg border border-[#1C1F2B] bg-[#12141A] p-2 text-slate-400 transition-all hover:border-indigo-500/40 hover:bg-[#181B24] hover:text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-400" />}
        </button>

        <button
          onClick={clearCanvas}
          className="flex items-center gap-1.5 rounded-lg border border-[#1C1F2B] bg-[#12141A] px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runWorkflow}
          disabled={isExecuting}
          className={`flex items-center gap-2 rounded-lg border px-4 py-1.5 text-xs font-semibold shadow-lg transition-all ${
            isExecuting
              ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400 opacity-70 cursor-not-allowed'
              : 'border-indigo-500/40 bg-indigo-600 text-white shadow-indigo-600/25 hover:bg-indigo-500'
          }`}
        >
          <Play className={`h-3.5 w-3.5 ${isExecuting ? 'animate-spin' : 'fill-white'}`} />
          <span>{isExecuting ? 'Executing Workflow...' : 'Run Pipeline'}</span>
          <kbd className="hidden rounded bg-indigo-700/50 px-1.5 py-0.5 text-[9px] font-mono font-normal text-indigo-200 md:inline-block">
            ⌘R
          </kbd>
        </motion.button>
      </div>
    </header>
  );
}

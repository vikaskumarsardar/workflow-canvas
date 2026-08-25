'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';

export function ExecutionLogsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { executionLogs } = useWorkflowStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          className="flex h-[500px] w-full max-w-2xl flex-col rounded-2xl border border-[#1C1F2B] bg-[#0C0E14] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1C1F2B] px-5 py-3.5 bg-[#12141C]">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200">Execution Telemetry Stream</h3>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-400 border border-cyan-500/20">
                {executionLogs.length} Events
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-[#1C1F2B] hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Log Stream Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs bg-[#08090E]">
            {executionLogs.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-500 gap-2">
                <Terminal className="h-8 w-8 text-slate-600" />
                <p className="text-xs">No execution events recorded yet. Click &quot;Run Pipeline&quot; to trigger stream.</p>
              </div>
            ) : (
              executionLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-lg border border-[#161824] bg-[#0E1018] p-2.5 transition-colors hover:border-slate-800"
                >
                  <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>

                  {log.status === 'success' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {log.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  {log.status === 'info' && (
                    <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-300 mr-2">[{log.nodeLabel}]</span>
                    <span className="text-slate-400">{log.message}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

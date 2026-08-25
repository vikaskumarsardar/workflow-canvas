'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Header } from '@/components/layout/Header';
import { NodeLibrary } from '@/components/sidebar/NodeLibrary';
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { ExecutionLogsModal } from '@/components/logs/ExecutionLogsModal';
import { useWorkflowStore } from '@/store/useWorkflowStore';

const emptySubscribe = () => () => {};

export default function HomePage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const runWorkflow = useWorkflowStore((s) => s.runWorkflow);

  // Global Keyboard Shortcuts (⌘R / Ctrl+R to run, ⌘K for logs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        runWorkflow();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsLogsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runWorkflow]);

  if (!isMounted) {
    return <div className="flex h-screen w-screen bg-[#090A0E]" />;
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-[#090A0E] text-slate-100 overflow-hidden select-none">
      {/* Top Header Navigation */}
      <Header onOpenLogs={() => setIsLogsOpen(true)} />

      {/* Main Canvas Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Palette */}
        <NodeLibrary />

        {/* Interactive React Flow Canvas */}
        <main className="flex-1 relative h-full w-full">
          <WorkflowCanvas />
        </main>

        {/* Dynamic Node Inspector Drawer */}
        <NodeInspector />
      </div>

      {/* Execution Telemetry Stream Modal */}
      <ExecutionLogsModal isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} />
    </div>
  );
}

'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Zap, Bot, Globe, Sliders, CheckCircle2, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import { WorkflowNodeData } from '@/types/workflow';
import { NODE_STATUS, BADGE_THEMES, DEFAULT_CONFIGS } from '@/constants/workflow';
import { cn } from '@/lib/utils';

type CustomNodeProps = NodeProps<Node<WorkflowNodeData>>;

// Node Wrapper Shell with Linear 1px dark aesthetic (KISS & Colocation principles)
function NodeShell({
  title,
  icon: Icon,
  badge,
  badgeColor = BADGE_THEMES.DEFAULT,
  selected,
  status,
  children,
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  selected?: boolean;
  status: WorkflowNodeData['status'];
  children?: React.ReactNode;
}) {
  const isRunning = status === NODE_STATUS.RUNNING;
  const isSuccess = status === NODE_STATUS.SUCCESS;
  const isError = status === NODE_STATUS.ERROR;
  const isIdle = status === NODE_STATUS.IDLE;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative min-w-[260px] rounded-xl border bg-[#12141A]/95 p-4 shadow-2xl backdrop-blur-xl transition-colors duration-200",
        selected
          ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10"
          : isRunning
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-[#1E2230] hover:border-slate-700"
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[#1E2230] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#1A1D26] text-indigo-400 shadow-inner">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-mono font-medium", badgeColor)}>
              {badge}
            </span>
          )}

          {/* Execution Status Indicators (POUR Perceivable & Operable) */}
          {isRunning && <Loader2 className="h-4 w-4 animate-spin text-emerald-400" aria-label="Status: Running" />}
          {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-label="Status: Success" />}
          {isError && <AlertCircle className="h-4 w-4 text-rose-400" aria-label="Status: Error" />}
          {isIdle && <div className="h-2 w-2 rounded-full bg-slate-600" aria-label="Status: Idle" />}
        </div>
      </div>

      {/* Body Content */}
      <div className="text-xs text-slate-400 leading-relaxed">{children}</div>
    </motion.div>
  );
}

// 1. Trigger Node
export const TriggerNode = memo(({ data, selected }: CustomNodeProps) => {
  const [copied, setCopied] = React.useState(false);
  const triggerBadge = data.config?.triggerType?.toUpperCase() || 'WEBHOOK';
  const webhookUrl = data.config?.url || DEFAULT_CONFIGS.WEBHOOK_URL;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), DEFAULT_CONFIGS.COPY_FEEDBACK_DELAY_MS);
  };

  return (
    <>
      <NodeShell
        title={data.label}
        icon={Zap}
        badge={triggerBadge}
        badgeColor={BADGE_THEMES.TRIGGER}
        selected={selected}
        status={data.status}
      >
        <p className="line-clamp-2">{data.description}</p>
        <div className="mt-2.5 flex items-center justify-between gap-1.5 font-mono text-[10px] text-slate-400 bg-[#0B0C0E] px-2 py-1.5 rounded border border-[#1C1F2B] group/url">
          <span className="truncate flex-1 text-amber-300/90" title={webhookUrl}>{webhookUrl}</span>
          <button
            onClick={handleCopy}
            aria-label={copied ? "Copied endpoint URL to clipboard" : "Copy Live Endpoint URL"}
            className="text-slate-500 hover:text-slate-200 transition-colors p-0.5 rounded hover:bg-[#1E2230] focus:outline-none focus:ring-1 focus:ring-amber-500"
            title="Copy Live Endpoint URL"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
          </button>
        </div>
      </NodeShell>
      <Handle
        type="source"
        position={Position.Right}
        aria-label="Trigger Output Port"
        className="!h-3 !w-3 !bg-amber-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
    </>
  );
});
TriggerNode.displayName = 'TriggerNode';

// 2. AI Prompt Node
export const AiNode = memo(({ data, selected }: CustomNodeProps) => {
  const modelBadge = data.config?.model || DEFAULT_CONFIGS.LLM_MODEL.toUpperCase();
  const temperature = data.config?.temperature ?? DEFAULT_CONFIGS.TEMPERATURE;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        aria-label="AI Agent Input Port"
        className="!h-3 !w-3 !bg-indigo-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
      <NodeShell
        title={data.label}
        icon={Bot}
        badge={modelBadge}
        badgeColor={BADGE_THEMES.AI}
        selected={selected}
        status={data.status}
      >
        <p className="line-clamp-2">{data.description}</p>
        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Temp: {temperature}</span>
          <span className="text-indigo-400 font-semibold">Streaming Ready</span>
        </div>
      </NodeShell>
      <Handle
        type="source"
        position={Position.Right}
        aria-label="AI Agent Output Port"
        className="!h-3 !w-3 !bg-indigo-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
    </>
  );
});
AiNode.displayName = 'AiNode';

// 3. HTTP Request Node
export const HttpRequestNode = memo(({ data, selected }: CustomNodeProps) => {
  const httpMethod = data.config?.method || DEFAULT_CONFIGS.HTTP_METHOD;
  const endpointUrl = data.config?.url || DEFAULT_CONFIGS.EXTERNAL_API_URL;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        aria-label="HTTP Input Port"
        className="!h-3 !w-3 !bg-cyan-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
      <NodeShell
        title={data.label}
        icon={Globe}
        badge={httpMethod}
        badgeColor={BADGE_THEMES.HTTP}
        selected={selected}
        status={data.status}
      >
        <p className="line-clamp-2">{data.description}</p>
        <div className="mt-2.5 font-mono text-[10px] text-slate-500 truncate bg-[#0B0C0E] px-2 py-1 rounded border border-[#1C1F2B]">
          {endpointUrl}
        </div>
      </NodeShell>
      <Handle
        type="source"
        position={Position.Right}
        aria-label="HTTP Output Port"
        className="!h-3 !w-3 !bg-cyan-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
    </>
  );
});
HttpRequestNode.displayName = 'HttpRequestNode';

// 4. Transform Node
export const TransformNode = memo(({ data, selected }: CustomNodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        aria-label="Transform Input Port"
        className="!h-3 !w-3 !bg-emerald-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
      <NodeShell
        title={data.label}
        icon={Sliders}
        badge="MAPPER"
        badgeColor={BADGE_THEMES.TRANSFORM}
        selected={selected}
        status={data.status}
      >
        <p className="line-clamp-2">{data.description}</p>
      </NodeShell>
      <Handle
        type="source"
        position={Position.Right}
        aria-label="Transform Output Port"
        className="!h-3 !w-3 !bg-emerald-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
    </>
  );
});
TransformNode.displayName = 'TransformNode';

// 5. Output Node
export const OutputNode = memo(({ data, selected }: CustomNodeProps) => {
  const jsonOutput = data.config?.outputJson || DEFAULT_CONFIGS.DEFAULT_OUTPUT_JSON;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        aria-label="Output Input Port"
        className="!h-3 !w-3 !bg-pink-400 !border-2 !border-[#12141A] transition-transform hover:scale-125"
      />
      <NodeShell
        title={data.label}
        icon={CheckCircle2}
        badge="AUDIT LOG"
        badgeColor={BADGE_THEMES.OUTPUT}
        selected={selected}
        status={data.status}
      >
        <p className="line-clamp-2 mb-2">{data.description}</p>
        <pre className="max-h-20 overflow-hidden font-mono text-[9px] text-emerald-400/90 bg-[#08090C] p-2 rounded border border-[#1C1F2B]">
          {jsonOutput}
        </pre>
      </NodeShell>
    </>
  );
});
OutputNode.displayName = 'OutputNode';

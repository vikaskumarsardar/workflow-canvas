'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, SlidersHorizontal, Code2, Globe, Bot, Zap, Copy, Check, Terminal } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { NODE_TYPES, DEFAULT_CONFIGS } from '@/constants/workflow';

export function NodeInspector() {
  const { nodes, selectedNodeId, selectNode, updateNodeData, deleteNode } = useWorkflowStore();
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [copiedCurl, setCopiedCurl] = React.useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const data = selectedNode.data;

  // Clean boolean node type indicators
  const isTriggerNode = selectedNode.type === NODE_TYPES.TRIGGER;
  const isAiNode = selectedNode.type === NODE_TYPES.AI_PROMPT;
  const isHttpRequestNode = selectedNode.type === NODE_TYPES.HTTP_REQUEST;
  const isOutputNode = selectedNode.type === NODE_TYPES.OUTPUT;

  const webhookUrl = data.config.url || DEFAULT_CONFIGS.WEBHOOK_URL;
  const curlSnippet = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{"event":"payment_intent.succeeded","amount":4900,"currency":"usd"}'`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), DEFAULT_CONFIGS.COPY_FEEDBACK_DELAY_MS);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), DEFAULT_CONFIGS.COPY_FEEDBACK_DELAY_MS);
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="w-80 border-l border-[#1C1F2B] bg-[#12141A]/95 p-4 shadow-2xl backdrop-blur-xl h-full flex flex-col z-20"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C1F2B] pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-100">Node Inspector</h2>
          </div>
          <button
            onClick={() => selectNode(null)}
            className="rounded p-1 text-slate-400 hover:bg-[#1E2230] hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
          {/* General Properties */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Node Title</label>
              <input
                type="text"
                value={data.label}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                className="w-full rounded border border-[#1C1F2B] bg-[#0B0C0E] px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Description</label>
              <textarea
                rows={2}
                value={data.description || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                className="w-full rounded border border-[#1C1F2B] bg-[#0B0C0E] p-2 text-slate-300 focus:border-indigo-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Node Specific Form Layouts */}
          {isTriggerNode && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-3">
              <div className="flex items-center justify-between text-amber-400 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Webhook Endpoint Config</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE API
                </span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-slate-400">Endpoint URL</label>
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {copiedUrl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, url: e.target.value },
                    })
                  }
                  className="w-full rounded border border-[#1C1F2B] bg-[#0B0C0E] px-2.5 py-1.5 font-mono text-[11px] text-amber-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* cURL Live Test Snippet */}
              <div className="pt-2 border-t border-amber-500/10">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <Terminal className="h-3 w-3 text-slate-400" />
                    <span>Test Webhook via cURL</span>
                  </div>
                  <button
                    onClick={handleCopyCurl}
                    className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedCurl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCurl ? 'Copied!' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-2 rounded bg-[#07080B] border border-[#1C1F2B] text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap select-all">
                  {curlSnippet}
                </pre>
              </div>
            </div>
          )}

          {isAiNode && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 space-y-3">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Bot className="h-3.5 w-3.5" />
                <span>AI Agent Configuration</span>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">LLM Model</label>
                <select
                  value={data.config.model || DEFAULT_CONFIGS.LLM_MODEL}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, model: e.target.value as 'gpt-4o' | 'claude-3-5-sonnet' | 'llama-3' },
                    })
                  }
                  className="w-full rounded border border-[#1C1F2B] bg-[#0B0C0E] px-2.5 py-1.5 font-mono text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                  <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="llama-3">Meta Llama 3 70B</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">System Prompt</label>
                <textarea
                  rows={3}
                  value={data.config.systemPrompt || ''}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, systemPrompt: e.target.value },
                    })
                  }
                  className="w-full rounded border border-[#1C1F2B] bg-[#0B0C0E] p-2 text-slate-200 font-mono text-[11px] focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Temperature</span>
                  <span className="font-mono text-indigo-400">{data.config.temperature ?? DEFAULT_CONFIGS.TEMPERATURE}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={data.config.temperature ?? DEFAULT_CONFIGS.TEMPERATURE}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, temperature: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          )}

          {isHttpRequestNode && (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 space-y-3">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Globe className="h-3.5 w-3.5" />
                <span>HTTP Dispatcher</span>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">HTTP Method</label>
                <select
                  value={data.config.method || DEFAULT_CONFIGS.HTTP_METHOD}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, method: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' },
                    })
                  }
                  className="w-full rounded border border-[#1C1F2B] bg-[#0B0C0E] px-2.5 py-1.5 font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Target Endpoint</label>
                <input
                  type="text"
                  value={data.config.url || ''}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, url: e.target.value },
                    })
                  }
                  className="w-full rounded border border-[#1C1F2B] bg-[#0B0C0E] px-2.5 py-1.5 font-mono text-[11px] text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {isOutputNode && (
            <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-3 space-y-3">
              <div className="flex items-center gap-1.5 text-pink-400 font-semibold">
                <Code2 className="h-3.5 w-3.5" />
                <span>JSON Payload Preview</span>
              </div>
              <textarea
                rows={5}
                value={data.config.outputJson || ''}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, {
                    config: { ...data.config, outputJson: e.target.value },
                  })
                }
                className="w-full rounded border border-[#1C1F2B] bg-[#08090C] p-2.5 font-mono text-[10px] text-emerald-400 focus:border-pink-500 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#1C1F2B] pt-4 mt-auto">
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Node</span>
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

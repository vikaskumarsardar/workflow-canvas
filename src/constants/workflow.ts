import { NodeType, NodeStatus } from '@/types/workflow';

// Node Types Registry
export const NODE_TYPES = {
  TRIGGER: 'trigger',
  AI_PROMPT: 'ai_prompt',
  HTTP_REQUEST: 'http_request',
  TRANSFORM: 'transform',
  OUTPUT: 'output',
} as const satisfies Record<string, NodeType>;

// Execution Statuses
export const NODE_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  SUCCESS: 'success',
  ERROR: 'error',
} as const satisfies Record<string, NodeStatus>;

// Default Node Type Labels
export const DEFAULT_NODE_LABELS: Record<NodeType, string> = {
  trigger: 'Event Trigger',
  ai_prompt: 'AI Agent Processor',
  http_request: 'HTTP API Call',
  transform: 'JSON Data Mapper',
  output: 'Debug Inspector',
};

// Centralized Badge Color Themes
export const BADGE_THEMES = {
  DEFAULT: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  TRIGGER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  AI: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  HTTP: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  TRANSFORM: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  OUTPUT: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
} as const;

// Edge Cable Styling Constants
export const EDGE_CONFIG = {
  SELECTED_COLOR: '#818CF8',
  DEFAULT_COLOR: '#6366F1',
  SELECTED_WIDTH: 3,
  DEFAULT_WIDTH: 2,
  PARTICLE_COLOR: '#38BDF8',
  PARTICLE_RADIUS: 4,
  PARTICLE_ANIMATION_DURATION: '2.5s',
  RECONNECT_RADIUS: 20,
} as const;

// Default Configurations & Fallbacks
export const DEFAULT_CONFIGS = {
  WEBHOOK_URL: 'http://localhost:3005/api/v1/webhooks/flow-1',
  EXTERNAL_API_URL: 'https://api.external.com',
  LLM_MODEL: 'gpt-4o' as const,
  TEMPERATURE: 0.7,
  HTTP_METHOD: 'POST' as const,
  DEFAULT_OUTPUT_JSON: JSON.stringify({ status: 'success' }, null, 2),
  EXECUTION_STEP_DELAY_MS: 800,
  EXECUTION_RESET_DELAY_MS: 1500,
  COPY_FEEDBACK_DELAY_MS: 2000,
} as const;

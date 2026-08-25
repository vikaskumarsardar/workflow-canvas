export type NodeType = 'trigger' | 'ai_prompt' | 'http_request' | 'transform' | 'output';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  status: NodeStatus;
  config: {
    // Trigger config
    triggerType?: 'webhook' | 'schedule' | 'manual';
    scheduleCron?: string;
    
    // AI config
    model?: 'gpt-4o' | 'claude-3-5-sonnet' | 'llama-3';
    systemPrompt?: string;
    temperature?: number;
    
    // HTTP config
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    
    // Transform config
    script?: string;
    
    // Output config
    outputJson?: string;
  };
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  status: 'info' | 'success' | 'error';
  message: string;
}

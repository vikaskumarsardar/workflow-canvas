import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  reconnectEdge,
} from '@xyflow/react';
import { WorkflowNodeData, ExecutionLog, NodeType } from '@/types/workflow';
import { NODE_STATUS, DEFAULT_NODE_LABELS, DEFAULT_CONFIGS, NODE_TYPES } from '@/constants/workflow';

type WorkflowNode = Node<WorkflowNodeData>;

export interface SavedFlow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: Edge[];
}

const defaultFlows: SavedFlow[] = [
  {
    id: 'flow-1',
    name: 'Stripe Payment Fraud Pipeline',
    description: 'Real-time transaction risk scoring with AI & Slack alerts',
    nodes: [
      {
        id: 'node-1',
        type: NODE_TYPES.TRIGGER,
        position: { x: 80, y: 180 },
        data: {
          label: 'Webhook Trigger',
          description: 'Listens for incoming Stripe payment events',
          status: NODE_STATUS.IDLE,
          config: { triggerType: 'webhook', url: DEFAULT_CONFIGS.WEBHOOK_URL },
        },
      },
      {
        id: 'node-2',
        type: NODE_TYPES.AI_PROMPT,
        position: { x: 420, y: 150 },
        data: {
          label: 'AI Fraud Analyzer',
          description: 'Evaluates transaction risk score using GPT-4o',
          status: NODE_STATUS.IDLE,
          config: {
            model: 'gpt-4o',
            systemPrompt: 'Analyze event payload for fraudulent transaction patterns.',
            temperature: 0.2,
          },
        },
      },
      {
        id: 'node-3',
        type: NODE_TYPES.HTTP_REQUEST,
        position: { x: 780, y: 120 },
        data: {
          label: 'Dispatch Slack Alert',
          description: 'Post high-risk alerts to #security-ops',
          status: NODE_STATUS.IDLE,
          config: { method: 'POST', url: 'https://hooks.slack.com/services/T00/B00/X00' },
        },
      },
      {
        id: 'node-4',
        type: NODE_TYPES.OUTPUT,
        position: { x: 1140, y: 180 },
        data: {
          label: 'Audit Inspector',
          description: 'Stores normalized audit log JSON',
          status: NODE_STATUS.IDLE,
          config: {
            outputJson: JSON.stringify(
              { event: 'payment.flagged', riskScore: 0.94, status: 'ACTION_REQUIRED' },
              null,
              2
            ),
          },
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', type: 'animatedEdge' },
      { id: 'e2-3', source: 'node-2', target: 'node-3', type: 'animatedEdge' },
      { id: 'e3-4', source: 'node-3', target: 'node-4', type: 'animatedEdge' },
    ],
  },
  {
    id: 'flow-2',
    name: 'Customer Onboarding LLM Agent',
    description: 'Automated user welcome email & AI profiling',
    nodes: [
      {
        id: 'node-201',
        type: NODE_TYPES.TRIGGER,
        position: { x: 100, y: 200 },
        data: {
          label: 'User Signup Event',
          description: 'Triggers when a new account is registered',
          status: NODE_STATUS.IDLE,
          config: { triggerType: 'webhook', url: 'https://auth.domain.com/v1/signup' },
        },
      },
      {
        id: 'node-202',
        type: NODE_TYPES.AI_PROMPT,
        position: { x: 480, y: 200 },
        data: {
          label: 'Personalized Email Agent',
          description: 'Generates custom welcome onboarding copy',
          status: NODE_STATUS.IDLE,
          config: {
            model: 'claude-3-5-sonnet',
            systemPrompt: 'Generate friendly welcome message tailored to user role.',
            temperature: 0.7,
          },
        },
      },
      {
        id: 'node-203',
        type: NODE_TYPES.OUTPUT,
        position: { x: 860, y: 200 },
        data: {
          label: 'Email Queue Dispatcher',
          description: 'Queues email job for Resend API',
          status: NODE_STATUS.IDLE,
          config: {
            outputJson: JSON.stringify(
              { template: 'welcome_v2', recipient: 'newuser@company.com', status: 'QUEUED' },
              null,
              2
            ),
          },
        },
      },
    ],
    edges: [
      { id: 'e201-202', source: 'node-201', target: 'node-202', type: 'animatedEdge' },
      { id: 'e202-203', source: 'node-202', target: 'node-203', type: 'animatedEdge' },
    ],
  },
];

interface WorkflowState {
  flows: SavedFlow[];
  activeFlowId: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isExecuting: boolean;
  executionLogs: ExecutionLog[];
  
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  deleteEdge: (edgeId: string) => void;
  
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  
  switchFlow: (flowId: string) => void;
  createNewFlow: (name?: string) => void;
  deleteFlow: (flowId: string) => void;
  
  runWorkflow: () => Promise<void>;
  clearCanvas: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  flows: defaultFlows,
  activeFlowId: defaultFlows[0].id,
  nodes: defaultFlows[0].nodes,
  edges: defaultFlows[0].edges,
  selectedNodeId: null,
  selectedEdgeId: null,
  isExecuting: false,
  executionLogs: [],

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    const newEdge: Edge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      type: 'animatedEdge',
    };
    set({
      edges: addEdge(newEdge, get().edges),
    });
  },

  onReconnect: (oldEdge: Edge, newConnection: Connection) => {
    set({
      edges: reconnectEdge(oldEdge, newConnection, get().edges),
    });
  },

  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null });
  },

  selectEdge: (edgeId: string | null) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
  },

  deleteEdge: (edgeId: string) => {
    set({
      edges: get().edges.filter((e) => e.id !== edgeId),
      selectedEdgeId: get().selectedEdgeId === edgeId ? null : get().selectedEdgeId,
    });
  },

  addNode: (type: NodeType, position: { x: number; y: number }) => {
    const id = `node-${Date.now()}`;
    const nodeTitle = DEFAULT_NODE_LABELS[type] || 'New Pipeline Node';

    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data: {
        label: nodeTitle,
        description: `Configured ${type} pipeline node`,
        status: NODE_STATUS.IDLE,
        config: {
          ...(type === NODE_TYPES.TRIGGER && { triggerType: 'webhook', url: DEFAULT_CONFIGS.WEBHOOK_URL }),
          ...(type === NODE_TYPES.AI_PROMPT && { model: DEFAULT_CONFIGS.LLM_MODEL, systemPrompt: 'Process payload', temperature: DEFAULT_CONFIGS.TEMPERATURE }),
          ...(type === NODE_TYPES.HTTP_REQUEST && { method: DEFAULT_CONFIGS.HTTP_METHOD, url: DEFAULT_CONFIGS.EXTERNAL_API_URL }),
          ...(type === NODE_TYPES.OUTPUT && { outputJson: DEFAULT_CONFIGS.DEFAULT_OUTPUT_JSON }),
        },
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: id,
    });
  },

  updateNodeData: (nodeId: string, patch: Partial<WorkflowNodeData>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...patch,
              config: {
                ...node.data.config,
                ...patch.config,
              },
            },
          };
        }
        return node;
      }),
    });
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  switchFlow: (flowId: string) => {
    const currentActive = get().activeFlowId;
    const currentNodes = get().nodes;
    const currentEdges = get().edges;

    const updatedFlows = get().flows.map((f) =>
      f.id === currentActive ? { ...f, nodes: currentNodes, edges: currentEdges } : f
    );

    const targetFlow = updatedFlows.find((f) => f.id === flowId);
    if (!targetFlow) return;

    set({
      flows: updatedFlows,
      activeFlowId: flowId,
      nodes: targetFlow.nodes,
      edges: targetFlow.edges,
      selectedNodeId: null,
      selectedEdgeId: null,
      executionLogs: [],
    });
  },

  createNewFlow: (name?: string) => {
    const newId = `flow-${Date.now()}`;
    const flowName = name || `Custom Pipeline #${get().flows.length + 1}`;
    const newFlow: SavedFlow = {
      id: newId,
      name: flowName,
      description: 'Custom user pipeline canvas',
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          type: NODE_TYPES.TRIGGER,
          position: { x: 150, y: 180 },
          data: {
            label: 'API Event Entry',
            description: 'Custom trigger node',
            status: NODE_STATUS.IDLE,
            config: { triggerType: 'webhook', url: DEFAULT_CONFIGS.WEBHOOK_URL },
          },
        },
      ],
      edges: [],
    };

    set({
      flows: [...get().flows, newFlow],
      activeFlowId: newId,
      nodes: newFlow.nodes,
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      executionLogs: [],
    });
  },

  deleteFlow: (flowId: string) => {
    const MIN_FLOW_COUNT = 1;
    if (get().flows.length <= MIN_FLOW_COUNT) return;
    const remaining = get().flows.filter((f) => f.id !== flowId);
    const fallback = remaining[0];

    set({
      flows: remaining,
      activeFlowId: fallback.id,
      nodes: fallback.nodes,
      edges: fallback.edges,
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null, executionLogs: [] });
  },

  runWorkflow: async () => {
    if (get().isExecuting) return;
    set({ isExecuting: true, executionLogs: [] });

    const nodes = get().nodes;
    const addLog = (nodeId: string, nodeLabel: string, status: 'info' | 'success' | 'error', message: string) => {
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const log: ExecutionLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp,
        nodeId,
        nodeLabel,
        status,
        message,
      };
      set((state) => ({ executionLogs: [log, ...state.executionLogs] }));
    };

    for (const node of nodes) {
      set((state) => ({
        nodes: state.nodes.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, status: NODE_STATUS.RUNNING } } : n)),
      }));
      addLog(node.id, node.data.label, 'info', `Executing node [${node.data.label}]...`);

      await new Promise((res) => setTimeout(res, DEFAULT_CONFIGS.EXECUTION_STEP_DELAY_MS));

      set((state) => ({
        nodes: state.nodes.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, status: NODE_STATUS.SUCCESS } } : n)),
      }));
      addLog(node.id, node.data.label, 'success', `Completed successfully. Payload passed to downstream.`);
    }

    setTimeout(() => {
      set((state) => ({
        isExecuting: false,
        nodes: state.nodes.map((n) => ({ ...n, data: { ...n.data, status: NODE_STATUS.IDLE } })),
      }));
    }, DEFAULT_CONFIGS.EXECUTION_RESET_DELAY_MS);
  },
}));

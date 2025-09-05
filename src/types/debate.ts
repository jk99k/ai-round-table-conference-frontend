export type DebateStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED_AI'
  | 'TERMINATED_BY_USER'
  | 'FAILED';

export interface DebateCreate {
  topic: string;
  agent_ids: number[];
}

export interface MessageOut {
  id: number;
  debate_id: number;
  agent_id: number;
  content: string;
  created_at: string;
  agent: AgentOut;
}

export interface AgentOut {
  id: number;
  agent_id: number;
  name: string;
  avatar_url: string | null;
}

export interface DebateOut {
  id: number;
  topic: string;
  status: DebateStatus;
  next_agent_id: number | null;
  next_agent_name: string | null;
  messages: MessageOut[];
  agents: AgentOut[];
  created_at: string;
}

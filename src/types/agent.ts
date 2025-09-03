export interface AgentCreate {
  name: string;
}

export type AgentStatus = 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';

export interface AgentRead {
  id: number;
  name: string;
  persona_prompt: string | null;
  avatar_url: string | null;
  created_at: string;
  status: AgentStatus;
}

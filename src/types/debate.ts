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
}

export interface ParticipantOut {
  id: number;
  agent_id: number;
  name: string;
  avatar_url: string | null;
}

export interface DebateOut {
  id: number;
  topic: string;
  status: DebateStatus;
  messages: MessageOut[];
  participants: ParticipantOut[];
  created_at: string;
}

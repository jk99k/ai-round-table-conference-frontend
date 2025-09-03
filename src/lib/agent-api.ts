import type { AgentCreate, AgentRead } from '../types/agent';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAgents(): Promise<AgentRead[]> {
  const res = await fetch(`${API_BASE_URL}/v1/agents`);
  if (!res.ok) {
    throw new Error('Failed to fetch agents');
  }
  return res.json();
}

export async function createAgent(agentData: AgentCreate): Promise<AgentRead> {
  const res = await fetch(`${API_BASE_URL}/v1/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: agentData.name }),
  });
  if (!res.ok) {
    throw new Error('Failed to create agent');
  }
  return res.json();
}

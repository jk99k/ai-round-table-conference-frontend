'use client';

import { useEffect, useState, useRef } from 'react';
import { getAgents } from '../../lib/agent-api';
import type { AgentRead } from '../../types/agent';
import CreateAgentForm from '../../components/features/agents/CreateAgentForm';
import AgentList from '../../components/features/agents/AgentList';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const { deleteAgents } = await import('../../lib/agent-api');
      await deleteAgents(selectedIds);
      await fetchAgents();
      setSelectedIds([]);
    } catch {
      // エラー処理は省略
    } finally {
      setDeleting(false);
    }
  };

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await getAgents();
      setAgents(data);
    } catch {
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  // 初回取得
  useEffect(() => {
    fetchAgents();
  }, []);

  // ポーリング処理
  useEffect(() => {
    const hasPendingOrGenerating = agents.some(
      (agent) => agent.status === 'PENDING' || agent.status === 'GENERATING'
    );
    if (hasPendingOrGenerating) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          fetchAgents();
        }, 3000);
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [agents]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">AIエージェント管理</h1>
      <CreateAgentForm />
      <div className="mt-8">
        <AgentList
          agents={agents}
          loading={loading}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </div>
    </div>
  );
}

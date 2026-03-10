import React from 'react';

interface NodeProps {
  id: string;
  data: any;
  selected?: boolean;
  onClick?: () => void;
}

export const AgentNode: React.FC<NodeProps> = ({ data, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '15px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: `2px solid ${selected ? '#3b82f6' : 'rgba(59, 130, 246, 0.4)'}`,
        borderRadius: '8px',
        minWidth: '200px',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none'
      }}
    >
      <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold', marginBottom: '5px' }}>🤖 AI AGENT: {data.agentRole?.toUpperCase()}</div>
      <div style={{ color: '#fff', fontWeight: 600 }}>{data.label}</div>
    </div>
  );
};

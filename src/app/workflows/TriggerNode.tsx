import React from 'react';

interface NodeProps {
  id: string;
  data: any;
  selected?: boolean;
  onClick?: () => void;
}

export const TriggerNode: React.FC<NodeProps> = ({ data, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '15px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: `2px solid ${selected ? '#10b981' : 'rgba(16, 185, 129, 0.4)'}`,
        borderRadius: '8px',
        minWidth: '200px',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
      }}
    >
      <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold', marginBottom: '5px' }}>⚡ TRIGGER</div>
      <div style={{ color: '#fff', fontWeight: 600 }}>{data.label}</div>
    </div>
  );
};

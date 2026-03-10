import React from 'react';

interface NodeProps {
  id: string;
  data: any;
  selected?: boolean;
  onClick?: () => void;
}

export const ConditionNode: React.FC<NodeProps> = ({ data, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '15px',
        background: 'rgba(245, 158, 11, 0.1)',
        border: `2px solid ${selected ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)'}`,
        borderRadius: '8px',
        minWidth: '200px',
        cursor: 'pointer',
        clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
        textAlign: 'center',
        boxShadow: selected ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none'
      }}
    >
      <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 'bold', marginBottom: '5px' }}>❓ CONDITION</div>
      <div style={{ color: '#fff', fontWeight: 600 }}>{data.label}</div>
    </div>
  );
};

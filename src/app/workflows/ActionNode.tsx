import React from 'react';

interface NodeProps {
  id: string;
  data: any;
  selected?: boolean;
  onClick?: () => void;
}

export const ActionNode: React.FC<NodeProps> = ({ data, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '15px',
        background: 'rgba(236, 72, 153, 0.1)',
        border: `2px solid ${selected ? '#ec4899' : 'rgba(236, 72, 153, 0.4)'}`,
        borderRadius: '8px',
        minWidth: '200px',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 15px rgba(236, 72, 153, 0.3)' : 'none'
      }}
    >
      <div style={{ fontSize: '0.7rem', color: '#ec4899', fontWeight: 'bold', marginBottom: '5px' }}>⚙️ ACTION</div>
      <div style={{ color: '#fff', fontWeight: 600 }}>{data.label}</div>
    </div>
  );
};

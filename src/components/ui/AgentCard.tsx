import React from 'react';

interface AgentCardProps {
  name: string;
  description?: string;
  status?: string;
  price?: number;
  onAction: () => void;
  actionLabel: string;
  isInstalled?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ name, description, status, price, onAction, actionLabel, isInstalled }) => (
  <div style={{
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{name}</h3>
      {status && (
        <span style={{ 
          fontSize: '0.75rem', 
          padding: '4px 8px', 
          borderRadius: '12px',
          background: status === 'enabled' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: status === 'enabled' ? '#10b981' : '#ef4444'
        }}>
          {status.toUpperCase()}
        </span>
      )}
      {price !== undefined && !isInstalled && (
        <span style={{ fontWeight: 800, color: '#3b82f6' }}>{price === 0 ? 'FREE' : `${price} CR`}</span>
      )}
    </div>
    
    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', flex: 1 }}>{description || 'AI Agent specialized in automated tasks.'}</p>
    
    <button 
      onClick={onAction}
      style={{
        background: isInstalled ? 'rgba(255, 255, 255, 0.1)' : '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 700,
        marginTop: '10px'
      }}
    >
      {actionLabel}
    </button>
  </div>
);

export const LeadTable = ({ leads, onContact }: { leads: any[], onContact: (id: string) => void }) => {
  if (!leads || leads.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No leads found. Generate some!</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
            <th style={{ padding: '15px 10px' }}>Company</th>
            <th style={{ padding: '15px 10px' }}>Email / Phone</th>
            <th style={{ padding: '15px 10px' }}>Score</th>
            <th style={{ padding: '15px 10px' }}>Status</th>
            <th style={{ padding: '15px 10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '15px 10px', color: '#fff', fontWeight: 600 }}>
                {lead.contact_info?.company_name || 'Unknown'}
              </td>
              <td style={{ padding: '15px 10px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <div>{lead.contact_info?.email || 'No email'}</div>
                <div style={{ color: '#64748b' }}>{lead.contact_info?.phone || 'No phone'}</div>
              </td>
              <td style={{ padding: '15px 10px' }}>
                <span style={{ 
                  color: lead.score >= 80 ? '#10b981' : lead.score >= 50 ? '#f59e0b' : '#ef4444',
                  fontWeight: 800
                }}>{lead.score}/100</span>
              </td>
              <td style={{ padding: '15px 10px' }}>
                <span style={{ 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem',
                  background: lead.contacted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                  color: lead.contacted ? '#10b981' : '#cbd5e1'
                }}>
                  {lead.contacted ? 'CONTACTED' : lead.status.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '15px 10px' }}>
                <button 
                  onClick={() => onContact(lead.id)}
                  disabled={lead.contacted}
                  style={{
                    background: lead.contacted ? 'transparent' : '#3b82f6',
                    border: lead.contacted ? '1px solid #334155' : 'none',
                    color: lead.contacted ? '#64748b' : '#fff',
                    padding: '8px 16px', borderRadius: '6px', cursor: lead.contacted ? 'not-allowed' : 'pointer'
                  }}
                >
                  {lead.contacted ? 'Sent' : 'Outreach'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import { useState } from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';
import '../../components/calculator/styles/CalculatorPro.css';
import { supabase } from '../../core/supabase';

// Initial Mock Data to demonstrate the builder immediately
const initialNodes = [
  { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'New Lead Captured' } },
  { id: '2', type: 'agent', position: { x: 250, y: 200 }, data: { label: 'Enrich Lead Data', agentRole: 'lead' } },
  { id: '3', type: 'condition', position: { x: 250, y: 350 }, data: { label: 'Score > 70?' } },
  { id: '4', type: 'agent', position: { x: 100, y: 500 }, data: { label: 'Draft Custom Pitch', agentRole: 'sales' } },
  { id: '5', type: 'action', position: { x: 400, y: 500 }, data: { label: 'Add to Drip Campaign', actionType: 'email' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  const saveWorkflow = async () => {
    setIsSaving(true);
    try {
      // Assuming a valid user session exists. For demo, mocking UUID.
      const userId = '00000000-0000-0000-0000-000000000000'; 
      
      const { error } = await supabase
        .from('workflows')
        .insert([{
          user_id: userId,
          name: 'Custom Lead Pipeline',
          description: 'Auto-generated workflow from visual builder.',
          nodes,
          edges,
          is_active: true
        }]);
        
      if (error) throw error;
      alert('Workflow saved successfully!');
    } catch (e: any) {
      alert(`Error saving workflow: ${e.message || String(e)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px', padding: '40px' }}>
      <div className="calc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-accent" style={{ fontSize: '3rem', margin: 0 }}>AI Workflow Builder</h1>
          <p style={{ color: '#94a3b8', margin: '10px 0 0 0' }}>Design, connect, and automate your autonomous agents.</p>
        </div>
        <button 
          onClick={saveWorkflow} 
          disabled={isSaving}
          className="btn-primary" 
          style={{ padding: '15px 30px', fontSize: '1rem', fontWeight: 800 }}
        >
          {isSaving ? 'SAVING...' : 'PUBLISH WORKFLOW'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '40px' }}>
        
        {/* Left Side: Canvas */}
        <div style={{ flex: 3 }}>
          <WorkflowCanvas 
            nodes={nodes} 
            edges={edges} 
            onNodeClick={handleNodeClick} 
            selectedNodeId={selectedNode?.id || null} 
          />
        </div>

        {/* Right Side: Properties Panel */}
        <div className="glass-card" style={{ flex: 1, padding: '25px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #1e293b', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>Properties</h3>
          
          {!selectedNode ? (
            <div style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginTop: '50px' }}>
              Select a node on the canvas to configure it.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Node ID</label>
                <input value={selectedNode.id} disabled style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid #334155', color: '#64748b', borderRadius: '8px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Node Type</label>
                <div style={{ padding: '10px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {selectedNode.type}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Label / Action Name</label>
                <input 
                  value={selectedNode.data.label} 
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: newLabel } } : n));
                    setSelectedNode((prev: any) => ({ ...prev, data: { ...prev.data, label: newLabel } }));
                  }}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #3b82f6', color: '#fff', borderRadius: '8px' }} 
                />
              </div>

              {selectedNode.type === 'agent' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Assigned Agent Role</label>
                  <select 
                    value={selectedNode.data.agentRole}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, agentRole: newRole } } : n));
                      setSelectedNode((prev: any) => ({ ...prev, data: { ...prev.data, agentRole: newRole } }));
                    }}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #3b82f6', color: '#fff', borderRadius: '8px' }}
                  >
                    <option value="ceo">CEO (Strategy)</option>
                    <option value="lead">Lead Gen Specialist</option>
                    <option value="sales">Sales Closer</option>
                    <option value="marketing">Marketing Director</option>
                    <option value="seo">SEO Expert</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

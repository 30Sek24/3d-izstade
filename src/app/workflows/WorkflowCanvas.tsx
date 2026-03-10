import React from 'react';
import { TriggerNode } from './TriggerNode';
import { AgentNode } from './AgentNode';
import { ConditionNode } from './ConditionNode';
import { ActionNode } from './ActionNode';

interface WorkflowCanvasProps {
  nodes: any[];
  edges: any[];
  onNodeClick: (node: any) => void;
  selectedNodeId: string | null;
}

/**
 * A lightweight custom node canvas (SVG lines + Absolute positioned divs)
 * to avoid heavy third-party dependencies while fulfilling the requirements.
 */
export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ nodes, edges, onNodeClick, selectedNodeId }) => {
  
  const renderNode = (node: any) => {
    const props = {
      id: node.id,
      data: node.data,
      selected: node.id === selectedNodeId,
      onClick: () => onNodeClick(node)
    };

    switch (node.type) {
      case 'trigger': return <TriggerNode {...props} />;
      case 'agent': return <AgentNode {...props} />;
      case 'condition': return <ConditionNode {...props} />;
      case 'action': return <ActionNode {...props} />;
      default: return null;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', background: '#020617', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Background Grid Pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}></div>
      
      {/* SVG Edges */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          // Simple straight line math
          const startX = sourceNode.position.x + 100; // approx center width
          const startY = sourceNode.position.y + 70; // approx bottom
          const endX = targetNode.position.x + 100;
          const endY = targetNode.position.y;

          // Simple bezier curve for aesthetics
          const path = `M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`;

          return (
            <path 
              key={edge.id}
              d={path}
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(node => (
        <div key={node.id} style={{ position: 'absolute', left: node.position.x, top: node.position.y, zIndex: 2, transition: 'all 0.2s' }}>
          {renderNode(node)}
        </div>
      ))}
    </div>
  );
};

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

interface MindmapViewerProps {
  roadmapData: {
    title: string;
    phases: Array<{
      title: string;
      nodes: Array<{
        id: string;
        title: string;
        description: string;
        estimatedHours: number;
        courses: string[];
        tasks: string[];
      }>;
    }>;
  };
  onNodeClick: (nodeData: any) => void;
  completedNodes: string[];
}

const nodeTypes = {
  custom: CustomNode,
};

const MindmapViewer: React.FC<MindmapViewerProps> = ({
  roadmapData,
  onNodeClick,
  completedNodes,
}) => {
  const { nodes, edges } = useMemo(() => {
    const computedNodes: Node[] = [];
    const computedEdges: Edge[] = [];
    let yOffset = 50;

    roadmapData.phases.forEach((phase, phaseIdx) => {
      // Phase Header Node
      const phaseHeaderId = `phase-header-${phaseIdx}`;
      computedNodes.push({
        id: phaseHeaderId,
        type: 'output',
        data: { label: phase.title },
        position: { x: 300, y: yOffset },
        style: {
          background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          padding: '10px 20px',
          width: 250,
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
        },
      });

      yOffset += 100;

      // Children nodes inside current Phase
      phase.nodes.forEach((item, nodeIdx) => {
        const nodeId = item.id || `node-${phaseIdx}-${nodeIdx}`;
        const isCompleted = completedNodes.includes(nodeId);

        computedNodes.push({
          id: nodeId,
          type: 'custom',
          data: {
            title: item.title,
            description: item.description,
            estimatedHours: item.estimatedHours,
            isCompleted,
            onClick: () => onNodeClick(item),
          },
          position: { x: 300, y: yOffset },
        });

        // Edge from Phase Header or previous node
        if (nodeIdx === 0) {
          computedEdges.push({
            id: `edge-${phaseHeaderId}-${nodeId}`,
            source: phaseHeaderId,
            target: nodeId,
            animated: true,
            style: { stroke: '#7c3aed', strokeWidth: 2 },
          });
        } else {
          const prevNodeId = phase.nodes[nodeIdx - 1].id || `node-${phaseIdx}-${nodeIdx - 1}`;
          computedEdges.push({
            id: `edge-${prevNodeId}-${nodeId}`,
            source: prevNodeId,
            target: nodeId,
            animated: !isCompleted,
            style: { stroke: isCompleted ? '#22c55e' : '#4f46e5', strokeWidth: 2 },
          });
        }

        yOffset += 120;
      });

      // Link Phases together
      if (phaseIdx < roadmapData.phases.length - 1) {
        const nextPhaseHeaderId = `phase-header-${phaseIdx + 1}`;
        const lastNodeOfPhase = phase.nodes[phase.nodes.length - 1];
        const lastNodeId = lastNodeOfPhase.id || `node-${phaseIdx}-${phase.nodes.length - 1}`;
        
        computedEdges.push({
          id: `phase-bridge-${phaseIdx}`,
          source: lastNodeId,
          target: nextPhaseHeaderId,
          animated: true,
          style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '5,5' },
        });
      }

      yOffset += 50;
    });

    return { nodes: computedNodes, edges: computedEdges };
  }, [roadmapData, completedNodes, onNodeClick]);

  return (
    <div className="w-full h-full glass-satin rounded-3xl overflow-hidden border border-purple-500/10">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#7c3aed" gap={16} size={1} opacity={0.1} />
        <Controls className="bg-gray-900 border border-purple-500/20 rounded-lg text-white" />
      </ReactFlow>
    </div>
  );
};

export default MindmapViewer;

// ============================================================
// COMPONENT: MINDMAP VIEWER
// React Flow canvas for career roadmap visualization
// ============================================================

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RoadmapNode as RoadmapNodeType } from '../../types';
import CustomNode from './CustomNode';
import NodeDrawer from './NodeDrawer';

interface MindmapViewerProps {
  nodes: RoadmapNodeType[];
  onNodeComplete?: (nodeId: string) => void;
  className?: string;
}

const nodeTypes = {
  custom: CustomNode,
};

const MindmapViewer: React.FC<MindmapViewerProps> = ({ nodes: roadmapNodes, onNodeComplete, className }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Convert roadmap nodes to React Flow nodes
  const initialNodes: Node[] = roadmapNodes.map((node, index) => ({
    id: node.id,
    type: 'custom',
    position: node.position || { x: (index % 4) * 300, y: Math.floor(index / 4) * 200 },
    data: {
      ...node,
      onComplete: onNodeComplete,
      onExpand: (nodeId: string) => {
        const node = roadmapNodes.find(n => n.id === nodeId);
        if (node) {
          setSelectedNode(node);
          setDrawerOpen(true);
        }
      },
    },
  }));

  // Generate edges from node prerequisites
  const initialEdges: Edge[] = [];
  roadmapNodes.forEach(node => {
    if (node.prerequisites && node.prerequisites.length > 0) {
      node.prerequisites.forEach(prereqId => {
        initialEdges.push({
          id: `${prereqId}-${node.id}`,
          source: prereqId,
          target: node.id,
          type: 'smoothstep',
          animated: !node.isCompleted,
          style: { stroke: node.isCompleted ? '#22c55e' : '#8b5cf6' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: node.isCompleted ? '#22c55e' : '#8b5cf6',
          },
        });
      });
    }
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={className} style={{ height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="glass rounded-2xl border border-white/10"
        style={{ background: 'rgba(17, 24, 39, 0.4)' }}
      >
        <Background color="#8b5cf6" gap={16} />
        <Controls className="glass rounded-lg" />
        <MiniMap
          className="glass rounded-lg border border-white/10"
          nodeColor={(node) => {
            const data = node.data as RoadmapNodeType;
            return data.isCompleted ? '#22c55e' : '#8b5cf6';
          }}
        />
      </ReactFlow>

      {/* Node Detail Drawer */}
      <NodeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        node={selectedNode}
        onComplete={onNodeComplete}
      />
    </div>
  );
};

export default MindmapViewer;

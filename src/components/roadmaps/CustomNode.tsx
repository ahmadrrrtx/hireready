import React from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle, Clock } from 'lucide-react';

interface CustomNodeProps {
  data: {
    title: string;
    description: string;
    estimatedHours: number;
    isCompleted: boolean;
    onClick: () => void;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div 
      onClick={data.onClick}
      className={`p-4 rounded-xl cursor-pointer w-64 transition-all duration-300 ${
        data.isCompleted 
          ? 'bg-green-950/40 border border-green-500/40 shadow-lg shadow-green-500/5' 
          : 'bg-gray-950/80 border border-purple-500/20 shadow-lg shadow-indigo-500/5 hover:border-purple-500/50'
      }`}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-xs font-bold truncate ${data.isCompleted ? 'text-green-400' : 'text-white'}`}>
            {data.title}
          </p>
          <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">
            {data.description}
          </p>
        </div>
        {data.isCompleted ? (
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
        ) : (
          <div className="flex items-center gap-0.5 text-purple-400 font-semibold text-[10px] flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span>{data.estimatedHours}h</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

export default CustomNode;

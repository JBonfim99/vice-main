'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { deleteFeatureFromStorage } from '@/app/(main)/utils/feature-storage';

interface FeatureItemProps {
  feature: {
    name: string;
    viceScore: number;
    impactScore: number;
    easeScore: number;
    confidenceScore: number;
    impactRating: number;
    easeRating: number;
    confidenceRating: number;
    totalMatches: number;
  };
  rank: number;
  onDelete?: (featureName: string) => void;
}

export const FeatureItem: FC<FeatureItemProps> = ({ feature, rank, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    try {
      // Attempt to delete the feature from localStorage
      deleteFeatureFromStorage(feature.name);
      
      // Always call the onDelete handler to update parent state
      // This ensures UI consistency with localStorage
      if (onDelete) {
        onDelete(feature.name);
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="hover:bg-white/5 transition-colors">
      <div 
        className="grid grid-cols-16 py-4 px-4 items-center" 
      >
        <div className="col-span-1 text-center font-medium text-[#0BFFFF]">
          {rank}
        </div>
        <div className="col-span-4 text-white font-medium">
          {feature.name}
        </div>
        <div className="col-span-2 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-[#0BFFFF]/20 text-[#0BFFFF] font-medium">
            {feature.viceScore}
          </div>
        </div>
        <div className="col-span-2 text-center">
          <div className="inline-block px-2 py-1 rounded-full bg-[#FF5757]/20 text-[#FF5757] font-medium">
            {feature.impactScore}
          </div>
        </div>
        <div className="col-span-2 text-center">
          <div className="inline-block px-2 py-1 rounded-full bg-[#4CAF50]/20 text-[#4CAF50] font-medium">
            {feature.easeScore}
          </div>
        </div>
        <div className="col-span-2 text-center">
          <div className="inline-block px-2 py-1 rounded-full bg-[#0BFFFF]/20 text-[#0BFFFF] font-medium">
            {feature.confidenceScore}
          </div>
        </div>
        <div className="col-span-2 text-center text-white/70">
          {feature.totalMatches} matches
        </div>
        <div className="col-span-1 flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-white/10"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

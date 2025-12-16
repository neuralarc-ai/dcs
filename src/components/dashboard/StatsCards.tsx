'use client';

import { RiTimeLine, RiCheckboxCircleLine } from 'react-icons/ri';

interface StatsCardsProps {
  activeCount: number;
  completedCount: number;
}

export default function StatsCards({ activeCount, completedCount }: StatsCardsProps) {
  return (
    <div className="flex gap-4 mb-8 flex-wrap">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm min-w-[200px] flex-1 sm:flex-none">
        <div className="p-3 bg-green-50 rounded-full">
          <RiTimeLine className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <span className="block text-2xl font-bold text-gray-900">{activeCount}</span>
          <span className="block text-sm text-gray-500">Active Tenders</span>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm min-w-[200px] flex-1 sm:flex-none">
        <div className="p-3 bg-green-50 rounded-full">
          <RiCheckboxCircleLine className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <span className="block text-2xl font-bold text-gray-900">{completedCount}</span>
          <span className="block text-sm text-gray-500">Completed</span>
        </div>
      </div>
    </div>
  );
}


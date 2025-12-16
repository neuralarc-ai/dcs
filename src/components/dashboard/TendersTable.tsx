'use client';

import { useEffect, useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { RiTimeLine, RiEyeLine, RiCheckboxCircleLine } from 'react-icons/ri';
import { Button } from '../ui/Button';
import { Tender } from '@/types';

interface TendersTableProps {
  tenders: Tender[];
  onView: (tender: Tender) => void;
}

export default function TendersTable({ tenders, onView }: TendersTableProps) {
  const [, setTick] = useState(0);

  // Update timer every minute
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return { text: 'Expired', class: 'bg-gray-100 text-gray-500' };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let text = '';
    let colorClass = 'bg-green-100 text-green-700';

    if (days > 0) text = `${days}d ${hours}h`;
    else if (hours > 0) text = `${hours}h ${minutes}m`;
    else text = `${minutes}m`;

    if (days < 2) colorClass = 'bg-red-100 text-red-700';
    else if (days < 5) colorClass = 'bg-yellow-100 text-yellow-800';

    return { text, class: colorClass };
  };

  const getStatusBadge = (tender: Tender) => {
    if (tender.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          <RiTimeLine size={14} />
          In Progress
        </span>
      );
    }
    
    const daysEarly = tender.our_submission_date 
      ? differenceInDays(new Date(tender.deadline), new Date(tender.our_submission_date)) 
      : 0;
      
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <RiCheckboxCircleLine size={14} />
        Submitted {daysEarly} days early
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tender / RFP Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time Remaining</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quoted Amount</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenders.map((tender) => {
              const timeRemaining = getTimeRemaining(tender.deadline);
              
              return (
                <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {format(new Date(tender.date_submitted), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-900">
                    {tender.name}
                  </td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {format(new Date(tender.deadline), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${timeRemaining.class}`}>
                      <RiTimeLine size={14} />
                      {timeRemaining.text}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                    ${tender.quoted_amount.toLocaleString()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {getStatusBadge(tender)}
                  </td>
                  <td className="p-4">
                    <Button variant="secondary" size="sm" onClick={() => onView(tender)}>
                      <RiEyeLine size={16} />
                      <span className="hidden lg:inline">View</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

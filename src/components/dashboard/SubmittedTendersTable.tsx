'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RiDownloadLine, RiTimeLine } from 'react-icons/ri';
import { SubmittedTender } from '@/types';

interface SubmittedTendersTableProps {
  tenders: SubmittedTender[];
}

export default function SubmittedTendersTable({ tenders }: SubmittedTendersTableProps) {
  const [, setTick] = useState(0);

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Your Submitted Tenders</h3>
        <p className="text-gray-500 mt-1">Track tenders you&apos;ve submitted to us with document links and deadlines</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tender / RFP Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Document</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time Remaining</th>
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
                  <td className="p-4">
                    <a 
                      href={tender.document_url}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-all group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <RiDownloadLine className="text-gray-400 group-hover:text-green-500" />
                      {tender.document_name}
                    </a>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

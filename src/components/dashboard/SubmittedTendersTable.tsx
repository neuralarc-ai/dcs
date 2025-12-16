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
    // Update timer every second
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeParts = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
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
              const parts = getTimeParts(tender.deadline);
              
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
                    {parts ? (
                      <div className="inline-flex items-center gap-1.5 font-mono bg-gray-50 text-gray-900 px-3 py-2 rounded-lg border border-gray-200">
                        <div className="flex flex-col items-center min-w-[20px]">
                          <span className="text-lg font-bold leading-none">{parts.days}</span>
                          <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider mt-0.5">Day</span>
                        </div>
                        <span className="text-lg font-bold text-gray-300 pb-3">:</span>
                        <div className="flex flex-col items-center min-w-[20px]">
                          <span className="text-lg font-bold leading-none">{parts.hours.toString().padStart(2, '0')}</span>
                          <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider mt-0.5">Hr</span>
                        </div>
                        <span className="text-lg font-bold text-gray-300 pb-3">:</span>
                        <div className="flex flex-col items-center min-w-[20px]">
                          <span className="text-lg font-bold leading-none">{parts.minutes.toString().padStart(2, '0')}</span>
                          <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider mt-0.5">Min</span>
                        </div>
                        <span className="text-lg font-bold text-gray-300 pb-3">:</span>
                        <div className="flex flex-col items-center min-w-[20px]">
                          <span className="text-lg font-bold leading-none">{parts.seconds.toString().padStart(2, '0')}</span>
                          <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider mt-0.5">Sec</span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <RiTimeLine size={14} />
                        Expired
                      </span>
                    )}
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

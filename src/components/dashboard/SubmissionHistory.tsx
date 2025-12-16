'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { RiHistoryLine, RiFileTextLine, RiTimeLine } from 'react-icons/ri';
import { supabase } from '@/lib/supabase';

interface RequirementSubmission {
  id: string;
  created_at: string;
  tender_name: string;
  deadline: string;
  description: string;
  files: Array<{ name: string; url: string; size: number }>;
}

export default function SubmissionHistory({ keyProp }: { keyProp: number }) {
  const [submissions, setSubmissions] = useState<RequirementSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      // console.log('Fetching history...');
      setIsLoading(true);
      const { data, error } = await supabase
        .from('requirements_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
      } else if (data) {
        console.log('Fetched history data:', data);
        setSubmissions(data);
      }
      setIsLoading(false);
    };

    fetchSubmissions();
  }, [keyProp]); 

  // Force render even if loading for now to see if component mounts
  // if (isLoading) {
  //   return <div className="mt-8 p-4 text-center text-gray-500">Loading history...</div>;
  // }

  if (!isLoading && submissions.length === 0) {
    return (
      <div className="mt-12 text-center p-8 bg-gray-50 rounded-xl border border-gray-100">
        <RiHistoryLine className="mx-auto text-gray-300 mb-2" size={32} />
        <p className="text-gray-500">No submission history yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center gap-2 mb-4 px-1">
        <RiHistoryLine className="text-gray-400" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Submission History</h3>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Sent</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Requirement Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Desired Deadline</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Files</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {format(new Date(sub.created_at), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {sub.tender_name}
                  </td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <RiTimeLine className="text-gray-400" size={14} />
                      {format(new Date(sub.deadline), 'MMM d, yyyy HH:mm')}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="flex flex-col gap-1">
                      {sub.files && sub.files.map((file: any, idx: number) => (
                        <a 
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-green-600 transition-colors"
                        >
                          <RiFileTextLine size={14} />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

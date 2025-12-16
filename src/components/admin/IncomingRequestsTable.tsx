'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { RiFileTextLine, RiTimeLine, RiDownloadLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface RequirementSubmission {
  id: string;
  created_at: string;
  tender_name: string;
  deadline: string;
  description: string;
  files: Array<{ name: string; url: string; size: number }>;
}

export default function IncomingRequestsTable() {
  const [requests, setRequests] = useState<RequirementSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('requirements_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Incoming Requests</h2>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {requests.length} Requests
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Received</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client Requirement</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Desired Deadline</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Documents</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                  {format(new Date(req.created_at), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{req.tender_name}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-[300px]">{req.description}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <RiTimeLine className="text-gray-400" size={14} />
                    {format(new Date(req.deadline), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="flex flex-col gap-2">
                    {req.files && req.files.map((file: any, idx: number) => (
                      <a 
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-gray-600 hover:text-blue-600 hover:underline transition-colors"
                      >
                        <RiFileTextLine size={14} />
                        <span className="truncate max-w-[150px] text-xs">{file.name}</span>
                      </a>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 text-green-600">
                      <RiCheckLine size={16} />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 text-red-600">
                      <RiCloseLine size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  No new requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


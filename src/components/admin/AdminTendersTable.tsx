'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { RiAddLine, RiCheckDoubleLine, RiDeleteBinLine, RiTimeLine } from 'react-icons/ri';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tender } from '@/types';
import CreateTenderModal from './CreateTenderModal';
import CompleteTenderModal from './CompleteTenderModal';

export default function AdminTendersTable() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTenderForCompletion, setSelectedTenderForCompletion] = useState<Tender | null>(null);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tenders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTenders(data as Tender[]);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tender?')) return;
    
    const { error } = await supabase.from('tenders').delete().eq('id', id);
    if (!error) fetchTenders();
  };

  const handleMarkComplete = (tender: Tender) => {
    setSelectedTenderForCompletion(tender);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Loading tenders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <RiAddLine className="mr-2" size={20} />
          Create New Tender
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenders.map((tender) => (
              <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-semibold text-gray-900">{tender.name}</td>
                <td className="p-4 text-sm text-gray-600">
                  {format(new Date(tender.deadline), 'MMM d, yyyy')}
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">
                  ${tender.quoted_amount.toLocaleString()}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tender.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tender.status === 'submitted' ? 'Completed' : 'In Progress'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {tender.status !== 'submitted' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleMarkComplete(tender)}
                        title="Mark as Complete"
                      >
                        <RiCheckDoubleLine size={16} />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(tender.id)}
                      title="Delete"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {tenders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  No active projects. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateTenderModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchTenders}
      />

      {selectedTenderForCompletion && (
        <CompleteTenderModal
          isOpen={!!selectedTenderForCompletion}
          onClose={() => setSelectedTenderForCompletion(null)}
          onSuccess={fetchTenders}
          tender={selectedTenderForCompletion}
        />
      )}
    </div>
  );
}


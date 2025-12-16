'use client';

import { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import LoginScreen from '@/components/auth/LoginScreen';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import TendersTable from '@/components/dashboard/TendersTable';
import SubmittedTendersTable from '@/components/dashboard/SubmittedTendersTable';
import SubmitRequirementsForm from '@/components/forms/SubmitRequirementsForm';
import ContactForm from '@/components/forms/ContactForm';
import Modal from '@/components/ui/Modal';
import { Tender, SubmittedTender } from '@/types';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('tenders');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [submittedTenders, setSubmittedTenders] = useState<SubmittedTender[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data when authenticated and tab changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      if (activeTab === 'tenders') {
        const { data } = await supabase
          .from('tenders')
          .select('*')
          .order('deadline', { ascending: true });
        
        if (data) setTenders(data as Tender[]);
      } else if (activeTab === 'submitted') {
        const { data } = await supabase
          .from('submitted_tenders')
          .select('*')
          .order('date_submitted', { ascending: false });
          
        if (data) setSubmittedTenders(data as SubmittedTender[]);
      }
      setIsLoading(false);
    };

    fetchData();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:tenders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tenders' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const activeTendersCount = tenders.filter(t => new Date(t.deadline) > new Date()).length;
  const completedTendersCount = tenders.filter(t => t.status === 'submitted').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'tenders':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">Active Tenders & RFPs</h3>
              <div className="mt-4">
                <StatsCards 
                  activeCount={activeTendersCount} 
                  completedCount={completedTendersCount} 
                />
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <TendersTable 
                tenders={tenders} 
                onView={setSelectedTender} 
              />
            )}
          </div>
        );
      case 'submitted':
        return isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <SubmittedTendersTable tenders={submittedTenders} />
        );
      case 'submit':
        return <SubmitRequirementsForm />;
      case 'contact':
        return <ContactForm />;
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardLayout
        onLogout={() => {
          setIsAuthenticated(false);
          setActiveTab('tenders');
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </DashboardLayout>

      <Modal
        isOpen={!!selectedTender}
        onClose={() => setSelectedTender(null)}
        title={selectedTender?.name || ''}
      >
        {selectedTender && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Date Submitted to Us
                </label>
                <div className="text-gray-900">
                  {format(new Date(selectedTender.date_submitted), 'MMMM d, yyyy')}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Deadline
                </label>
                <div className="text-gray-900">
                  {format(new Date(selectedTender.deadline), 'MMMM d, yyyy HH:mm')}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Our Submission Date
                </label>
                <div className="text-gray-900">
                  {selectedTender.our_submission_date ? (
                    <>
                      {format(new Date(selectedTender.our_submission_date), 'MMMM d, yyyy HH:mm')}
                      <span className="text-sm text-green-600 block">
                        ({differenceInDays(new Date(selectedTender.deadline), new Date(selectedTender.our_submission_date))} days before deadline)
                      </span>
                    </>
                  ) : (
                    <span className="text-yellow-600 font-medium">Not yet submitted</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Quoted Amount
                </label>
                <div className="text-gray-900 font-bold text-lg">
                  ${selectedTender.quoted_amount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Description
              </label>
              <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {selectedTender.description}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Requirements
              </label>
              <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {selectedTender.requirements}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

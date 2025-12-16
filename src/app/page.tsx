'use client';

import { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { 
  RiCalendarLine, 
  RiMoneyDollarCircleLine, 
  RiTimeLine, 
  RiFileTextLine, 
  RiCheckboxCircleLine,
  RiFileList2Line 
} from 'react-icons/ri';
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
        title="Tender Details"
      >
        {selectedTender && (
          <div className="space-y-8">
            {/* Header Section with Status */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold text-gray-900 leading-tight">
                {selectedTender.name}
              </h4>
              <div className="flex items-center gap-2">
                {selectedTender.status === 'submitted' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    <RiCheckboxCircleLine size={16} />
                    Submitted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                    <RiTimeLine size={16} />
                    Pending Submission
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  ID: #{selectedTender.id}
                </span>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RiCalendarLine className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Deadline</span>
                </div>
                <div className="text-gray-900 font-semibold text-lg">
                  {format(new Date(selectedTender.deadline), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(selectedTender.deadline), 'h:mm a')}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RiMoneyDollarCircleLine className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Quoted Amount</span>
                </div>
                <div className="text-gray-900 font-bold text-2xl">
                  ${selectedTender.quoted_amount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 text-sm border-b border-gray-100 pb-6">
                <div className="flex-1">
                  <span className="block text-gray-500 mb-1">Date Received</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(selectedTender.date_submitted), 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="block text-gray-500 mb-1">Our Submission</span>
                  {selectedTender.our_submission_date ? (
                    <div>
                      <span className="font-medium text-gray-900 block">
                        {format(new Date(selectedTender.our_submission_date), 'MMM d, yyyy')}
                      </span>
                      <span className="text-green-600 text-xs font-medium">
                        {differenceInDays(new Date(selectedTender.deadline), new Date(selectedTender.our_submission_date))} days early
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Not yet submitted</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                  <RiFileTextLine className="text-gray-400" />
                  <h3>Description</h3>
                </div>
                <div className="text-gray-600 leading-relaxed text-sm bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                  {selectedTender.description}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                  <RiFileList2Line className="text-gray-400" />
                  <h3>Requirements</h3>
                </div>
                <div className="text-gray-600 leading-relaxed text-sm bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                  {selectedTender.requirements}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

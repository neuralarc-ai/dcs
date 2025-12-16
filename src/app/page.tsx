'use client';

import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import LoginScreen from '@/components/auth/LoginScreen';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import TendersTable from '@/components/dashboard/TendersTable';
import SubmittedTendersTable from '@/components/dashboard/SubmittedTendersTable';
import SubmitRequirementsForm from '@/components/forms/SubmitRequirementsForm';
import ContactForm from '@/components/forms/ContactForm';
import Modal from '@/components/ui/Modal';
import { tenderData, submittedTendersData } from '@/data/mockData';
import { Tender } from '@/types';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('tenders');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const activeTendersCount = tenderData.filter(t => new Date(t.deadline) > new Date()).length;
  const completedTendersCount = tenderData.filter(t => t.status === 'submitted').length;

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
            <TendersTable 
              tenders={tenderData} 
              onView={setSelectedTender} 
            />
          </div>
        );
      case 'submitted':
        return <SubmittedTendersTable tenders={submittedTendersData} />;
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
                  {format(new Date(selectedTender.dateSubmitted), 'MMMM d, yyyy')}
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
                  {selectedTender.ourSubmissionDate ? (
                    <>
                      {format(new Date(selectedTender.ourSubmissionDate), 'MMMM d, yyyy HH:mm')}
                      <span className="text-sm text-green-600 block">
                        ({differenceInDays(new Date(selectedTender.deadline), new Date(selectedTender.ourSubmissionDate))} days before deadline)
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
                  ${selectedTender.quotedAmount.toLocaleString()}
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

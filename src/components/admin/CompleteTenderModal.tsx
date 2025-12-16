'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { RiUploadCloud2Line, RiFileTextLine, RiCloseLine } from 'react-icons/ri';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Label } from '@/components/ui/label';
import { Tender } from '@/types';

interface CompleteTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tender: Tender;
}

export default function CompleteTenderModal({ isOpen, onClose, onSuccess, tender }: CompleteTenderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      // 1. Upload File
      const fileExt = file.name.split('.').pop();
      const randomString = Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now();
      const fileName = `completed-${tender.id}-${timestamp}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // 2. Insert into submitted_tenders table
      const { error: insertError } = await supabase
        .from('submitted_tenders')
        .insert({
          name: tender.name,
          date_submitted: tender.date_submitted, // Original received date
          document_url: publicUrl,
          document_name: file.name,
          deadline: tender.deadline
        });

      if (insertError) throw insertError;

      // 3. Update active tenders status (mark as submitted)
      const { error: updateError } = await supabase
        .from('tenders')
        .update({ 
          status: 'submitted', 
          our_submission_date: new Date().toISOString() 
        })
        .eq('id', tender.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error completing tender:', error);
      alert('Failed to complete tender. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Tender & Upload Proposal">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="mb-2 block">Upload Final Proposal Document</Label>
          
          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-gray-50 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <RiUploadCloud2Line className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="font-semibold text-gray-700 mb-1">Click to upload document</p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX (Final Proposal)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md text-green-600 shadow-sm">
                  <RiFileTextLine size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setFile(null)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
          <p><strong>Note:</strong> Marking this as complete will:</p>
          <ul className="list-disc list-inside mt-1 ml-1 space-y-1">
            <li>Move this project to the &quot;Submitted Tenders&quot; tab for the client.</li>
            <li>Make this document available for them to download.</li>
            <li>Stop the countdown timer on their dashboard.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!file || isLoading} isLoading={isLoading}>
            Upload & Complete
          </Button>
        </div>
      </form>
    </Modal>
  );
}


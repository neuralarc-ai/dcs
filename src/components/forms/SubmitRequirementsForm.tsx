'use client';

import { useState, useRef } from 'react';
import { 
  RiFileTextLine, 
  RiCalendarLine, 
  RiFileList2Line, 
  RiAttachmentLine, 
  RiUploadCloud2Line, 
  RiSendPlane2Line,
  RiCloseLine,
  RiFileLine,
  RiCheckboxCircleLine
} from 'react-icons/ri';
import Button from '../ui/Button';
import { supabase } from '@/lib/supabase';

export default function SubmitRequirementsForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.size <= 10 * 1024 * 1024 // 10MB limit
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const tenderName = formData.get('tenderName') as string;
    const deadline = formData.get('deadline') as string;
    const description = formData.get('description') as string;

    try {
      const uploadedFiles = [];

      // Upload files
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const randomString = Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now();
        const fileName = `${timestamp}-${randomString}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          name: file.name,
          url: publicUrl,
          size: file.size
        });
      }

      // Insert submission record
      const { error: insertError } = await supabase
        .from('requirements_submissions')
        .insert({
          tender_name: tenderName,
          deadline: new Date(deadline).toISOString(),
          description: description,
          files: uploadedFiles
        });

      if (insertError) throw insertError;

      setIsSuccess(true);
      setFiles([]);
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: unknown) {
      setError('Failed to submit. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900">Submit New Tender Requirements</h3>
          <p className="text-gray-500 mt-1">Upload tender documents and requirements for our team to review</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <RiFileTextLine className="text-gray-400" size={18} />
              Tender / RFP Name
            </label>
            <input 
              name="tenderName"
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              placeholder="Enter tender or RFP name"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <RiCalendarLine className="text-gray-400" size={18} />
              Submission Deadline
            </label>
            <input 
              name="deadline"
              type="datetime-local" 
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <RiFileList2Line className="text-gray-400" size={18} />
              Description / Notes
            </label>
            <textarea 
              name="description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-y"
              placeholder="Add any additional details or requirements"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <RiAttachmentLine className="text-gray-400" size={18} />
              Upload Documents
            </label>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-gray-50 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx,.xls,.xlsx" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <RiUploadCloud2Line className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="font-semibold text-gray-700 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX (Max 10MB each)</p>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <RiFileLine className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <RiCloseLine size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" isLoading={isLoading}>
            <RiSendPlane2Line size={20} />
            <span>Submit Requirements</span>
          </Button>
          
          {error && (
            <div className="text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}
        </form>

        {isSuccess && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <RiCheckboxCircleLine className="flex-shrink-0" size={24} />
            <span className="font-medium">Tender requirements submitted successfully! We&apos;ll review and get back to you soon.</span>
          </div>
        )}
      </div>
    </div>
  );
}

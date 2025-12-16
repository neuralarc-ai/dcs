'use client';

import { useState } from 'react';
import { 
  RiMailLine, 
  RiPhoneLine, 
  RiTimeLine,
  RiMessage2Line,
  RiMenu2Line,
  RiSendPlane2Line,
  RiCheckboxCircleLine
} from 'react-icons/ri';
import { Button } from '../ui/button';
import { supabase } from '@/lib/supabase';

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    try {
      // 1. Save to Supabase
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          subject,
          message
        });

      if (insertError) throw insertError;

      // 2. Send Email via API Route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      });

      if (!response.ok) {
        console.warn('Failed to send email notification');
        // We don't throw here to avoid showing an error if the DB save worked but email failed
        // unless you want strict consistency. For now, DB success is "success".
      }

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: unknown) {
      setError('Failed to send message. Please try again.');
      console.error('Contact error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
        <p className="text-gray-500 mt-1">Have questions? We&apos;re here to help</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <RiMailLine className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
            <p className="text-gray-600 text-sm">hello@neuralarc.ai</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <RiPhoneLine className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
            <p className="text-gray-600 text-sm">+971 55 480 0720</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <RiTimeLine className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
            <p className="text-gray-600 text-sm">9.30AM IST - 6.30PM IST</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <RiMessage2Line className="text-gray-400" size={18} />
                  Subject
                </label>
                <input 
                  name="subject"
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <RiMenu2Line className="text-gray-400" size={18} />
                  Message
                </label>
                <textarea 
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-y"
                  placeholder="Tell us more..."
                />
              </div>

              <Button type="submit" isLoading={isLoading}>
                <RiSendPlane2Line size={20} />
                <span>Send Message</span>
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
                <span className="font-medium">Message sent successfully! We&apos;ll respond to your inquiry within 24 hours.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiAddLine, RiCalendarLine, RiMoneyDollarCircleLine, RiFileTextLine } from 'react-icons/ri';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTenderModal({ isOpen, onClose, onSuccess }: CreateTenderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tenders')
        .insert({
          name: data.name,
          description: data.description,
          requirements: data.requirements,
          deadline: data.deadline,
          quoted_amount: parseFloat(data.quotedAmount),
          status: 'pending',
          date_submitted: new Date().toISOString()
        });

      if (error) throw error;

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating tender:', error);
      alert('Failed to create tender. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Tender">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Tender Name</Label>
          <Input id="name" {...register('name', { required: true })} placeholder="e.g. Network Infrastructure Upgrade" />
        </div>

        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="datetime-local" {...register('deadline', { required: true })} />
        </div>

        <div>
          <Label htmlFor="quotedAmount">Quoted Amount ($)</Label>
          <div className="relative">
            <RiMoneyDollarCircleLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              id="quotedAmount" 
              type="number" 
              step="0.01" 
              className="pl-9" 
              {...register('quotedAmount', { required: true })} 
              placeholder="50000.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea 
            id="description" 
            className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
            {...register('description', { required: true })} 
            placeholder="Brief overview of the project scope..."
          />
        </div>

        <div>
          <Label htmlFor="requirements">Requirements & Notes</Label>
          <textarea 
            id="requirements" 
            className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
            {...register('requirements')} 
            placeholder="Specific technical requirements..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            Create Tender
          </Button>
        </div>
      </form>
    </Modal>
  );
}


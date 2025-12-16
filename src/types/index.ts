export interface Tender {
  id: number;
  created_at?: string;
  date_submitted: string;
  name: string;
  deadline: string;
  quoted_amount: number;
  our_submission_date: string | null;
  status: 'submitted' | 'pending';
  description: string;
  requirements: string;
}

export interface SubmittedTender {
  id: number;
  created_at?: string;
  date_submitted: string;
  name: string;
  deadline: string;
  document_url: string;
  document_name: string;
}
